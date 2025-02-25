import { GUI } from "dat.gui"
import {
  AxesHelper,
  BackSide,
  DoubleSide,
  FrontSide,
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

import { EarthDisplacementTexture, WorldTexture } from "../images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 2)
light.position.set(0, 5, 10)
scene.add(light)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.screenSpacePanning = true // so that panning up and down doesn't zoom in/out
// controls.addEventListener('change', render)

const planeGeometry = new PlaneGeometry(3.6, 1.8, 360, 180)

const material = new MeshPhongMaterial()

// const texture = new TextureLoader().load("img/grid.png")
const texture = new TextureLoader().load(WorldTexture)
material.map = texture
// const envTexture = new CubeTextureLoader().load(["img/px_50.png", "img/nx_50.png", "img/py_50.png", "img/ny_50.png", "img/pz_50.png", "img/nz_50.png"])
// const envTexture = new CubeTextureLoader().load(["img/px_eso0932a.jpg", "img/nx_eso0932a.jpg", "img/py_eso0932a.jpg", "img/ny_eso0932a.jpg", "img/pz_eso0932a.jpg", "img/nz_eso0932a.jpg"])
// envTexture.mapping = CubeReflectionMapping
// material.envMap = envTexture

// const specularTexture = new TextureLoader().load("img/earthSpecular.jpg")
// material.specularMap = specularTexture

const displacementMap = new TextureLoader().load(EarthDisplacementTexture)
material.displacementMap = displacementMap

const plane: Mesh = new Mesh(planeGeometry, material)
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
// materialFolder.open()

const data = {
  color: material.color.getHex(),
  emissive: material.emissive.getHex(),
  specular: material.specular.getHex()
}

const meshPhongMaterialFolder = gui.addFolder("meshPhongMaterialFolder")

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
meshPhongMaterialFolder.add(material, "reflectivity", 0, 1)
meshPhongMaterialFolder.add(material, "refractionRatio", 0, 1)
meshPhongMaterialFolder.add(material, "displacementScale", 0, 1, 0.01)
meshPhongMaterialFolder.add(material, "displacementBias", -1, 1, 0.01)
meshPhongMaterialFolder.open()

function updateMaterial() {
  material.side = Number(material.side)
  material.needsUpdate = true
}

const planeData = {
  width: 3.6,
  height: 1.8,
  widthSegments: 360,
  heightSegments: 180
}
const planePropertiesFolder = gui.addFolder("PlaneGeometry")
// planePropertiesFolder.add(planeData, 'width', 1, 30).onChange(regeneratePlaneGeometry)
// planePropertiesFolder.add(planeData, 'height', 1, 30).onChange(regeneratePlaneGeometry)
planePropertiesFolder.add(planeData, "widthSegments", 1, 360).onChange(regeneratePlaneGeometry)
planePropertiesFolder.add(planeData, "heightSegments", 1, 180).onChange(regeneratePlaneGeometry)
planePropertiesFolder.open()

function regeneratePlaneGeometry() {
  const newGeometry = new PlaneGeometry(
    planeData.width,
    planeData.height,
    planeData.widthSegments,
    planeData.heightSegments
  )
  plane.geometry.dispose()
  plane.geometry = newGeometry
}

const textureFolder = gui.addFolder("Texture")
textureFolder.add(texture.repeat, "x", 0.1, 1, 0.1)
textureFolder.add(texture.repeat, "y", 0.1, 1, 0.1)
textureFolder.add(texture.center, "x", 0, 1, 0.001)
textureFolder.add(texture.center, "y", 0, 1, 0.001)

textureFolder.open()

function animate() {
  requestAnimationFrame(animate)

  render()

  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
