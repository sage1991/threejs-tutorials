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
  MeshToonMaterial,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusKnotGeometry,
  WebGLRenderer
} from "three"
import { fiveToneTexture, fourToneTexture, threeToneTexture } from "../images"

const scene = new Scene()
scene.add(new AxesHelper(5))

const light = new PointLight(0xffffff, 1)
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

const threeTone = new TextureLoader().load(threeToneTexture)
threeTone.minFilter = NearestFilter
threeTone.magFilter = NearestFilter

const fourTone = new TextureLoader().load(fourToneTexture)
fourTone.minFilter = NearestFilter
fourTone.magFilter = NearestFilter

const fiveTone = new TextureLoader().load(fiveToneTexture)
fiveTone.minFilter = NearestFilter
fiveTone.magFilter = NearestFilter

const material: MeshToonMaterial = new MeshToonMaterial()

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
  gradientMap: {
    Default: null,
    threeTone: "threeTone",
    fourTone: "fourTone",
    fiveTone: "fiveTone"
  }
}

const gui = new GUI()

const data = {
  lightColor: light.color.getHex(),
  color: material.color.getHex(),
  gradientMap: "threeTone"
}

material.gradientMap = threeTone

const lightFolder = gui.addFolder("Light")
lightFolder.addColor(data, "lightColor").onChange(() => {
  light.color.setHex(Number(data.lightColor.toString().replace("#", "0x")))
})
lightFolder.add(light, "intensity", 0, 4)

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

const meshToonMaterialFolder = gui.addFolder("MeshToonMaterial")
meshToonMaterialFolder.addColor(data, "color").onChange(() => {
  material.color.setHex(Number(data.color.toString().replace("#", "0x")))
})

// shininess, specular and flatShading no longer supported in MeshToonMaterial

meshToonMaterialFolder.add(data, "gradientMap", options.gradientMap).onChange(() => {
  updateMaterial()
})
meshToonMaterialFolder.open()

function updateMaterial() {
  material.side = Number(material.side)
  material.gradientMap = getGradientMapByName(data.gradientMap)
  material.needsUpdate = true
}

const getGradientMapByName = (name: string) => {
  switch (name) {
    case "threeTone":
      return threeTone
    case "fourTone":
      return fourTone
    case "fiveTone":
      return fiveTone
    default:
      return null
  }
}

function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.005
  cube.rotation.y += 0.005
  cube.rotation.z += 0.005

  sphere.rotation.x += 0.005
  sphere.rotation.y += 0.005
  sphere.rotation.z += 0.005

  icosahedron.rotation.x += 0.005
  icosahedron.rotation.y += 0.005
  icosahedron.rotation.z += 0.005

  plane.rotation.x += 0.005
  plane.rotation.y += 0.005
  plane.rotation.z += 0.005

  torusKnot.rotation.x += 0.005
  torusKnot.rotation.y += 0.005
  torusKnot.rotation.z += 0.005

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

animate()
