// import * as THREE from "three";

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// const material = new THREE.ShaderMaterial({
//   uniforms: {
//     uTime: { value: 0 },
//     uResolution: {
//       value: new THREE.Vector2(window.innerWidth, window.innerHeight),
//     },
//   },
//   vertexShader: `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = vec4(position.xy, 0.0, 1.0);
//     }
//   `,
//   fragmentShader: `
//     precision mediump float;

//     uniform float uTime;
//     uniform vec2 uResolution;
//     varying vec2 vUv;

//     // --- helpers ---
//     float sat(float x){ return clamp(x, 0.0, 1.0); }

//     // Cheap dunes: layered sines with a touch of domain warp
//     float dunes(vec2 p) {
//       // emphasize x; p.y unused (long crests)
//       float x = p.x;
//       float h = 0.0;
//       h += 0.35 * sin(1.2 * x);
//       h += 0.25 * sin(0.7 * x + 0.8 * sin(1.7 * x));
//       h += 0.08 * sin(3.9 * x + 0.5 * sin(0.9 * x));
//       return h;
//     }

//     // Numerical derivative to estimate slope for lighting
//     float dhdx(vec2 p){
//       float e = 0.003;
//       return (dunes(p + vec2(e,0.0)) - dunes(p - vec2(e,0.0))) / (2.0*e);
//     }

//     void main() {
//       // Normalize coords
//       vec2 uv = vUv;
//       vec2 res = uResolution;
//       float aspect = res.x / max(res.y, 1.0);
//       float t = uTime;

//       // Perspective warp: bottom of screen = near ground, top = horizon.
//       // p is NDC centered; stretch x by aspect.
//       vec2 p = uv * 2.0 - 1.0;
//       p.x *= aspect;

//       // Distance to "horizon" proxy. Higher near the horizon; near 0 at bottom.
//       float dist = 1.0 - uv.y + 0.08; // bias to avoid singularities

//       // Project to "world" coordinates:
//       // - Divide lateral by dist for perspective.
//       // - March forward by time (bigger /dist -> faster near camera).
//       float flySpeed = 0.45;  // forward speed
//       vec2 world;
//       world.x = p.x / dist * 1.2;              // lateral stretch
//       world.y = t * flySpeed + 3.0 / dist;     // forward scroll

//       // Height field (depends mostly on x; y only for slow drift/warp if desired)
//       float warp = 0.15 * sin(0.5 * world.y);
//       float h = dunes(vec2(world.x + warp, 0.0));

//       // Simple lighting from a low sun at the right
//       vec3 sunDir = normalize(vec3(0.6, 0.25, 0.75));
//       // Build a fake normal from height slope (x) and "forward" slope (tiny)
//       float slopeX = dhdx(vec2(world.x + warp, 0.0));
//       vec3 n = normalize(vec3(-slopeX, 0.15, 1.0));
//       float ndl = sat(dot(n, sunDir));

//       // Mars-ish palette
//       vec3 darkMars = vec3(0.18, 0.05, 0.03);
//       vec3 midMars  = vec3(0.52, 0.16, 0.07);
//       vec3 hiMars   = vec3(1.00, 0.40, 0.20);

//       // Base color by height (dune crests lighter)
//       float ridge = sat(0.5 + 0.9 * h);
//       vec3 base = mix(darkMars, midMars, ridge);
//       base = mix(base, hiMars, pow(ridge, 3.0));

//       // Light + ambient + distance fog toward horizon
//       float ambient = 0.25;
//       float light = ambient + 1.1 * ndl;

//       // Atmospheric haze (toward horizon/top)
//       float fog = smoothstep(0.0, 0.9, uv.y);
//       vec3 sky = mix(vec3(0.11, 0.06, 0.09), vec3(0.25, 0.18, 0.16), fog); // warm dusty sky

//       // Ground shading
//       vec3 ground = base * light;

//       // Blend ground to sky near horizon with perspective-aware factor
//       float groundWeight = sat(1.0 - smoothstep(0.0, 0.6, uv.y + 0.15 * dist));
//       vec3 col = mix(sky, ground, groundWeight);

//       // Gentle global fade in/out (period ~6s)
//       float fade = 0.5 + 0.5 * sin(t * 1.05);
//       // Ease it a bit to avoid harsh black dips
//       fade = smoothstep(0.0, 1.0, fade);

//       // Subtle auto-exposure curve to avoid saturation
//       col = col / (1.0 + 0.7 * col);

//       gl_FragColor = vec4(col * fade, 1.0);
//     }
//   `,
// });

// const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
// scene.add(quad);

// function onResize() {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   material.uniforms.uResolution.value.set(
//     window.innerWidth,
//     window.innerHeight,
//   );
// }
// window.addEventListener("resize", onResize);

// const clock = new THREE.Clock();
// export function flyOverDunes() {
//   material.uniforms.uTime.value = clock.getElapsedTime();
//   renderer.render(scene, camera);
//   requestAnimationFrame(flyOverDunes);
// }
