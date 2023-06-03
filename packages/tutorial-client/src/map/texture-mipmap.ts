import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { GUI } from "dat.gui"
import {
  AxesHelper,
  LinearFilter,
  LinearMipMapLinearFilter,
  LinearMipmapNearestFilter,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three"
import { GridTexture } from "../images"

const scene1 = new Scene()
const scene2 = new Scene()

const axesHelper1 = new AxesHelper(5)
scene1.add(axesHelper1)
const axesHelper2 = new AxesHelper(5)
scene2.add(axesHelper2)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const planeGeometry1 = new PlaneGeometry()
const planeGeometry2 = new PlaneGeometry()

const texture1 = new TextureLoader().load(GridTexture)
const texture2 = texture1.clone()

const material1 = new MeshBasicMaterial({ map: texture1 })
const material2 = new MeshBasicMaterial({ map: texture2 })

texture2.minFilter = NearestFilter
texture2.magFilter = NearestFilter

const plane1 = new Mesh(planeGeometry1, material1)
const plane2 = new Mesh(planeGeometry2, material2)

scene1.add(plane1)
scene2.add(plane2)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const options = {
  minFilters: {
    NearestFilter,
    NearestMipMapLinearFilter,
    NearestMipMapNearestFilter,
    "LinearFilter ": LinearFilter,
    "LinearMipMapLinearFilter (Default)": LinearMipMapLinearFilter,
    LinearMipmapNearestFilter
  },
  magFilters: {
    NearestFilter,
    "LinearFilter (Default)": LinearFilter
  }
}
const gui = new GUI()
const textureFolder = gui.addFolder("Texture")
textureFolder.add(texture2, "minFilter", options.minFilters).onChange(() => {
  updateMinFilter()
})
textureFolder.add(texture2, "magFilter", options.magFilters).onChange(() => {
  updateMagFilter()
})
textureFolder.open()

function updateMinFilter() {
  texture2.minFilter = Number(texture2.minFilter)
  texture2.needsUpdate = true
}
function updateMagFilter() {
  texture2.magFilter = Number(texture2.magFilter)
  texture2.needsUpdate = true
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)

  render()

  stats.update()
}

function render() {
  renderer.setScissorTest(true)

  renderer.setScissor(0, 0, window.innerWidth / 2 - 2, window.innerHeight)
  renderer.render(scene1, camera)

  renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2 - 2, window.innerHeight)
  renderer.render(scene2, camera)

  renderer.setScissorTest(false)
}
animate()
