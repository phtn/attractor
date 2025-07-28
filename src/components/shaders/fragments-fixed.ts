export const traverseFS = `
  struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) uv: vec2<f32>,
  };

  @vertex
  fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
      var output: VertexOutput;

      // Full-screen quad vertices (6 vertices for 2 triangles)
      var positions = array<vec2<f32>, 6>(
          vec2<f32>(-1.0, -1.0), // Bottom left
          vec2<f32>( 1.0, -1.0), // Bottom right
          vec2<f32>(-1.0,  1.0), // Top left
          vec2<f32>( 1.0, -1.0), // Bottom right
          vec2<f32>( 1.0,  1.0), // Top right
          vec2<f32>(-1.0,  1.0)  // Top left
      );

      var uvs = array<vec2<f32>, 6>(
          vec2<f32>(0.0, 0.0), // Bottom left
          vec2<f32>(1.0, 0.0), // Bottom right
          vec2<f32>(0.0, 1.0), // Top left
          vec2<f32>(1.0, 0.0), // Bottom right
          vec2<f32>(1.0, 1.0), // Top right
          vec2<f32>(0.0, 1.0)  // Top left
      );

      output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
      output.uv = uvs[vertexIndex];

      return output;
  }

  @group(0) @binding(0) var<uniform> uTime: f32;

  @fragment
  fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
      let uv = input.uv;
      let iResolution = vec2(1280.0, 720.0);
      var aspect = f32(0.0);

      if (iResolution.x > iResolution.y){
        aspect = iResolution.x / iResolution.y;
      } else {
        aspect = iResolution.x/6 ;
      };

      let coord = vec2(uv.x * 2.0 - 1.0, uv.y * 3.0 - 1.0);
      let screen = vec2(coord.x * aspect, coord.y);
      let rayDir = normalize(vec3(screen, 1));
      let t = uTime;
      var col = vec3(0.0);
      var z = 0.1;
      var p = vec3(0.0);

      for (var i = 0u; i < 18u; i = i + 1u) {
          p = z * rayDir;
          p.z += t * 0.25;
          p = vec3(p.x * 0.75, p.y * 0.4, p.z);
          let wave = sin(p + sin(p * 7.) / 4.5);
          let shape = dot(cos(p / 0.6), wave.zyx);
          let d = abs(shape * 0.4 + p.y / 0.7 + 0.7);

          let stepSize = max(d, 0.02);

          let colMod = cos(p.y * (0.6 + 0.5 * z) + vec3(6.0, 5.0, 4.8)) + vec3(1.);
          let safeZ = max(z, 0.01);
          col += colMod * stepSize / safeZ / 7.5;
          z += stepSize;

          if (z > 100.0) {
              break;
          }
      }

      // Only change: prevent white saturation with simple division
      col = col / (1.0 + col);
      return vec4(col, 1.0);
  }
  `;