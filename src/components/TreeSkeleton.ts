/**
 * TreeSkeleton.ts
 *
 * Jessie Li, CS 77/277 Fall 2024
 *
 * References:
 * - General approach to L-systems: https://github.com/FrancescoGradi/L-System-Trees/tree/master
 * - Data structures and branch transformations: https://github.com/dgreenheck/ez-tree/blob/main/src/lib/tree.js
 * - Drawing points and segments: https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawrange.html#L45
 */

import * as THREE from 'three'
import { deg2rad } from '../utils/math'

const maxPointCount = 800
const maxSegmentPointsCount = maxPointCount * maxPointCount

const pointMaterial = new THREE.PointsMaterial({
  color: 0x0000000,
  size: 4,
  sizeAttenuation: false,
})

const segmentMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  linewidth: 7,
})

interface TreeGeometry {
  points: Float32Array
  segments: Float32Array
  pointIndex: number
  segmentPointsIndex: number
}

export interface TreeParameters {
  angle: number
  rules: { [key: string]: string }
  axiom: string
  draw: object
}

class Branch {
  origin: THREE.Vector3
  orientation: THREE.Euler
  length: number

  constructor(
    origin: THREE.Vector3 = new THREE.Vector3(),
    orientation: THREE.Euler = new THREE.Euler(),
    length: number = 0,
  ) {
    this.origin = origin
    this.orientation = orientation
    this.length = length
  }

  public clone() {
    return new Branch(this.origin.clone(), this.orientation.clone(), this.length)
  }
}

export default class Tree {
  group: THREE.Group
  pointCloud: THREE.Points | undefined
  root: Branch
  rootPosition: THREE.Vector3
  angle: number
  axiom: string
  rules: { [key: string]: string }
  iterations: number
  initialBranchLength: number
  lengthReductionFactor: number

  branches: TreeGeometry = {
    points: new Float32Array(maxPointCount * 3),
    segments: new Float32Array(maxSegmentPointsCount * 3),
    pointIndex: 0,
    segmentPointsIndex: 0,
  }

  constructor(
    rootPosition: THREE.Vector3 = new THREE.Vector3(),
    axiom: string = 'f',
    angle: number = 30,
    rules: { [key: string]: string } = { f: 'f[+f]f[-f]f' },
    iterations: number = 1,
    initialBranchLength: number = 5,
    lengthReductionFactor: number = 0.05,
  ) {
    this.group = new THREE.Group()

    this.rootPosition = rootPosition
    this.root = new Branch(
      rootPosition,
      new THREE.Euler(),
      initialBranchLength,
    )

    this.angle = deg2rad(angle)
    this.iterations = iterations
    this.initialBranchLength = initialBranchLength
    this.lengthReductionFactor = lengthReductionFactor

    this.axiom = axiom
    this.rules = rules
  }

  public grow() {
    this.branches = {
      points: new Float32Array(maxPointCount * 3),
      segments: new Float32Array(maxSegmentPointsCount * 3),
      pointIndex: 0,
      segmentPointsIndex: 0,
    }

    this.root = new Branch(
      this.rootPosition,
      new THREE.Euler(),
      this.initialBranchLength,
    )

    // add root
    this.branches.points[this.branches.pointIndex++] = this.root.origin.x
    this.branches.points[this.branches.pointIndex++] = this.root.origin.y
    this.branches.points[this.branches.pointIndex++] = this.root.origin.z

    // generating a tree is analagous to growing a fringe / finding all leaves of a tree
    this.growFringe(this.root, this.axiom, this.iterations)

    this.createGeometry()
  }

  private createGeometry() {
    const points = new THREE.BufferGeometry()

    points.setDrawRange(0, this.branches.pointIndex / 3)
    points.setAttribute('position', new THREE.BufferAttribute(this.branches.points, 3).setUsage(THREE.DynamicDrawUsage))

    const pointCloud = new THREE.Points(points, pointMaterial)
    this.pointCloud = pointCloud
    this.group.add(pointCloud)

    const segments = new THREE.BufferGeometry()

    segments.setDrawRange(0, this.branches.segmentPointsIndex / 3)
    segments.setAttribute('position', new THREE.BufferAttribute(this.branches.segments, 3).setUsage(THREE.DynamicDrawUsage))
    segments.computeBoundingSphere()

    const linesMesh = new THREE.LineSegments(segments, segmentMaterial)
    this.group.add(linesMesh)
  }

  private growFringe(root: Branch, rule: string, depth: number) {
    if (depth < 0) {
      return root
    }

    const stack: Branch[] = []

    for (let i = 0; i < rule.length; i++) {
      const key = rule.charAt(i)
      switch (key) {
        case '+':
          root.orientation.x += this.angle
          continue
        case '-':
          root.orientation.x -= this.angle
          continue
        case '^':
          root.orientation.y += this.angle
          continue
        case 'v':
          root.orientation.y -= this.angle
          continue
        case '>':
          root.orientation.z += this.angle
          continue
        case '<':
          root.orientation.z -= this.angle
          continue
        case '[':
          stack.push(root.clone())

          continue
        case ']':
          root = stack.pop() || root
          continue
      }

      // grow a branch

      if (depth === 0 || !(key in this.rules)) {
        // also updates root location to the end of the branch
        this.addBranchVerticesToMesh(root)
        continue
      }

      if (!(key in this.rules)) {
        // unknown character, no rule for expanding this branch
        continue
      }

      root = this.growFringe(root, this.rules[key], depth - 1)
    }

    return root
  }

  private addBranchVerticesToMesh(branch: Branch) {
    const orientation = branch.orientation
    const origin = branch.origin

    const branchTopEndpoint = new THREE.Vector3(0, 1, 0)
      .multiplyScalar(branch.length)
      .applyEuler(orientation)
      .add(origin)

    this.branches.points[this.branches.pointIndex++] = branchTopEndpoint.x
    this.branches.points[this.branches.pointIndex++] = branchTopEndpoint.y
    this.branches.points[this.branches.pointIndex++] = branchTopEndpoint.z

    this.branches.segments[this.branches.segmentPointsIndex++] = origin.x
    this.branches.segments[this.branches.segmentPointsIndex++] = origin.y
    this.branches.segments[this.branches.segmentPointsIndex++] = origin.z
    this.branches.segments[this.branches.segmentPointsIndex++] = branchTopEndpoint.x
    this.branches.segments[this.branches.segmentPointsIndex++] = branchTopEndpoint.y
    this.branches.segments[this.branches.segmentPointsIndex++] = branchTopEndpoint.z

    branch.origin = branchTopEndpoint
    branch.length *= (1 - this.lengthReductionFactor)
  }
}
