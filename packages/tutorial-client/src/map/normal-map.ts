import { GUI } from "dat.gui"
import {
  AxesHelper,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

import { EarthNormalMapTexture, WorldTexture } from "../images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 2)
light.position.set(0, 2, 5)
scene.add(light)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const planeGeometry = new PlaneGeometry(3.6, 1.8)

const material = new MeshPhongMaterial()

const texture = new TextureLoader().load(WorldTexture)
material.map = texture

const normalTexture = new TextureLoader().load(EarthNormalMapTexture)
material.normalMap = normalTexture
material.normalScale.set(2, 2)

const plane = new Mesh(planeGeometry, material)
scene.add(plane)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
gui.add(material.normalScale, "x", 0, 10, 0.01)
gui.add(material.normalScale, "y", 0, 10, 0.01)
gui.add(light.position, "x", -20, 20).name("Light Pos X")

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
