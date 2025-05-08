import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const scene = new Scene()
const camera = new PerspectiveCamera(75, aspectRatio(), 0.1, 1000)
camera.position.z = 1.5

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener("resize", () => {
  camera.aspect = aspect()
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

new OrbitControls(camera, renderer.domElement)

const geometry = new BoxGeometry()
const material = new MeshNormalMaterial({ wireframe: true })

const cube = new Mesh(geometry, material)
scene.add(cube)

const animate = () => {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

requestAnimationFrame(animate)
