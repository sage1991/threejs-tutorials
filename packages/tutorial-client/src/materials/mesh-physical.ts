import { GUI } from "dat.gui"
import {
  AxesHelper,
  BackSide,
  BoxGeometry,
  Color,
  CubeTextureLoader,
  DoubleSide,
  FrontSide,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusKnotGeometry,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

import {
  GridTexture,
  MountainEnvTextureNx,
  MountainEnvTextureNy,
  MountainEnvTextureNz,
  MountainEnvTexturePx,
  MountainEnvTexturePy,
  MountainEnvTexturePz
} from "../images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 2)
light.position.set(10, 10, 10)
scene.add(light)

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

const material = new MeshPhysicalMaterial({})
material.reflectivity = 0
material.transmission = 1.0
material.roughness = 0.2
material.metalness = 0
material.clearcoat = 0.3
material.clearcoatRoughness = 0.25
material.color = new Color(0xffffff)
material.ior = 1.2
material.thickness = 10.0

const texture = new TextureLoader().load(GridTexture)
material.map = texture

const pmremGenerator = new PMREMGenerator(renderer)
const envTexture = new CubeTextureLoader().load(
  [
    MountainEnvTexturePx,
    MountainEnvTextureNx,
    MountainEnvTexturePy,
    MountainEnvTextureNy,
    MountainEnvTexturePz,
    MountainEnvTextureNz
  ],
  () => {
    material.envMap = pmremGenerator.fromCubemap(envTexture).texture
    pmremGenerator.dispose()
    scene.background = material.envMap
  }
)

const cube = new Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new Mesh(sphereGeometry, material)
sphere.position.x = 0
scene.add(sphere)

const icosahedron = new Mesh(icosahedronGeometry, material)
icosahedron.position.x = 3
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

const stats = new Stats()
document.body.appendChild(stats.dom)

const options = {
  side: {
    FrontSide,
    BackSide,
    DoubleSide
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
  emissive: material.emissive.getHex()
}

const meshPhysicalMaterialFolder = gui.addFolder("MeshPhysicalMaterial")

meshPhysicalMaterialFolder.addColor(data, "color").onChange(() => {
  material.color.setHex(Number(data.color.toString().replace("#", "0x")))
})
meshPhysicalMaterialFolder.addColor(data, "emissive").onChange(() => {
  material.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")))
})

meshPhysicalMaterialFolder.add(material, "wireframe")
meshPhysicalMaterialFolder.add(material, "flatShading").onChange(() => {
  updateMaterial()
})
meshPhysicalMaterialFolder.add(material, "reflectivity", 0, 1)
meshPhysicalMaterialFolder.add(material, "roughness", 0, 1)
meshPhysicalMaterialFolder.add(material, "metalness", 0, 1)
meshPhysicalMaterialFolder.add(material, "clearcoat", 0, 1, 0.01)
meshPhysicalMaterialFolder.add(material, "clearcoatRoughness", 0, 1, 0.01)
meshPhysicalMaterialFolder.add(material, "transmission", 0, 1, 0.01)
meshPhysicalMaterialFolder.add(material, "ior", 1.0, 2.333)
meshPhysicalMaterialFolder.add(material, "thickness", 0, 10.0)
meshPhysicalMaterialFolder.open()

function updateMaterial() {
  material.side = Number(material.side)
  material.needsUpdate = true
}

function animate() {
  requestAnimationFrame(animate)

  torusKnot.rotation.x += 0.01
  torusKnot.rotation.y += 0.01

  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
