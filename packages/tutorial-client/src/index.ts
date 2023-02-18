import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  AxesHelper,
  Vector3
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat.gui"

const scene = new Scene()
scene.background = new Color(0xefefef)
scene.add(new AxesHelper(5))

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(new Vector3(10, 10, 20))

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.addEventListener("change", render)

const geometry = new BoxGeometry()
const material = new MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
})

const cube = new Mesh(geometry, material)
scene.add(cube)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder("Cube")
cubeFolder.add(cube, "visible")
cubeFolder.open()

const cubeRotationFolder = cubeFolder.addFolder("Rotation")
cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2)
cubeRotationFolder.open()

const cubePositionFolder = cubeFolder.addFolder("Position")
cubePositionFolder.add(cube.position, "x", -10, 10)
cubePositionFolder.add(cube.position, "y", -10, 10)
cubePositionFolder.add(cube.position, "z", -10, 10)
cubePositionFolder.open()

const cubeScaleFolder = cubeFolder.addFolder("Scale")
cubeScaleFolder.add(cube.scale, "x", 0, 5)
cubeScaleFolder.add(cube.scale, "y", 0, 5)
cubeScaleFolder.add(cube.scale, "z", 0, 5)
cubeScaleFolder.open()

const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(camera.position, "z", 0, 20)
cameraFolder.open()

function animate() {
  requestAnimationFrame(animate)

  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
