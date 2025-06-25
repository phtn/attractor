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
