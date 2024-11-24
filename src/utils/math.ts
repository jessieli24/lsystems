export function fract(x: number) {
  return x - Math.floor(x)
}

// https://github.com/patriciogonzalezvivo/thebookofshaders/blob/master/10/1d-random.frag
export function random(x: number) {
  return fract(Math.sin(x) * 43758.5453)
}

export function deg2rad(x: number) {
  return x / 180.0 * Math.PI
}

export function rad2deg(x: number) {
  return x * 180.0 / Math.PI
}
