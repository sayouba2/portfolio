// Noyau GLSL du fond de l'ouverture — méthode « beautiful-shader » : fBm à
// rotation inter-octaves, domain warping d'Iñigo Quilez, couleur tirée des
// champs de warp (jamais des UV bruts), mouvement par le temps injecté dans le
// champ (jamais `uv += time`, qui fait « papier peint qui glisse »).

export const GLSL_CORE = /* glsl */ `
uniform vec3  uBase;
uniform vec3  uC0;
uniform vec3  uC1;
uniform vec3  uC2;
uniform float uScale;
uniform float uWarp;
uniform int   uOctaves;
uniform float uSpeed;
uniform float uAmount;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);
float fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = ROT * p * 2.0;
    a *= 0.5;
  }
  return v;
}

// Quatre décalages temporels différents et non harmoniques : le champ se
// replie sur lui-même au lieu de glisser.
float warpedFbm(vec2 p, float t, float warpAmt, int octaves, out vec2 q, out vec2 r) {
  q = vec2(fbm(p + 0.15 * t, octaves),
           fbm(p + vec2(5.2, 1.3) + 0.13 * t, octaves));
  r = vec2(fbm(p + warpAmt * q + vec2(1.7, 9.2) + 0.11 * t, octaves),
           fbm(p + warpAmt * q + vec2(8.3, 2.8) + 0.09 * t, octaves));
  return fbm(p + warpAmt * r, octaves);
}

vec3 customPalette(float t, vec3 c0, vec3 c1, vec3 c2) {
  t = fract(t);
  if (t < 0.5) return mix(c0, c1, smoothstep(0.0, 1.0, t * 2.0));
  return mix(c1, c2, smoothstep(0.0, 1.0, (t - 0.5) * 2.0));
}
`

/** Hexadécimal → couleur linéaire : mélanger du sRGB assombrit chaque transition. */
export function hexToLinear(hex) {
    const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    return n.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
}
