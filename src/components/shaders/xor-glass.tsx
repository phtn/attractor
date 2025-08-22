"use client";

import { useEffect, useRef } from "react";
// import { traverseFS } from "./fragments";
// import { traverseVS } from "./vertex";
import { msVS, msFS } from "./original-xor";

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

      // console.log("Canvas dimensions:", canvasWidth, canvasHeight);

      context.configure({
        device,
        format,
        alphaMode: "opaque",
      });

      // --- Uniform buffer (time and resolution)
      console.log("Rendering surface of Mars ...");
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

      const shaderModuleVertex =
        msVS &&
        device.createShaderModule({
          code: msVS,
        });
      const shaderModuleFragment =
        msFS &&
        device.createShaderModule({
          code: msFS,
        });

      for (const mod of [shaderModuleVertex, shaderModuleFragment]) {
        mod.getCompilationInfo().then((info) => {
          if (info.messages.length) {
            console.warn("Shader compile log:");
            info.messages.forEach((m) =>
              console.warn(`  ${m.lineNum}:${m.linePos} - ${m.message}`),
            );
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
      const start = performance.now();
      const fadeStrength = 1.0;
      const render = () => {
        const now = performance.now();
        const t = (now - start) / 1000;
        device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array([t, fadeStrength, canvasWidth, canvasHeight]),
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

      console.log("Done");
    };

    init().catch((error) => {
      console.error("Failed to initialize WebGPU:", error);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [msVS, msFS]); // eslint-disable-line

  return (
    <canvas
      width={1280}
      height={720}
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      className="w-full bg-zinc-100 h-full block absolute z-0 bottom-0 aspect-video"
    />
  );
};

/*
for(float i,z,d;i++<1e2;o+=(cos(i*.2+vec4(0,1,2,0))+1.)/d){vec3 p=z*normalize(FC.rgb*2.-r.xyy),a=normalize(cos(vec3(0,2,3)+t/2.-i/1e2));p.z+=9.;a=abs(a*dot(a,p)-cross(a,p));z+=d=abs(cos(length(a+a)))/4.+a.y/1e2;}o=tanh(o/4e3);



*/
