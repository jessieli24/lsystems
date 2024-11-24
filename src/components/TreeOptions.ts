import * as THREE from 'three'

// example: https://github.com/mrtj/lsystem/blob/main/examples/weed1.json
export interface TreeOption {
  angle: number
  rules: Record<string, string>
  axiom: string
  rootPosition: THREE.Vector3
}

// https://github.com/mrtj/lsystem/blob/main/examples/weed1.json
export const Tree1: TreeOption = {
  angle: 30,
  rules: { F: 'F[+F]F[-F]F' },
  axiom: 'F',
  rootPosition: new THREE.Vector3(0, -15, 0),
}

// Simple Tree from https://www.carl-olsson.com/project/l-system/
export const Tree2: TreeOption = {
  angle: 25,
  rules: { A: 'f[++A]<[--A]>>>A' },
  axiom: 'fffA',
  rootPosition: new THREE.Vector3(0, -15, 0),
}

// https://people.ece.cornell.edu/land/OldStudentProjects/cs490-94to95/hwchen/
export const Tree3: TreeOption = {
  angle: 25,
  rules: { F: 'F[^+F]F[->F][->F][^F]' },
  axiom: 'F',
  rootPosition: new THREE.Vector3(0, -50, 0),
}

// https://github.com/abiusx/L3D/blob/master/L/seaweed.l3d
export const Tree4: TreeOption = {
  angle: 15,
  rules: {
    f: 'ff-[<f>f>f]+[<f>f>f]^[>f>f<f]',
  },
  axiom: 'f',
  rootPosition: new THREE.Vector3(0, -50, 0),
}
