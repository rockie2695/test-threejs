import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.zoom = 0.4;
camera.updateProjectionMatrix();
camera.position.set(7, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30);
const hdriPath =
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg";
const texutre = await new THREE.TextureLoader().loadAsync(hdriPath);
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
  map: texutre,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);
};

// 新增點光
const addPointLight = (x, y, z) => {
  const pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);
  pointLight.position.set(x, y, z);
  pointLight.castShadow = true;
  // 新增Helper
  const lightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffff00);
  // scene.add(lightHelper);
  // 更新Helper
  lightHelper.update();
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addAmbientLight();
addPointLight(10, 18, -10);
addPointLight(10, 18, 10);

// device作為閉包外存取模型的變數
let device;
(async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day20/cabinet_mapping.gltf";
  const gltf = await new GLTFLoader().loadAsync(path);
  cabinet = gltf.scene;
  cabinet.scale.set(0.5, 0.5, 0.5);
  scene.add(cabinet);
})();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
