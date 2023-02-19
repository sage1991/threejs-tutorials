import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat.gui"
import {
  AxesHelper,
  BackSide,
  BoxGeometry,
  DoubleSide,
  FrontSide,
  IcosahedronGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  TorusKnotGeometry,
  WebGLRenderer
} from "three"

const scene = new Scene()
scene.add(new AxesHelper(5))

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

// const material = new MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true
// })
const material = new MeshNormalMaterial()
material.transparent = true
material.opacity = 0.25

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

function updateMaterial() {
  // dat.GUI 의 옵션은 string 으로 값을 세팅 하기 때문인듯...?
  material.side = Number(material.side)
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
