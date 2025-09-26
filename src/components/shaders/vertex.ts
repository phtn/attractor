export const marsVS = `
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
      `

export const traverseVS = `
  @vertex
  fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
      // Create a full-screen triangle
      let x = f32(i32(vertexIndex) - 1);
      let y = f32(i32(vertexIndex & 1u) * 2 - 1);
      return vec4<f32>(x, y, 0.0, 1.0);
  }  `
