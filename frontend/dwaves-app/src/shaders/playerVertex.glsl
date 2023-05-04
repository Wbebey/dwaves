precision lowp float;

uniform float uTime;

// float soft(float v) {
//   float res = 6.0 * pow(v, 5.0) - 15.0 * pow(v, 4.0) + 10.0 * pow(v, 3.0);
//   return fract(res);
// }

// float random(float seed){
//   float S = dot(vec3(seed), vec3(127.1, 311.7, 783.089));
//   return fract(sin(S) * 43758.5453123);
// }

// float perlin(float seed) {
//   float p1 = random(floor(seed));
//   float p2 = random(floor(seed) + 1.0);

//   float d1 = floor(seed) - seed;
//   float d2 = floor(seed) + 1.0 - seed;

//   float weight = soft(fract(seed));

//   return mix(dot(p1, d1), dot(p2, d2), weight);
// }

void main() {
  vec3 pos = position;
  pos.y += 0.025;

  vec3 res = vec3(
    pos.x,
    pos.y + sin(uTime * 5.0 + pos.x * 35.0 + pos.y * 10.0) * 0.005,
    pos.z
  );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(res, 1.0);
}