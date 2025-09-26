import { useGLTF } from '@react-three/drei'
import type { Mesh, Material } from 'three'
import type { Euler, Vector3 } from '@react-three/fiber'
import { forwardRef, memo, type ComponentProps } from 'react'
import { Group } from 'three'

const shuttle = '/3d/scene.glb'

interface ModelProps extends ComponentProps<'group'> {
  position?: Vector3 | [number, number, number];
  rotation?: Euler | [number, number, number];
  scale?: Vector3 | [number, number, number];
}

const ModelComponent = forwardRef<Group, ModelProps>(
  ({ position, rotation, scale, ...props }, ref) => {
    const { nodes, materials } = useGLTF(shuttle) as unknown as {
      nodes: Record<string, Mesh>;
      materials: Record<string, Material>;
    }

    return (
      <group
        ref={ref}
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
          ) : null
        )}
      </group>
    )
  }
)
ModelComponent.displayName = 'ModelComponent'

export const Model = memo(ModelComponent)
useGLTF.preload(shuttle)
