"use client";

import { useEffect, useRef } from "react";

export const XORGlass = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const init = async () => {
      const canvas = canvasRef.current!;
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return console.error("WebGPU not supported.");
      const device = await adapter.requestDevice();
      const context = canvas.getContext("webgpu")!;
      const format = navigator.gpu.getPreferredCanvasFormat();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      console.log(canvasWidth, canvasHeight);

      context.configure({
        device,
        format,
        alphaMode: "opaque",
      });

      // --- Uniform buffer (time)
      const uniformBuffer = device.createBuffer({
        size: 4,
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

      // --- Shader modules
      const vertexShaderCode = `
        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) fragCoord: vec2<f32>,
        };

        @vertex
        fn main(@builtin(vertex_index) index: u32) -> VertexOutput {
          var pos = array<vec2<f32>, 6>(
            vec2<f32>(-1.0, -1.0),
            vec2<f32>(1.0, -1.0),
            vec2<f32>(-1.0, 1.0),
            vec2<f32>(-1.0, 1.0),
            vec2<f32>(1.0, -1.0),
            vec2<f32>(1.0, 1.0)
          );

          var out: VertexOutput;
          out.position = vec4<f32>(pos[index], 0.0, 1.0);
          out.fragCoord = (pos[index] + vec2<f32>(1.0)) * 0.5 * vec2<f32>(${canvasWidth}.0, ${canvasHeight}.0);
          return out;
        }
      `;

      const fragmentShaderCode = `
        @group(0) @binding(0) var<uniform> time : f32;


        @fragment
          fn main(@location(0) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
          let res = vec2<f32>(${canvasWidth}.0, ${canvasHeight}.0);
          let uv = (fragCoord - 0.5 * res) / res.y;
          let t = time;

          var z = 0.0;
          var o = 0.0;

          for (var i = 1.0; i <= 100.0; i = i + 1.0) {
          let dir = normalize(vec3<f32>(uv, 1.0));
          var p = z * dir;

          p = vec3<f32>(atan2(p.y, p.x) * 2.0, p.z / 3.0, length(p.xy) - 6.0);

          var d = 1.0;
          for (var j = 1.0; j < 9.0; j = j + 1.0) {
          p = p + sin(p.yzx * j - t + 0.2 * i) / j;
          }

          d = 0.2 * length(vec4<f32>(0.1 * cos(p * 3.0) - 0.1, p.z));
          z = z + d;

          o = o + (1.0 + cos(i * 0.7 + t + vec4<f32>(6.0, 1.0, 2.0, 0.0)).x) / (d * i);
          }

          o = tanh(o * o / 900.0);
          return vec4<f32>(vec3<f32>(o), 1.0);
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
          entryPoint: "main",
        },
        fragment: {
          module: shaderModuleFragment,
          entryPoint: "main",
          targets: [{ format }],
        },
        primitive: {
          topology: "triangle-list",
        },
      });

      // --- Render loop
      const start = performance.now();
      const render = () => {
        const now = performance.now();
        const t = (now - start) / 1000;
        device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([t]));

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

    init();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="w-full h-full block"
    />
  );
};
