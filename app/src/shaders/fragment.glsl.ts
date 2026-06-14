export const fragmentShader = `
#define NUM_OCTAVES 5

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uProgress;
uniform vec2 uResolution;
uniform int uRevealMode;

const float noiseAmount = 0.4;
const float linesThreshold = 0.4;
const float columnsThreshold = 0.4;
const float blockSize = 15.0;
const float edgeWidth = 0.01;
const vec3 edgeColor = vec3(0.92, 0.92, 0.92);

vec3 mod289v3(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289v2(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289v3(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * snoise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float getBlockRandomness(vec2 st, float blockSize) {
  return random(floor(st / blockSize) * blockSize);
}

float dissolveReveal(vec2 uv, float progress) {
  float noise = snoise(uv * 10.0);
  float threshold = progress * 2.0 - 1.0;
  return step(threshold, noise);
}

float wipeReveal(vec2 uv, float progress) {
  float angle = radians(20.0);
  vec2 direction = vec2(cos(angle), sin(angle));
  float projection = dot(uv, direction);
  float threshold = (progress - 0.5) * 3.0;
  return smoothstep(threshold - edgeWidth, threshold + edgeWidth, projection);
}

float pixelatedReveal(vec2 uv, float progress) {
  vec2 pixelatedUV = floor(uv * blockSize) / blockSize;
  float noise = getBlockRandomness(pixelatedUV, blockSize);
  float threshold = progress * 1.5;
  return step(threshold, noise);
}

float rippleReveal(vec2 uv, float progress) {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(uv, center);
  float ripple = sin(dist * 30.0 - progress * 10.0) * 0.5 + 0.5;
  float mask = smoothstep(progress + 0.1, progress - 0.1, dist);
  return ripple * mask + (1.0 - mask);
}

float mainReveal(vec2 uv, float progress) {
  if (uRevealMode == 0) {
    return dissolveReveal(uv, progress);
  } else if (uRevealMode == 1) {
    return wipeReveal(uv, progress);
  } else if (uRevealMode == 2) {
    return pixelatedReveal(uv, progress);
  } else if (uRevealMode == 3) {
    return rippleReveal(uv, progress);
  }
  return 1.0;
}

void main() {
  vec2 uv = vUv;

  float imageAspect = 1920.0 / 1080.0;
  float screenAspect = uResolution.x / uResolution.y;
  float ratio = imageAspect / screenAspect;

  if (ratio > 1.0) {
    uv.x *= ratio;
    uv.x += (1.0 - ratio) / 2.0;
  } else {
    uv.y /= ratio;
    uv.y += (1.0 - 1.0/ratio) / 2.0;
  }

  vec4 texColor = texture2D(uTexture, uv);
  float noise = fbm(vUv * 5.0);
  float finalProgress = uProgress * (1.0 + noiseAmount + edgeWidth);
  float revealFactor = mainReveal(vUv, finalProgress);
  revealFactor -= noise * noiseAmount;
  revealFactor = clamp(revealFactor, 0.0, 1.0);
  texColor.rgb += (1.0 - texColor.rgb) * (1.0 - revealFactor) * 0.2;
  vec3 finalColor = mix(edgeColor, texColor.rgb, revealFactor);
  gl_FragColor = vec4(finalColor, texColor.a * revealFactor);
}
`;
