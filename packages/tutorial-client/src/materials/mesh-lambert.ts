import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat.gui"
import {
  AddOperation,
  AxesHelper,
  BackSide,
  BoxGeometry,
  DoubleSide,
  FrontSide,
  IcosahedronGeometry,
  Mesh,
  MeshLambertMaterial,
  MixOperation,
  MultiplyOperation,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusKnotGeometry,
  WebGLRenderer
} from "three"
import { GridTexture } from "../images"

const scene = new Scene()
// scene.background = new Color(0xff0000)

scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 2)
light.position.set(10, 10, 10)
scene.add(light)

const light2 = new PointLight(0xffffff, 0.5)
light2.position.set(-10, -10, -10)
scene.add(light2)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const boxGeometry = new BoxGeometry()
const sphereGeometry = new SphereGeometry()
const icosahedronGeometry = new IcosahedronGeometry(1, 0)
const planeGeometry = new PlaneGeometry()
const torusKnotGeometry = new TorusKnotGeometry()

const material = new MeshLambertMaterial()

const texture = new TextureLoader().load(GridTexture)
material.map = texture
// const envTexture = new CubeTextureLoader().load(["img/px_50.png", "img/nx_50.png", "img/py_50.png", "img/ny_50.png", "img/pz_50.png", "img/nz_50.png"])
// //envTexture.mapping = CubeReflectionMapping
// envTexture.mapping = CubeRefractionMapping
// material.envMap = envTexture

const cube = new Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new Mesh(sphereGeometry, material)
sphere.position.x = 3
scene.add(sphere)

const icosahedron = new Mesh(icosahedronGeometry, material)
icosahedron.position.x = 0
scene.add(icosahedron)

const plane = new Mesh(planeGeometry, material)
plane.position.x = -2
scene.add(plane)

const torusKnot = new Mesh(torusKnotGeometry, material)
torusKnot.position.x = -5
scene.add(torusKnot)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const options = {
  side: {
    FrontSide,
    BackSide,
    DoubleSide
  },
  combine: {
    MultiplyOperation,
    MixOperation,
    AddOperation
  }
}

const gui = new GUI()
const materialFolder = gui.addFolder("Material")
materialFolder.add(material, "transparent").onChange(() => (material.needsUpdate = true))
materialFolder.add(material, "opacity", 0, 1, 0.01)
materialFolder.add(material, "depthTest")
materialFolder.add(material, "depthWrite")
materialFolder.add(material, "alphaTest", 0, 1, 0.01).onChange(() => {
  updateMaterial()
})
materialFolder.add(material, "visible")
materialFolder.add(material, "side", options.side).onChange(() => {
  updateMaterial()
})
materialFolder.open()

const data = {
  color: material.color.getHex(),
  emissive: material.emissive.getHex() // light가 없어도 표시 되는 색상
}

const meshLambertMaterialFolder = gui.addFolder("MeshLambertMaterial")

meshLambertMaterialFolder.addColor(data, "color").onChange(() => {
  material.color.setHex(Number(data.color.toString().replace("#", "0x")))
})
meshLambertMaterialFolder.addColor(data, "emissive").onChange(() => {
  material.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")))
})
meshLambertMaterialFolder.add(material, "wireframe")
meshLambertMaterialFolder.add(material, "wireframeLinewidth", 0, 10)
// meshLambertMaterialFolder.add(material, 'flatShading').onChange(() => updateMaterial())
meshLambertMaterialFolder.add(material, "combine", options.combine).onChange(() => {
  updateMaterial()
})
meshLambertMaterialFolder.add(material, "reflectivity", 0, 1)
meshLambertMaterialFolder.add(material, "refractionRatio", 0, 1)
meshLambertMaterialFolder.open()

function updateMaterial() {
  material.side = Number(material.side)
  material.combine = Number(material.combine)
  material.needsUpdate = true
}

function animate() {
  requestAnimationFrame(animate)

  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
