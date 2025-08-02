import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";

const cities = [
  { name: "--- select city ---", id: 0, lat: 0, lon: 0, country: "None" },
  {
    name: "Mumbai",
    id: 1356226629,
    lat: 19.0758,
    lon: 72.8775,
    country: "India",
  },
  {
    name: "Moscow",
    id: 1643318494,
    lat: 55.7558,
    lon: 37.6178,
    country: "Russia",
  },
  {
    name: "Xiamen",
    id: 1156212809,
    lat: 24.4797,
    lon: 118.0819,
    country: "China",
  },
  {
    name: "Phnom Penh",
    id: 1116260534,
    lat: 11.5696,
    lon: 104.921,
    country: "Cambodia",
  },
  {
    name: "Chicago",
    id: 1840000494,
    lat: 41.8373,
    lon: -87.6862,
    country: "United States",
  },
  {
    name: "Bridgeport",
    id: 1840004836,
    lat: 41.1918,
    lon: -73.1953,
    country: "United States",
  },
  {
    name: "Mexico City",
    id: 1484247881,
    lat: 19.4333,
    lon: -99.1333,
    country: "Mexico",
  },
  {
    name: "Karachi",
    id: 1586129469,
    lat: 24.86,
    lon: 67.01,
    country: "Pakistan",
  },
  {
    name: "London",
    id: 1826645935,
    lat: 51.5072,
    lon: -0.1275,
    country: "United Kingdom",
  },
  {
    name: "Boston",
    id: 1840000455,
    lat: 42.3188,
    lon: -71.0846,
    country: "United States",
  },
  {
    name: "Taichung",
    id: 1158689622,
    lat: 24.15,
    lon: 120.6667,
    country: "Taiwan",
  },
];

const citySelect = document.getElementsByClassName("city-select")[0];
// 渲染option
citySelect.innerHTML = cities.map(
  (city) => `<option value="${city.id}">${city.name}</option>`
);

citySelect.addEventListener("change", (event) => {
  const cityId = event.target.value;
  const seletedCity = cities.find((city) => city.id + "" === cityId);
  console.log(seletedCity);
  // 用前面的函式所取得的座標
  const cityEciPosition = lonLauToRadian(seletedCity.lon, seletedCity.lat, 4.4);
  // 指定位置給圖釘
  ring.position.set(cityEciPosition.x, -cityEciPosition.z, -cityEciPosition.y);
  const center = new THREE.Vector3(0, 0, 0);
  // 圖釘永遠都看像世界中心，所以不會歪斜。
  ring.lookAt(center);
  control.update();
});

// 將LLA轉換成ECEF座標
const llaToEcef = (lat, lon, alt, rad) => {
  let f = 0;
  let ls = Math.atan((1 - f) ** 2 * Math.tan(lat));
  let x =
    rad * Math.cos(ls) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon);
  let y =
    rad * Math.cos(ls) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon);
  let z = rad * Math.sin(ls) + alt * Math.sin(lat);
  return new THREE.Vector3(x, y, z);
};

const lonLauToRadian = (lon, lat, rad) =>
  llaToEcef((Math.PI * (0 - lat)) / 180, Math.PI * (lon / 180), 1, rad);

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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); //(顯示器上可見的場景範圍。其值以度為單位。,aspect ratio,near和far裁切平面(距離相機超過far或 的物體near將不會被渲染))
// camera.position.z = 5;
// Camera 身為鏡頭，有位置屬性，設定在Z軸即可。
// camera.position.set(0, 0, 15);
camera.position.set(0, 10, 15);

//渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1); //立方體
// const geometry = new THREE.SphereGeometry(1, 50, 50); // 參數帶入半徑、水平面數、垂直面數

//const material = new THREE.MeshBasicMaterial({color: 0x0000ff})//blue
// const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 }); //green

const geo = new THREE.RingGeometry(0.1, 0.13, 32);
const mat = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(geo, mat);
scene.add(ring);

// 改名成skydome
const skydomeTexture = new THREE.TextureLoader().load(
  "/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.jpg"
);
const skydomeMaterial = new THREE.MeshBasicMaterial({
  map: skydomeTexture,
  side: THREE.DoubleSide,
});
const skydomeGeometry = new THREE.SphereGeometry(100, 50, 50);
const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
scene.add(skydome);

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
};
// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(0, 0, 10);
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

// 新增點光
const addPointLight = () => {
  const pointLight = new THREE.PointLight(0xffffff, 100);
  scene.add(pointLight);
  pointLight.position.set(10, 10, -10);
  pointLight.castShadow = true;
  // 新增Helper
  const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00);
  scene.add(lightHelper);
  // 更新Helper
  lightHelper.update();
};

addPointLight();
addAmbientLight();
addDirectionalLight();

// 區域光
// const rectLight = new THREE.RectAreaLight( 0xffffff, 0.2,  10, 10 );
// scene.add(rectLight);
// 更新光源位置
// rectLight.position.set( 5, 5, 0 );

// const cube = new THREE.Mesh(geometry, material); //網格是一個採用幾何體並應用材質的對象
// const parent = new THREE.Mesh(geometry, material);
// const child = new THREE.Mesh(geometry, material);
// scene.add(cube);
// scene.add(parent);
// parent.add(child);

const earthGeometry = new THREE.SphereGeometry(5, 600, 600);
// 匯入材質
const earthTexture = new THREE.TextureLoader().load("8081_earthmap4k.jpg");
// 新增灰階高度貼圖
const displacementTexture = new THREE.TextureLoader().load(
  "/8081_earthbump4k.jpg"
);
const speculatMapTexture = new THREE.TextureLoader().load(
  "/8081_earthspec4k.jpg"
);
const roughtnessTexture = new THREE.TextureLoader().load(
  "/8081_earthspec2kReversedLighten.png"
);
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  side: THREE.DoubleSide,
  // 將貼圖貼到材質參數中
  displacementMap: displacementTexture,
  // wireframe: true,
  displacementScale: 0.5,
  // 加上金屬貼圖
  metalnessMap: speculatMapTexture,
  // 由於預設金屬為0，所以必須調成1，才使得我們的貼圖可以呈現0~1的金屬範圍。黑代表0，白代表1
  metalness: 1,
  roughnessMap: roughtnessTexture,
  roughness: 0.9,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// earth.position.set(20, 0, 0);
scene.add(earth);

// 雲的球比地球大一點
const cloudGeometry = new THREE.SphereGeometry(5.4, 60, 60);
const cloudTransparency = new THREE.TextureLoader().load(
  "8081_earthhiresclouds2K.jpg"
);
const cloudMaterial = new THREE.MeshStandardMaterial({
  // 開啟透明功能
  transparent: true,
  // 加上透明貼圖
  opacity: 1,
  alphaMap: cloudTransparency,
});
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloud);

// 新增太陽
// const sunGeometry = new THREE.SphereGeometry(5, 50, 50);
// const sunTexture = new THREE.TextureLoader().load("2k_sun.png");
// const sunMaterial = new THREE.MeshBasicMaterial({
//   map: sunTexture,
//   side: THREE.DoubleSide,
// });
// const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// scene.add(sun);

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
  // earth.rotation.y += 0.005;
  cloud.rotation.y += 0.004;
  skydome.rotation.y += 0.001;
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
  // control.target.set(10, 0, 0);
  // control.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
