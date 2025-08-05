import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
};

// 新增點光
const addPointLight = () => {
  const pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);
  pointLight.position.set(3, 3, 0);
  pointLight.castShadow = true;
  // 新增Helper
  const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00);
  scene.add(lightHelper);
  // 更新Helper
  lightHelper.update();
};

// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(20, 20, 0);
  scene.add(directionalLight);
  directionalLight.castShadow = true;
  const d = 10;

  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  // 新增Helper
  const lightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    20,
    0xffff00
  );
  scene.add(lightHelper);
  // 更新位置
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.target.updateMatrixWorld();
  // 更新Helper
  lightHelper.update();
};

addAmbientLight();
addDirectionalLight();
addPointLight();

const control = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
