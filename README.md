# L-System Trees
## Jessie Li

Small experiment using L-systems to generate tree wireframes. Examples are available in the `images` folder.

### Usage

```
pnpm install
pnpm run dev
```

### References
Implementation:
* General approach: [L-System-Trees](https://github.com/FrancescoGradi/L-System-Trees/tree/master)
* Data structures and branch transformations: [E-Z Tree](https://github.com/dgreenheck/ez-tree/blob/main/src/lib/tree.js)
* Drawing points and segments: THREE.js [buffergeometry / drawrange example](https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawrange.html#L45)
* Basic THREE.js setup: [The Making of “The Aviator”](https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/) on Codrops
* [THREE.js examples](https://github.com/mrdoob/three.js/tree/dev/examples)

Axioms/Rules:
* [Tree 1](https://github.com/mrtj/lsystem/blob/main/examples/weed1.json)
* [Tree 2](https://www.carl-olsson.com/project/l-system/)
* [Tree 3](https://people.ece.cornell.edu/land/OldStudentProjects/cs490-94to95/hwchen/)
* [Tree 4](https://github.com/abiusx/L3D/blob/master/L/seaweed.l3d)
