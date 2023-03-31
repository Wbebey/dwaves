precision lowp float;

uniform float uTime;
uniform float uAmplitude;

void main() {
  vec3 pos = position;

  vec3 res = vec3(
    pos.x,
    pos.y + (1.0 + sin(uTime * 5.0 + pos.x * 35.0 + pos.y * 10.0) / 2.0) * uAmplitude,
    pos.z
  );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(res, 1.0);
}