const canvasWidth = 0;
const canvasHeight = 0;

export const xor_glass = `
  @fragment
          fn main(@location(0) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
            let r = vec2<f32>(${"canvasWidth"}.0, ${"canvasHeight"}.0);
            let uv = (fragCoord - 0.5 * r) / r.y;
            var o = 0.0;
            var z = 0.0;
            let t = time;

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
              o = o + (1.0 + cos(i * 0.7 + t + vec4<f32>(6.0, 1.0, 2.0, 0.0)).x) / d / i;
            }

            o = tanh(o * o / 900.0);
            return vec4<f32>(vec3<f32>(o), 1.0);
          }
  `;

export const gradients = `
        @group(0) @binding(0) var<uniform> time : f32;
        @fragment
        fn main(@location(0) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
          let res = vec2<f32>(${canvasWidth}.0, ${canvasHeight}.0);
          let uv = fragCoord / res;

          // Simple colorful pattern that should always work
          let r = sin(uv.x * 3.14159) * 0.5 + 0.5;
          let g = sin(uv.y * 3.14159) * 0.5 + 0.5;
          let b = sin((uv.x + uv.y) * 3.14159) * 0.5 + 0.5;

          return vec4<f32>(r, g, b, 1.0);
        }
      `;

export const _fragmentShaderCode = `
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
            // Fix: construct vec4 properly
            let cosResult = 0.1 * cos(p * 3.0) - 0.1;
            d = 0.2 * length(vec4<f32>(cosResult.x, cosResult.y, cosResult.z, p.z));
            z = z + d;
            // Fix: proper vec4 arithmetic
            let baseVec = vec4<f32>(6.0, 1.0, 2.0, 0.0);
            let timeOffset = i * 0.7 + t;
            o = o + (1.0 + cos(timeOffset + baseVec.x)) / (d * i);
          }
          o = tanh(o * o / 900.0);
          return vec4<f32>(vec3<f32>(o), 1.0);
        }
      `;

export const scode = `
        @group(0) @binding(0) var<uniform> time : f32;

        @fragment
        fn main(@location(0) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
          let r = vec2(708.0, 429.0); // resolution placeholder
          let uv = (fragCoord - 0.5 * r) / r.y;
          var o = 0.0;
          var z = 0.0;
          var t = time;

          for (var i = 1.0; i <= 100.0; i = i + 1.0) {
            let dir = normalize(vec3(uv * 2.0 - r.xyx / r.y, 1.0));
            var p = z * dir;
            p = vec3(atan2(p.y, p.x) * 2.0, p.z / 3.0, length(p.xy) - 6.0);

            var d = 1.0;
            for (var j = 1.0; j < 9.0; j = j + 1.0) {
              p = p + sin(p.yzx * j - t + 0.2 * i) / j;
            }

            d = 0.2 * length(vec4(0.1 * cos(p * 3.0) - 0.1, p.z));
            z = z + d;
            o = o + (1.0 + cos(i * 0.7 + t + vec4<f32>(6.0, 1.0, 2.0, 0.0)).x) / d / i;
          }

          o = tanh(o * o / 900.0);
          return vec4<f32>(vec3(o), 1.0);
        }
`;

export const vcode = `
                    @vertex
                    fn main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4<f32> {
                      var pos = array<vec2<f32>, 6>(
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>(1.0, -1.0),
                        vec2<f32>(-1.0, 1.0),
                        vec2<f32>(-1.0, 1.0),
                        vec2<f32>(1.0, -1.0),
                        vec2<f32>(1.0, 1.0),
                      );
                      return vec4<f32>(pos[index], 0.0, 1.0);
                    }
                  `;

export const marsFS = `
  @group(0) @binding(0) var<uniform> uTime: f32;

          fn hash(n: f32) -> f32 {
              return fract(sin(n) * 43758.5453);
          }

          fn noise(x: vec2<f32>) -> f32 {
              let i = floor(x);
              let f = fract(x);
              let a = hash(dot(i, vec2(1.0, 57.0)));
              let b = hash(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
              let c = hash(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
              let d = hash(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));
              let u = f * f * (3.0 - 2.0 * f);
              return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
          }

          fn ridge(n: f32) -> f32 {
              return 1.0 - abs(n * 2.0 - 1.0);
          }

          fn peakify(val: f32, curve: f32) -> f32 {
              return pow(val, curve) * (1.0 - pow(val, 2.0));
          }

          @fragment
          fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
              let iResolution = vec2(800.0, 600.0);
              let uv = fragCoord.xy / iResolution.xy;
              let aspect = iResolution.x / iResolution.y;
              let p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

              let dir = normalize(vec2(p.x, 1.0));
              let depth = 2.5 / (uv.y + 0.01);
              let pos = dir * depth + vec2(0.0, uTime * 1.5);

              var dunes = ridge(noise(pos * 0.3)) * 0.7;
              dunes += ridge(noise(pos * 0.6)) * 0.3;
              dunes *= 0.9 + 0.1 * noise(vec2(pos.x * 5.0, uTime * 0.1));
              dunes += peakify(noise(pos * 0.15), 4.0) * 0.2;

              let light = clamp(dunes * 1.7, 0.0, 1.0);

              // ✅ Mars colors
              let sandTop = vec3(0.95, 0.38, 0.15);     // bright red-orange
              let sandShadow = vec3(0.3, 0.05, 0.01);   // deep dark red
              let color = mix(sandShadow, sandTop, light);

              // ✅ Atmospheric haze near bottom
              let fogStrength = smoothstep(0.0, 1.0, uv.y) * 0.5;
              let fogColor = vec3(0.8, 0.4, 0.2);
              let withFog = mix(color, fogColor, fogStrength);

              // ✅ Mars sky
              let skyTop = vec3(0.0, 0.0, 0.0); // space
              let skyHorizon = vec3(1.0, 0.7, 0.1); // sunrise
              let skyColor = mix(skyTop, skyHorizon, smoothstep(0.6, 1.0, uv.y));

              let finalColor = mix(withFog, skyColor, smoothstep(0.85, 1.0, uv.y));

              return vec4(finalColor, 1.0);
          }
  `;

export const traverseFS = `
  // Vertex shader for full-screen quad
  struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) uv: vec2<f32>,
  }

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
      let aspect = iResolution.x / iResolution.y;
      let coord = vec2(uv.x * 2.0 - 1.0, uv.y * 3.0 - 1.0);
      let screen = vec2(coord.x * aspect, coord.y);
      let rayDir = normalize(vec3(screen, 1));
      let t = uTime;
      var col = vec3(0.0);
      var z = 0.1;
      var p = vec3(0.0);
      /*
     vec3 p;
     for(float i,z,d;
        i++<2e1;
        o+=(cos(p.y/(.1+.05*z)+
        vec4(6,5,4,0))+1.)*d/z/7.)
        p=z*normalize(FC.rgb*2.-r.xyy),
        p.z-=t,p.xy*=.4,
        z+=d=(dot(cos(p/.6),
        sin(p+sin(p*7.)/4.).zyx)
        *.4+p.y/.7+.7);
        o=tanh(o*o);
      */

      for (var i = 0u; i < 18u; i = i + 1u) {
          p = z * rayDir;
          p.z += t * 0.25;
          p = vec3(p.x * 0.75, p.y * 0.4, p.z);
          let wave = sin(p + sin(p * 7.) / 4.5);
          let shape = dot(cos(p / 0.6), wave.zyx);
          let d = abs(shape * 0.4 + p.y / 0.7 + 0.7);

          let stepSize = max(d, 0.02);

          let colMod = cos(p.y * (0.6 + 0.14 * z) + vec3(6.0, 5.0, 4.8)) + vec3(1.);
          let safeZ = max(z, 0.01);
          col += colMod * stepSize / safeZ / 7.5;
          z += stepSize;

          if (z > 100.0) {
              break;
          }
      }

      col = tanh(col * col);
      return vec4(col, 1.0);
  }
  `;
