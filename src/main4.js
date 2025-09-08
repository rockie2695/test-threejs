import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.zoom = 0.4;
camera.updateProjectionMatrix();
camera.position.set(5, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// 加上這行程式碼
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
});
const sphere = new THREE.Mesh(sphereGeometry, planeMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

new GLTFLoader().load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/file.gltf",
  (gltf) => {
    gltf.scene.traverse((object) => {
      if (object.isMesh) {
        object.material.roughness = 1;
        object.material.metalness = 0;
        object.material.transparent = false;
        // 加上這行程式碼能蒙上陰影到物件
        object.castShadow = true;
        // 加上這行程式碼產生陰影
        object.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
  }
);

// 聚光燈
const addSpotLight = () => {
  const spotLight = new THREE.SpotLight(0xffffff, 99);
  spotLight.position.set(3, 3, 0);
  // 加上這行程式碼來蒙上陰影到物件
  spotLight.castShadow = true;
  scene.add(spotLight);
};

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addSpotLight();
addAmbientLight();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
