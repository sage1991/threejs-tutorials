import { GUI } from "dat.gui"
import {
  BoxGeometry,
  GridHelper,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three"
import Stats from "three/addons/libs/stats.module.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const scene = new Scene()
scene.add(new GridHelper())

const perspective = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
perspective.position.set(0, 2, 3)
perspective.lookAt(0, 0, 0)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(perspective, renderer.domElement)

window.addEventListener("resize", () => {
  perspective.aspect = window.innerWidth / window.innerHeight
  perspective.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const geometry = new BoxGeometry()
const material = new MeshNormalMaterial({ wireframe: true })

const cube = new Mesh(geometry, material)
cube.position.y = 0.5
scene.add(cube)

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()

const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(perspective.position, "x", -10, 10)
cameraFolder.add(perspective.position, "y", -10, 10)
cameraFolder.add(perspective.position, "z", -10, 10)
cameraFolder.add(perspective, "fov", 0, 180, 0.01).onChange(() => {
  perspective.updateProjectionMatrix()
})
cameraFolder.add(perspective, "aspect", 0.00001, 10).onChange(() => {
  perspective.updateProjectionMatrix()
})
cameraFolder.add(perspective, "near", 0.01, 10).onChange(() => {
  perspective.updateProjectionMatrix()
})
cameraFolder.add(perspective, "far", 0.01, 10).onChange(() => {
  perspective.updateProjectionMatrix()
})
cameraFolder.open()

function animate() {
  requestAnimationFrame(animate)
  // camera.lookAt(0, 0.5, 0)
  renderer.render(scene, perspective)
  stats.update()
}

animate()
