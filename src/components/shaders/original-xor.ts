export const msVS = `
  struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) uv: vec2<f32>,
  };

  @vertex
  fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
      var output: VertexOutput;

      // Full-screen quad (two triangles, 6 vertices)
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
`;

export const msFS = `
  struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) uv: vec2<f32>,
  };

  struct Uniforms {
      iTime: f32,
      fadeStrength: f32,
      iResolution: vec2<f32>,
  };

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;

  @fragment
  fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
      var uv = in.uv;

      var fc = vec3<f32>(uv * uniforms.iResolution, 0.0);
      var r = vec3<f32>(uniforms.iResolution.x, uniforms.iResolution.y, uniforms.iResolution.y);

      var o = vec4<f32>(0.0);
      var p: vec3<f32> = vec3<f32>(0.0);
      var z: f32 = 0.0;
      var d: f32 = 0.0;
      var t = uniforms.iTime * 0.8;

      for (var idx: i32 = 0; idx < 33; idx = idx + 1) {
          p = z * normalize(fc * 2.0 - r);
          p.z = p.z - t;
          p = vec3<f32>(p.xy * 0.4, p.z);

          let sin_p = sin(p + sin(p * 7.0) / 4.0);
          d = dot(cos(p / 0.6), sin_p.zyx) * 0.4 + p.y / 0.7 + 0.7;
          z = z + d;

          let height = p.y / (0.1 + 0.05 * z);
          o = o + (cos(vec4<f32>(height, height, height, height) + vec4<f32>(6.0,5.0,4.0,0.0)) + vec4<f32>(1.0)) * (d / z / 4.);
      }

      o = tanh(o * o);

      var color = o.rgb;

      // var fade = abs(sin(uniforms.iTime * uniforms.fadeStrength));
      // color = color * fade;

      return vec4<f32>(color * 1.025 * vec3<f32>(1.0, 0.5, 0.25), 1.0);
  }
`;
