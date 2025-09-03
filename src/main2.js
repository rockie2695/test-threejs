import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
const windowRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -windowRatio * 10,
  windowRatio * 10,
  10,
  -10,
  0.1,
  1000
);
camera.position.set(0, 3, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 假設圖表拿到這筆資料
const data = [
  { rate: 14.2, name: "動力控制IC" },
  { rate: 32.5, name: "電源管理IC" },
  { rate: 9.6, name: "智慧型功率IC" },
  { rate: 18.7, name: "二極體Diode" },
  { rate: 21.6, name: "功率電晶體Power Transistor" },
  { rate: 3.4, name: "閘流體Thyristor" },
];

// 我準備了簡單的色票，作為圓餅圖顯示用的顏色
const colorSet = [
  0x729ecb, 0xa9ecd5, 0xa881cb, 0xf3a39e, 0xffd2a1, 0xbbb5ae, 0xe659ab,
  0x88d9e2, 0xa77968,
];

const createPie = (startAngle, endAngle, color) => {
  const curve = new THREE.EllipseCurve(
    0,
    0, // 橢圓形的原點
    5,
    5, // X軸的邊長、Y軸的邊長
    startAngle,
    endAngle, // 起始的角度、結束的角度（90度）
    false, // 是否以順時鐘旋轉
    0 //旋轉橢圓
  );
  const curvePoints = curve.getPoints(50);
  const shape = new THREE.Shape(curvePoints);
  shape.lineTo(0, 0);
  shape.closePath();
  const shapeGeometry = new THREE.ShapeGeometry(shape);
  const shapeMaterial = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
  scene.add(mesh);
  return mesh;
};

// createPie()
const dataToPie = (data) => {
  // 我用sum來記憶上一個餅的結束位置，使得每個餅都從上一個結束位置開始繪製。
  let sum = 0;
  data.forEach((datium, i) => {
    // 將百分比轉換成0~2PI的弧度
    const radian = (datium.rate / 100) * (Math.PI * 2);
    createPie(sum, radian + sum, colorSet[i]);
    sum += radian;
  });
};

dataToPie(data);

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
// scene.background = new THREE.Color(0xffffff)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
