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

      const shaderModule = device.createShaderModule({
        code: `
        @group(0) @binding(0) var<uniform> time : f32;

        @fragment
        fn main(@location(0) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
          let r = vec2(708.0, 429.0); // resolution placeholder
          let uv = (fragCoord - 0.5 * r) / r.y;
          var o = 0.0;
          var z = 0.0;
          var t = time;

          for (var i = 1.0; i <= 100.0; i = i + 1.0) {
            let dir = normalize(vec3(uv * 2.0 - r.xyx / r.y, 1.0));
            var p = z * dir;
            p = vec3(atan2(p.y, p.x) * 2.0, p.z / 3.0, length(p.xy) - 6.0);

            var d = 1.0;
            for (var j = 1.0; j < 9.0; j = j + 1.0) {
              p = p + sin(p.yzx * j - t + 0.2 * i) / j;
            }

            d = 0.2 * length(vec4(0.1 * cos(p * 3.0) - 0.1, p.z));
            z = z + d;
            o = o + (1.0 + cos(i * 0.7 + t + vec4<f32>(6.0, 1.0, 2.0, 0.0)).x) / d / i;
          }

          o = tanh(o * o / 900.0);
          return vec4<f32>(vec3(o), 1.0);
        }
`,
      });

      const uniformBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const pipeline = device.createRenderPipeline({
        vertex: {
          module: device.createShaderModule({
            code: `
              @vertex
              fn main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4<f32> {
                var pos = array<vec2<f32>, 6>(
                  vec2<f32>(-1.0, -1.0),
                  vec2<f32>(1.0, -1.0),
                  vec2<f32>(-1.0, 1.0),
                  vec2<f32>(-1.0, 1.0),
                  vec2<f32>(1.0, -1.0),
                  vec2<f32>(1.0, 1.0),
                );
                return vec4<f32>(pos[index], 0.0, 1.0);
              }
            `,
          }),
          entryPoint: "main",
        },
        fragment: {
          module: shaderModule,
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
