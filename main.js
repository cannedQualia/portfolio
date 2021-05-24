import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// =================================================================================
// Methods
const animate = () => {
  requestAnimationFrame( animate )

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  renderer.render( scene, camera )
}

const addStar = () => {
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 )
  const material = new THREE.MeshBasicMaterial( {color: 0xffffff} )
  const star = new THREE.Mesh( geometry, material )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add( star )
}

const moveCamera = () => {
  // How far we are from the top of the browser:
  const t = document.body.getBoundingClientRect().top

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  luis.rotation.y += 0.01;
  luis.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
// =================================================================================

// Three always needs these objects:
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

// Pixel size:
renderer.setPixelRatio(window.devicePixelRatio)
// Fullscreen canvas
renderer.setSize( window.innerWidth, window.innerHeight)
// The camera starts in the middle of the scene. Let's give a better perspective:
camera.position.setZ(30)

renderer.render( scene, camera )

// ======================================
// Let's add a torus:
const shipTexture = new THREE.TextureLoader().load('ship.jpg')
const normalShipTexture = new THREE.TextureLoader().load('normalShip.jpg')
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
// const material = new THREE.MeshStandardMaterial( { color: 0x2e88b5 } )
const material = new THREE.MeshStandardMaterial({ map: shipTexture , normalMap: normalShipTexture})
const torus = new THREE.Mesh( geometry, material )

scene.add( torus )

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
// scene.add(pointLight)
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// Helpers for debugging:
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)
// const controls = new OrbitControls(camera, renderer.domElement)
// scene.add(lightHelper, gridHelper)

// Let's add 200 stars
Array(200).fill().forEach(addStar)

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture

// Avatar
const luisTexture = new THREE.TextureLoader().load('luis.jpg')
const luis = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: luisTexture }))
scene.add(luis)

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
)
moon.position.z = 30
moon.position.setX(-10)
scene.add(moon)

// Scrolling moves camera:
document.body.onscroll = moveCamera;
moveCamera();


animate()
