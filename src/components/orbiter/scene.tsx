import { Suspense, useEffect, useRef, useState } from "react";
import { Model } from "./model";
import { Canvas, useFrame } from "@react-three/fiber";
import { Particles } from "../particles";
import { cn } from "@/lib/utils";
import { Group } from "three";

export const Scene = () => {
  const [rect, setRect] = useState<DOMRect>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const AnimatedModel = () => {
    const ref = useRef<Group>(null);

    useFrame(({ clock }) => {
      if (!ref.current) return;
      const t = clock.getElapsedTime();
      const rotY = getHertz(t / 10, -0.12, 0.12);
      ref.current.position.set(0.8, -5 + rotY / 2, -20 + rotY * 2);
      ref.current.rotation.set(-1.7, rotY, 2.69 + rotY * 2);
      ref.current.scale.set(0.33, 0.33 + rotY, 0.33);
    });

    return (
      <group ref={ref}>
        <Model />
      </group>
    );
  };

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setRect(rect);
    }
  }, []);

  return (
    <div className="relative bg-transparent flex justify-center aspect-video h-full w-full">
      <div
        style={{
          top: (rect?.bottom ?? 1) * 0.22,
          right: (rect?.right ?? 1) * -1.24,
        }}
        className="z-10 absolute rounded-full overflow-hidden w-10 h-4 -rotate-[8deg] flex justify-center"
      >
        <Particles
          className={cn("absolute inset-0 select-none")}
          quantity={800}
          ease={10}
          vx={-1}
          vy={0.5}
          refresh
        />
      </div>
      <div
        style={{
          top: (rect?.bottom ?? 1) * 0.24,
          right: (rect?.right ?? 1) * -1.2,
        }}
        className="z-10 absolute rounded-full overflow-hidden w-14 h-5 -rotate-[26deg] flex justify-center"
      >
        <Particles
          className={cn("absolute inset-0 select-none")}
          quantity={600}
          ease={10}
          vx={-1}
          vy={0.5}
          refresh
        />
      </div>
      <Canvas ref={canvasRef} className="bg-transparent">
        <Suspense fallback="loading">
          <ambientLight intensity={1.5} />
          <spotLight position={[1, 10, 10]} angle={0.1} penumbra={1} />
          <pointLight position={[0, 10, 10]} intensity={1.5} />
          <AnimatedModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

const getHertz = (t: number, min: number, max: number) => {
  const normalizedTime = (t % 2) / 2;
  const oscillationValue =
    min + (max - min) * ((Math.sin(normalizedTime * 2 * Math.PI) + 1) / 2);
  return oscillationValue;
};

// x: pitch , y: roll, z: yaw
