"use client";

import { useEffect, useRef } from "react";

export const XorGlass = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const initWebGPU = async () => {
      if (!navigator.gpu) return;
      const adapter = await navigator.gpu.requestAdapter();
      const device = (await adapter?.requestDevice()) as GPUDevice;
      const canvas = canvasRef.current!;

      if (!canvas) return;
      if (!device) return;

      const context = canvas.getContext("webgpu");
      if (!context) return;

      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: "opaque",
      });

      const desertFragmentModule = device.createShaderModule({
        code: `
        @group(0) @binding(0) var<uniform> uTime: f32;

        fn hash(n: f32) -> f32 {
            return fract(sin(n) * 43758.5453123);
        }

        fn noise(x: vec2<f32>) -> f32 {
            let i = floor(x);
            let f = fract(x);

            let a = hash(dot(i, vec2(1.0, 57.0)));
            let b = hash(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
            let c = hash(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
            let d = hash(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));

            let u = f * f * (3.0 - 2.0 * f);
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        @fragment
        fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
            let iResolution = vec2(800.0, 600.0); // replace with dynamic resolution if needed
            let uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
            let aspect = iResolution.x / iResolution.y;
            let p = vec2(uv.x * aspect, uv.y);

            // Scroll forward
            let speed = 1.5;
            let t = uTime * speed;
            let pos = vec2(p.x * 2.0, t + p.y * 10.0);

            // Terrain shape (dunes via noise)
            var height = noise(pos * 0.2) * 0.5;
            height += noise(pos * 0.5) * 0.25;
            height += noise(pos * 1.0) * 0.1;

            let brightness = smoothstep(0.0, 0.5, height - p.y);

            // Color palette: desert golds and browns
            let sand = vec3(0.96, 0.75, 0.48);
            let darker = vec3(0.8, 0.6, 0.3);
            let sky = vec3(0.7, 0.9, 1.0);

            let color = mix(sky, mix(darker, sand, brightness), step(0.0, p.y));

            return vec4(color, 1.0);
        }
        `,
      });

      const desertVertexModule = device.createShaderModule({
        code: `

        @vertex
        fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
            var positions = array<vec2<f32>, 6>(
                vec2(-1.0, -1.0),
                vec2(1.0, -1.0),
                vec2(-1.0, 1.0),
                vec2(-1.0, 1.0),
                vec2(1.0, -1.0),
                vec2(1.0, 1.0),
            );
            let pos = positions[vertexIndex];
            return vec4(pos, 0.0, 1.0);
        }
        `,
      });

      const uniformBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const pipeline = device.createRenderPipeline({
        vertex: {
          module: desertVertexModule,
          entryPoint: "main",
        },
        fragment: {
          module: desertFragmentModule,
          entryPoint: "main",
          targets: [{ format }],
        },
        layout: "auto",
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: uniformBuffer,
            },
          },
        ],
      });

      const render = () => {
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: "clear",
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              storeOp: "store",
            },
          ],
        });

        const now = performance.now();
        const time = (now - startTime) / 1000;
        device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([time]));

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    initWebGPU();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={709}
      height={429}
      className="w-full h-full"
    />
  );
};
