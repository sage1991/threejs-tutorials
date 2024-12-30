import { GUI } from "dat.gui"
import {
  BoxGeometry,
  Color,
  CubeTextureLoader,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import Stats from "three/addons/libs/stats.module.js"

const sceneA = new Scene()
// set color as background
sceneA.background = new Color(0x123456)

const sceneB = new Scene()
// set image as background
sceneB.background = new TextureLoader().load("https://sbcode.net/img/grid.png")

const sceneC = new Scene()
// set cube map(6 images) as background(sky box)
sceneC.background = new CubeTextureLoader()
  .setPath("https://sbcode.net/img/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"])
// blur background
sceneC.backgroundBlurriness = 0.05

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1.5

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

new OrbitControls(camera, renderer.domElement)

const geometry = new BoxGeometry()
const material = new MeshNormalMaterial({ wireframe: true })

const cube = new Mesh(geometry, material)

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()

const cubeFolder = gui.addFolder("Cube")
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2)
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2)
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2)
cubeFolder.open()

const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(camera.position, "z", 0, 20)
cameraFolder.open()

let currentScene: Scene
const SCENE_LOOKUP = {
  A: () => {
    currentScene = sceneA
    currentScene.add(cube)
  },
  B: () => {
    currentScene = sceneB
    currentScene.add(cube)
  },
  C: () => {
    currentScene = sceneC
    currentScene.add(cube)
  }
}
SCENE_LOOKUP.A()

const sceneFolder = gui.addFolder("Scene")
sceneFolder.add(SCENE_LOOKUP, "A").name("Scene A")
sceneFolder.add(SCENE_LOOKUP, "B").name("Scene B")
sceneFolder.add(SCENE_LOOKUP, "C").name("Scene C")
sceneFolder.open()

const animate = () => {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(currentScene, camera)
  stats.update()
}

animate()
