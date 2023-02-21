import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat.gui"
import {
  AddOperation,
  AxesHelper,
  BackSide,
  BoxGeometry,
  CubeReflectionMapping,
  CubeTextureLoader,
  DoubleSide,
  FrontSide,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MixOperation,
  MultiplyOperation,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusKnotGeometry,
  WebGLRenderer
} from "three"
import {
  gridTexture,
  pxTexture,
  pyTexture,
  pzTexture,
  nxTexture,
  nyTexture,
  nzTexture
} from "./images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 3
camera.position.y = 3
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

const material = new MeshBasicMaterial({ color: 0xffffff })
// const material = new MeshNormalMaterial()

const texture = new TextureLoader().load(gridTexture)
material.map = texture
const envTexture = new CubeTextureLoader().load([
  pxTexture,
  nxTexture,
  pyTexture,
  nyTexture,
  pzTexture,
  nzTexture
])
envTexture.mapping = CubeReflectionMapping
// envTexture.mapping = CubeRefractionMapping
material.envMap = envTexture

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
materialFolder.add(material, "side", options.side).onChange((value) => {
  updateMaterial()
})
materialFolder.open()

const data = {
  color: material.color.getHex()
}

const meshBasicMaterialFolder = gui.addFolder("MeshBasicMaterial")
meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
  // #00ff00 -> 0x00ff00
  material.color.setHex(Number(data.color.toString().replace("#", "0x")))
})
meshBasicMaterialFolder.add(material, "wireframe")
// meshBasicMaterialFolder.add(material, 'wireframeLinewidth', 0, 10) @deprecated
meshBasicMaterialFolder.add(material, "combine", options.combine).onChange(() => {
  updateMaterial()
})
meshBasicMaterialFolder.add(material, "reflectivity", 0, 1)
meshBasicMaterialFolder.add(material, "refractionRatio", 0, 1) // CubeRefractionMapping
meshBasicMaterialFolder.open()

// const meshNormalMaterialFolder = gui.addFolder("MeshNormalMaterial")
// meshNormalMaterialFolder.add(material, "wireframe")
// meshNormalMaterialFolder.add(material, "flatShading").onChange(() => {
//   updateMaterial()
// })
// meshNormalMaterialFolder.open()

function updateMaterial() {
  // dat.GUI 의 옵션은 string 으로 값을 세팅 하기 때문인듯...?
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
