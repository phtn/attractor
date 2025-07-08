"use client";

import { useEffect, useRef } from "react";

export const XORGlass = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const init = async () => {
      const canvas = canvasRef.current!;

      // Ensure canvas size is set properly
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      if (!navigator.gpu) {
        throw new Error("WebGPU is not supported");
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return console.error("WebGPU not supported.");
      const device = await adapter.requestDevice();
      const context = canvas.getContext("webgpu")!;
      const format = navigator.gpu.getPreferredCanvasFormat();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      console.log("Canvas dimensions:", canvasWidth, canvasHeight);

      context.configure({
        device,
        format,
        alphaMode: "opaque",
      });

      // --- Uniform buffer (time and resolution)
      console.log("Creating uniform buffer...");
      const uniformBuffer = device.createBuffer({
        size: 16, // 4 bytes for time + 8 bytes for resolution (2 x f32) + 4 bytes padding
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" },
          },
        ],
      });

      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: { buffer: uniformBuffer },
          },
        ],
      });

      const vertexShaderCode = `

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

      `;

      const fragmentShaderCode = `


        @group(0) @binding(0) var<uniform> uTime: f32;

        fn hash(n: f32) -> f32 {
            return fract(sin(n) * 43758.5453);
        }

        fn noise(x: vec2<f32>) -> f32 {
            let i = floor(x);
            let f = fract(x);

            let a = hash(dot(i, vec2(1.0, 89.0)));
            let b = hash(dot(i + vec2(1.0, 0.0), vec2(1.0, 89.0)));
            let c = hash(dot(i + vec2(0.0, 1.0), vec2(1.0, 89.0)));
            let d = hash(dot(i + vec2(1.0, 1.0), vec2(1.0, 89.0)));

            let u = f * f * (3.0 - 2.0 * f);
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }

        fn ridge(n: f32) -> f32 {
            return 1.0 - abs(n * 2.14 - 1.0);
        }

        fn peakify(val: f32, curve: f32) -> f32 {
            return pow(val, curve) * (1.0 - pow(val, 2.09));
        }

        @fragment
        fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
            let iResolution = vec2(1280.0, 720.0);
            let uv = fragCoord.xy / iResolution.xy;
            let aspect = iResolution.x / iResolution.y;

            let p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

            let dir = normalize(vec2(p.x, 1.0));
            let depth = 3.5 / (uv.y + 0.01); // fly into top

            let pos = dir * depth + vec2(0.0, uTime * 8.14);

            var dunes = ridge(noise(pos * 0.3)) * 0.7;
            dunes += ridge(noise(pos * 0.6)) * 0.3;
            dunes *= 0.9 + 0.1 * noise(vec2(pos.x * 3.0, uTime * 0.2));
            dunes += peakify(noise(pos * aspect), depth * uTime) * 0.15;

            let light = clamp(dunes * 1.6, 0.0, 1.0);

            let sandTop = vec3(1.0, 0.98, 0.90);
            let sandShadow = vec3(0.9, 0.85, 0.78);
            let sand = mix(sandShadow, sandTop, light);

            let sky = vec3(0.7, 0.88, 1.0);
            let skyBlend = smoothstep(0.7, 1.0, uv.y);
            let boracay = mix(sand, sky, skyBlend);

            let grainCoord = pos * 10.0 + vec2(uTime * 2.0, 0.0);
            let grain = noise(grainCoord);
            let grainIntensity = 0.07;

            let fc = boracay * (1.0 + (grain - 0.5) * grainIntensity);

            return vec4(fc, 1.0);
        }
`;

      const shaderModuleVertex = device.createShaderModule({
        code: vertexShaderCode,
      });

      const shaderModuleFragment = device.createShaderModule({
        code: fragmentShaderCode,
      });
      for (const mod of [shaderModuleVertex, shaderModuleFragment]) {
        mod.getCompilationInfo().then((info) => {
          if (info.messages.length) {
            console.warn("Shader compile log:");
            info.messages.forEach((m) =>
              console.warn(`  ${m.lineNum}:${m.linePos} - ${m.message}`),
            );
          } else {
            console.log("Shader compiled cleanly.");
          }
        });
      }

      const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
          bindGroupLayouts: [bindGroupLayout],
        }),
        vertex: {
          module: shaderModuleVertex,
          entryPoint: "vs_main",
        },
        fragment: {
          module: shaderModuleFragment,
          entryPoint: "fs_main",
          targets: [{ format }],
        },
        primitive: {
          topology: "triangle-list",
        },
      });

      // --- Render loop
      console.log("Starting render loop...");
      const start = performance.now();
      const render = () => {
        const now = performance.now();
        const t = (now - start) / 1000;
        device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array([t, canvasWidth, canvasHeight, 0]), // 0 is padding
        );

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: "clear",
              storeOp: "store",
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
            },
          ],
        });
        pass.setViewport(0, 0, canvasWidth, canvasHeight, 0, 1);
        pass.setScissorRect(0, 0, canvasWidth, canvasHeight);

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);

        pass.draw(6);
        pass.end();

        device.queue.submit([encoder.finish()]);
        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    init().catch((error) => {
      console.error("Failed to initialize WebGPU:", error);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      style={{ width: "100%", height: "100%", display: "block" }}
      className="w-full h-full block absolute z-0 bottom-0 aspect-video"
    />
  );
};
