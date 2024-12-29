import { GUI } from "dat.gui"
import {
  AddOperation,
  AxesHelper,
  BackSide,
  CubeReflectionMapping,
  CubeTextureLoader,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshPhongMaterial,
  MixOperation,
  MultiplyOperation,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"

import {
  EarthSpecularTexture,
  MilkyWayEnvTextureNx,
  MilkyWayEnvTextureNy,
  MilkyWayEnvTextureNz,
  MilkyWayEnvTexturePx,
  MilkyWayEnvTexturePy,
  MilkyWayEnvTexturePz,
  WorldTexture
} from "../images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 1)
light.position.set(0, 5, 10)
scene.add(light)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
// controls.screenSpacePanning = true
// controls.addEventListener("change", render)

const planeGeometry = new PlaneGeometry(3.6, 1.8)

const material = new MeshPhongMaterial()

const texture = new TextureLoader().load(WorldTexture)
material.map = texture

const envTexture = new CubeTextureLoader().load([
  MilkyWayEnvTexturePx,
  MilkyWayEnvTextureNx,
  MilkyWayEnvTexturePy,
  MilkyWayEnvTextureNy,
  MilkyWayEnvTexturePz,
  MilkyWayEnvTextureNz
])
envTexture.mapping = CubeReflectionMapping
material.envMap = envTexture
scene.background = envTexture

// const specularTexture = new TextureLoader().load(GrayScaleSpecularTexture)
const specularTexture = new TextureLoader().load(EarthSpecularTexture)
material.specularMap = specularTexture

const plane = new Mesh(planeGeometry, material)
scene.add(plane)

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
materialFolder.add(material, "transparent")
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
// materialFolder.open()

const data = {
  color: material.color.getHex(),
  emissive: material.emissive.getHex(),
  specular: material.specular.getHex()
}

const meshPhongMaterialFolder = gui.addFolder("MeshPhongMaterial")

meshPhongMaterialFolder.addColor(data, "color").onChange(() => {
  material.color.setHex(Number(data.color.toString().replace("#", "0x")))
})
meshPhongMaterialFolder.addColor(data, "emissive").onChange(() => {
  material.emissive.setHex(Number(data.emissive.toString().replace("#", "0x")))
})
meshPhongMaterialFolder.addColor(data, "specular").onChange(() => {
  material.specular.setHex(Number(data.specular.toString().replace("#", "0x")))
})
meshPhongMaterialFolder.add(material, "shininess", 0, 1024)
meshPhongMaterialFolder.add(material, "wireframe")
meshPhongMaterialFolder.add(material, "flatShading").onChange(() => {
  updateMaterial()
})
meshPhongMaterialFolder.add(material, "combine", options.combine).onChange(() => {
  updateMaterial()
})
meshPhongMaterialFolder.add(material, "reflectivity", 0, 1)
meshPhongMaterialFolder.open()

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
