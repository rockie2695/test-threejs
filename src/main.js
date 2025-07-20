import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); //(顯示器上可見的場景範圍。其值以度為單位。,aspect ratio,near和far裁切平面(距離相機超過far或 的物體near將不會被渲染))

//渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1); //立方體
// const geometry = new THREE.SphereGeometry(1, 50, 50); // 參數帶入半徑、水平面數、垂直面數
const geometry = new THREE.SphereGeometry(100, 50, 50);
//const material = new THREE.MeshBasicMaterial({color: 0x0000ff})//blue
// const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 }); //green
const texture = new THREE.TextureLoader().load(
  "/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.png"
);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
// 新增環境光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
// const cube = new THREE.Mesh(geometry, material); //網格是一個採用幾何體並應用材質的對象
// const parent = new THREE.Mesh(geometry, material);
// const child = new THREE.Mesh(geometry, material);
// scene.add(cube);
// scene.add(parent);
// parent.add(child);
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const earthGeometry = new THREE.SphereGeometry(5, 50, 50);
// 匯入材質
const earthTexture = new THREE.TextureLoader().load(
  "Solarsystemscope_texture_8k_earth_daymap.jpg"
);
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  side: THREE.DoubleSide,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// axesHelper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// arrowHelper
// const dir = new THREE.Vector3(-2.49, 4.74, -3.01).normalize();
// const origin = new THREE.Vector3(0, 0, 0);
// const length = 10;
// const hex = 0xffff00;
// const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
// scene.add(arrowHelper);

// camera.position.z = 5;
// Camera 身為鏡頭，有位置屬性，設定在Z軸即可。
// camera.position.set(0, 0, 15);
camera.position.set(0, 10, 15);

// cube.geometry.translate(5, 0, 0);
// cube.geometry.scale(2, 1, 1);
// parent.position.x = 10;
// child.position.x = 5;
// 矩陣相乘
// const translationMatrix = new THREE.Matrix4().makeTranslation(5,0,0)
// const scaleMatrix = new THREE.Matrix4().makeScale(2,1,1)
// const combineMatrix = translationMatrix.multiply(scaleMatrix)
// cube.applyMatrix4(combineMatrix)

// 建立四元數
let quaternion = new THREE.Quaternion();
// 即將旋轉的弧度
// let rotation = 0;
// 建立一個向量，以儲存鏡頭方向
// const cameraLookAt = new THREE.Vector3(0, 0, 0);

const control = new OrbitControls(camera, renderer.domElement);

function animate() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // 不斷增加弧度
  // rotation += 0.001;
  // 更新四元數
  // quaternion.setFromAxisAngle(dir, rotation);
  // 增加的弧度，要更新在天球上
  // sphere.rotation.setFromQuaternion(quaternion);

  // 每幀更新旋轉變數
  // rotation += 0.05;
  // 更新到位置
  // camera.position.set(0, 10 + Math.cos(rotation), 15); // Math.cos的結果會在1~-1之間移動
  // 變化該向量
  // cameraLookAt.set(0, 0 + Math.cos(rotation), 0);
  // 移動到animate()之外
  // cameraLookAt.set(10, 0, 0);
  // 看向該向量
  // camera.lookAt(cameraLookAt);
  // 改用這個方法來控制鏡頭的方向
  control.target.set(10, 0, 0);
  control.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
