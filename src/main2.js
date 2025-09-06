import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const loader = new FontLoader();
loader.load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day13/jf-openhuninn-1.1_Regular_cities.json",
  function (font) {
    const scene = new THREE.Scene();

    const addText = (text, color) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.5,
        depth: 0.1,
        height: 0,
        curveSegments: 2,
        bevelEnabled: false,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(textMesh);
      return textMesh;
    };

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
      { rate: 14.2, name: "Advanced Digital Camera" },
      { rate: 32.5, name: "Full Frame Digital Camera" },
      { rate: 9.6, name: "Lens Adapter" },
      { rate: 18.7, name: "Slim Digital Camera" },
      { rate: 21.6, name: "Slr Digita Camera" },
      { rate: 3.4, name: "Macro Zoom Lens" },
    ];
    // 我準備了簡單的色票，作為圓餅圖顯示用的顏色
    const colorSet = [
      0x729ecb, 0xa9ecd5, 0xa881cb, 0xf3a39e, 0xffd2a1, 0xbbb5ae, 0xe659ab,
      0x88d9e2, 0xa77968,
    ];

    const createPie = (startAngle, endAngle, color, depth, legend, rate) => {
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
      const text = addText(`${legend}: ${rate}%`, color);
      console.log(startAngle, endAngle);
      const curvePoints = curve.getPoints(50);
      const shape = new THREE.Shape(curvePoints);
      shape.lineTo(0, 0);
      shape.closePath();
      /*
  ShapeGeometry ：產生一個具有面的形狀
ExtrudeGeometry：產生一個具有體積的物體
BufferGeometry：由用戶代入錨點位置而不指定任何作用。所以它有可能是三角面位置資訊，也可能是三角面Normal資訊，有可能是其他資訊。
TubeGeometry：沿著線段產生一條「水管」
  */
      // const shapeGeometry = new THREE.ShapeGeometry(shape);
      const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth * 2, // 隆起高度
        steps: 1, // 在隆起的3D物件中間要切幾刀線
        bevelEnabled: true, // 倒角（隆起向外擴展）
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelOffset: 0,
        bevelSegments: 6,
      });

      const middleAngle = (startAngle + endAngle) / 2;
      const x = Math.cos(middleAngle);
      const y = Math.sin(middleAngle);
      const textDistance = 8;
      text.geometry.translate(x * textDistance, y * textDistance, 0);
      text.geometry.translate(x - [...`legend: ${rate}%`].length * 0.3, y, 0);
      shapeGeometry.translate(x * 0.2, y * 0.2, 0);

      // const shapeMaterial = new THREE.MeshBasicMaterial({ color: color });
      const shapeMaterial = new THREE.MeshStandardMaterial({ color: color });
      const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
      scene.add(mesh);
      return { pieMesh: mesh, pieText: text };
    };

    // createPie()
    const dataToPie = (data) => {
      // 我用sum來記憶上一個餅的結束位置，使得每個餅都從上一個結束位置開始繪製。
      let sum = 0;
      // 在data進入forEach之前加上sort即可
      data = data.sort((a, b) => b.rate - a.rate);
      const pieTexts = [];
      let pieMeshes = [];

      data.forEach((datium, i) => {
        // 將百分比轉換成0~2PI的弧度
        const radian = (datium.rate / 100) * (Math.PI * 2);
        const { pieMesh, pieText } = createPie(
          sum,
          radian + sum,
          colorSet[i],
          radian,
          datium.name,
          datium.rate
        );
        pieTexts.push(pieText);
        pieMeshes.push(pieMesh);
        sum += radian;
      });
      return { pieMeshes, pieTexts };
    };

    const { pieMeshes, pieTexts } = dataToPie(data);

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
      pieTexts.forEach((text) => {
        text.lookAt(
          ...new THREE.Vector3(0, 0, 1).lerp(camera.position, 0.05).toArray()
        );
      });
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
  }
);
