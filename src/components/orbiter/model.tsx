import { useGLTF } from "@react-three/drei";
import type { Mesh, Material } from "three";
import type { Euler, Vector3 } from "@react-three/fiber";
import { memo, type ComponentProps } from "react";

const shuttle = "/3d/space_shuttle.glb";

interface ModelProps extends ComponentProps<"group"> {
  position?: Vector3 | [number, number, number];
  rotation?: Euler | [number, number, number];
  scale?: Vector3 | [number, number, number];
}

const ModelComponent = ({
  position,
  rotation,
  scale,
  ...props
}: ModelProps) => {
  const { nodes, materials } = useGLTF(shuttle) as unknown as {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
      dispose={null}
    >
      {Object.entries(nodes).map(([key, node]) =>
        node.geometry ? ( // Ensure it's a mesh with geometry
          <mesh
            key={key}
            castShadow
            receiveShadow
            geometry={node.geometry}
            material={materials[key] ?? node.material}
          />
        ) : null,
      )}
    </group>
  );
};

export const Model = memo(ModelComponent);
useGLTF.preload(shuttle);
