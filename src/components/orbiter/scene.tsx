import { Suspense } from "react";
import { Model } from "./model";
import { Canvas, type Vector3 } from "@react-three/fiber";
import { useGLMotion } from "./useGLMotion";
import type { Euler, EulerOrder } from "three";

export const Scene = () => {
  const { rotY } = useGLMotion();

  return (
    <div className="relative bg-transparent aspect-video h-full w-full">
      <Canvas>
        <Suspense fallback="loading">
          <ambientLight intensity={1.5} />
          <spotLight position={[1, 10, 10]} angle={0.1} penumbra={1} />
          <pointLight position={[0, 10, 10]} intensity={1.5} />

          <Model
            position={
              [0.8, -9, -20] as (
                | number
                | Vector3
                | [x: number, y: number, z: number]
              ) &
                Vector3
            }
            rotation={
              [-1.7, rotY, 2.69] as (
                | number
                | Euler
                | [
                    x: number,
                    y: number,
                    z: number,
                    order?: EulerOrder | undefined,
                  ]
              ) &
                Euler
            }
            scale={
              [0.33, 0.33, 0.33] as (
                | number
                | Vector3
                | [x: number, y: number, z: number]
              ) &
                Vector3
            }
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// x: pitch , y: roll, z: yaw
