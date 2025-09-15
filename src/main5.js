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
// 產生紋理
const hdriPath =
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg";
const texutre = await new THREE.TextureLoader().loadAsync(hdriPath);
// 將紋理貼到材質圖中
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
  map: texutre,
});
// const planeMaterial = new THREE.MeshStandardMaterial({
//   side: THREE.BackSide,
//   color: 0xcceeff,
// });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(20, 20, 20);
  scene.add(directionalLight);
  directionalLight.castShadow = true;
  const d = 10;

  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  // 新增Helper
  // const lightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   20,
  //   0xffff00
  // );
  
  // scene.add(lightHelper);
  // 更新位置
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.target.updateMatrixWorld();
  // 更新Helper
  // lightHelper.update();
};

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);
};

// 宣告照相機
let cubeCamera;
// 使用閉包，以利程式碼同步
(async () => {
  // 模型檔案，拜託不要亂call我
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/hard_disk_iron.gltf";
  // 實例化3D模型
  const gltf = await new GLTFLoader().loadAsync(path);
  // 用traverse巢狀遞迴子元件
  gltf.scene.traverse((object) => {
    // 撇除非Mesh的物件
    if (!object.isMesh) return;
    if (object.name !== "pCube2") return;
    // 材質圖（嚴格來說是渲染對象）
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      // 渲染對象縮放設定
      generateMipmaps: true,
      // 渲染對象縮放設定
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    // 實例化照相機，給定near, far，以及材質圖
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    object.add(cubeCamera);
    // 將材質圖貼在物件材質的envMap身上
    object.material.envMap = cubeRenderTarget.texture;
    object.material.roughness = 0;
    object.material.metalness = 0;
  });
  scene.add(gltf.scene);
})();

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addDirectionalLight();
addAmbientLight();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // 如果cubeCamera已經實例化，就每幀更新鏡頭
  if (cubeCamera) {
    cubeCamera.update(renderer, scene);
  }
}
animate();
