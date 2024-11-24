import type { TreeOption } from './components/TreeOptions'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { Tree1, Tree2, Tree3, Tree4 } from './components/TreeOptions'
import Tree from './components/TreeSkeleton'
import './main.css'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const aspect = window.innerWidth / window.innerHeight

let container: HTMLElement | null

let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let controls: OrbitControls
let guiData: any

let tree: Tree
let ground: THREE.Mesh

const treeFileList = {
  'Tree 1': Tree1,
  'Tree 2': Tree2,
  'Tree 3': Tree3,
  'Tree 4': Tree4,
}

window.addEventListener('load', init, false)

function initGUI() {
  const gui = new GUI()

  guiData = {
    variant: treeFileList['Tree 1'],
    iterations: 2,
    initialBranchLength: 10,
    pointSize: 4,
  }

  // Add dropdown menu
  gui.add(guiData, 'variant', treeFileList)
    .name('variant')
    .onChange((model: TreeOption) => {
      scene.remove(tree.group)
      ground.position.set(0, model.rootPosition.y, 0)
      tree = new Tree(model.rootPosition, model.axiom, model.angle, model.rules, guiData.iterations, guiData.initialBranchLength)
      tree.grow()
      scene.add(tree.group)
    })

  gui.add(guiData, 'iterations', 0, 5, 1)
    .name('iterations')
    .onChange((i) => {
      const model = guiData.variant
      scene.remove(tree.group)
      tree = new Tree(model.rootPosition, model.axiom, model.angle, model.rules, i, guiData.initialBranchLength)
      tree.grow()
      scene.add(tree.group)
    })

  gui.add(guiData, 'initialBranchLength', 5, 20)
    .onChange((i) => {
      const model = guiData.variant
      scene.remove(tree.group)
      tree = new Tree(model.rootPosition, model.axiom, model.angle, model.rules, guiData.iterations, i)
      tree.grow()
      scene.add(tree.group)
    })

  gui.add(guiData, 'pointSize', 0, 8, 1)
    .onChange((i) => {
      if (tree.pointCloud && tree.pointCloud.material instanceof THREE.PointsMaterial) {
        tree.pointCloud.material.size = i
      }
    })
}

function init() {
  initGUI()

  container = document.getElementById('world')

  camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000)
  camera.position.set(0, -10, 200)
  camera.lookAt(0, 20, 0)
  // controls.update()

  controls = new OrbitControls(camera, container)
  controls.minDistance = 10
  controls.maxDistance = 500

  scene = new THREE.Scene()

  // ground
  const rootPosition = new THREE.Vector3(0, -20, 0)
  const planeWidthSegments = 4
  const planeHeightSegments = 4
  const plane = new THREE.PlaneGeometry(16, 16, planeWidthSegments, planeHeightSegments)
  plane.rotateX(-Math.PI / 2) // parallel to xz plane
  // plane.translate(0, rootPosition.y, 0)

  const planeMaterial = new THREE.MeshStandardMaterial({ wireframe: true })
  ground = new THREE.Mesh(plane, planeMaterial)
  ground.position.set(0, rootPosition.y, 0)
  scene.add(ground)

  // tree
  tree = new Tree(
    rootPosition,
    'f',
    20,
    { f: 'f[+f]f[-f]f' },
    2,
    10,
    0.2,
  )
  tree.grow()

  const group = tree.group
  scene.add(group)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(windowWidth, windowHeight)
  renderer.setClearColor(0xF5E8C7)
  container!.appendChild(renderer.domElement)

  window.addEventListener('resize', handleWindowResize, false)
  requestAnimationFrame(animateLoop)
}

// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
function handleWindowResize() {
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth
  renderer.setSize(windowWidth, windowHeight)
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
}

function animateLoop() {
  // render the scene
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(animateLoop)
}
