import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import TWEEN from 'tween.js'
import { createAmbientLight, createSpotLight } from './lights'
import { createEarth, createEarthSprite } from './earth'
import { createCloud } from './cloud'
import { createLocationSprite } from './locations'

import { PAGE_WIDTH, PAGE_HEIGHT, LOCATIONS } from '@/config/constants'
import bus from '@/libs/bus'

const WIDTH = PAGE_WIDTH
const HEIGHT = PAGE_HEIGHT

export default class Earth {
    [x: string]: number | any;

    constructor(el) {
        this.container = typeof el === 'string' ? document.getElementById(el) : el

        this.width = WIDTH * 2
        this.height = HEIGHT * 2
        this.camera = null
        this.renderer = null
        this.controller = null

        this.rayRaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.target = null // 当前点击对象
        this.tween = null
        this.scene = null
        this.earthGroup = null
        this.locationGroup = null
        this.cloud = null
        // this.hasGlow = false

        this.autoRotate = true
        this.rotationSpeed = 0.001
        this.cloudSpeed = -0.0003

        this._init()
    }

    _init() {
        this._createRenderer()
        this._createScene()
        this._createCamera()
        this._createLight()
        this._createEarth()
        // 地球光晕
        this._createEarthSprite()
        this._createCloud()
        this._createLocations()
        this._createController()
        this._createRaycaster()
        // this.initTween()
        this._loop()


    }

    _createRaycaster() {
        const rayRaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        var _this = this;

        // 标注点击
        function onClick(event) {
            console.log('event:', event);

            // 计算坐标，直接把公式拿过来使用
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = 1 - (event.clientY / window.innerHeight) * 2;

            let { top, left, width, height } =
                _this.container.getBoundingClientRect();
            let clientX = event.clientX - left;
            let clientY = event.clientY - top;

            mouse.x = (clientX / width) * 2 - 1;
            mouse.y = -(clientY / height) * 2 + 1;

            // 射线
            rayRaster.setFromCamera(mouse, _this.camera);

            // console.log('_this.scene', _this.earthGroup)

            // 射线穿过的物体，也就是点中的物体
            // 返回一个数组，所有点击到的物体集合
            // const intersects = rayRaster.intersectObjects(_this.scene.children, false);
            const intersects = rayRaster.intersectObjects(_this.earthGroup.children);

            // 如果有length说明射线穿过了某些物体，一般取第一个即可(看具体需求)
            if (intersects.length && intersects[0].object.name) {

                // console.log('intersects', intersects);
                const select = intersects[0]
                _this.target = LOCATIONS.filter(location => location.name === select.object.name)[0]
                // console.log('_this.target:', _this.target);
                //@ts-ignore 
                select?.object.material.color.set(coloring());//变为红色
                // _this._forward()
                bus.$emit('getTarget', _this.target)

            }
        }

        function coloring() {
            return '#' + (Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'))
        }

        document.addEventListener("click", onClick, false);
    }

    _forward() {
        let that = this
        let target = this.target

        // if (this.tween) {
        //     TWEEN.update()
        // } else {
        this.tween = new TWEEN.Tween(that.cameraPosition())
            // this.tween = new TWEEN.Tween({ x: target.position[0], y: target.position[1], z: target.position[2] })
            .to(
                {
                    x: target.cameraFarPosition[0],
                    y: target.cameraFarPosition[1],
                    z: target.cameraFarPosition[2]
                },
                1200
            )
            .onUpdate(function () {
                //@ts-ignore 
                that.setCamera(this.x, this.y, this.z)
            })
            .onComplete(function () {
                // that.stopAutoRotate()
                // that.controller.changeState('zooming')
                that.tween = null
            })
            .start()
        // }
    }

    _createController() {
        let controller = new OrbitControls(this.camera, this.renderer.domElement)
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controller.enableDamping = true;
        controller.rotateSpeed = 0.3
        controller.autoRotate = false
        controller.enableZoom = false
        controller.enablePan = false
        controller.enabled = true
        this.controller = controller
    }

    _createCamera() {
        let camera = new THREE.PerspectiveCamera(
            40,
            this.width / this.height,
            0.1,
            1000
        )
        // camera.position.set(0, 0, -28)
        // camera.position.set(3.55, 0, -328)
        camera.position.set(5, - 20, 200);
        camera.lookAt(0, 3, 0);
        this.scene.add(camera) // this is required cause there is a light under camera
        this.camera = camera
    }

    _createLight() {
        this.scene.add(createAmbientLight())
        this.camera.add(createSpotLight()) // fixed light direction by adding it as child of camera
    }

    _createScene() {
        this.scene = new THREE.Scene()
        this.earthGroup = new THREE.Group()
        this.locationGroup = new THREE.Group()

        this.scene.add(this.earthGroup)
        this.earthGroup.add(this.locationGroup)
    }

    _createEarth() {
        const earth = createEarth()
        this.earthGroup.add(earth)
    }

    _createEarthSprite() {
        const earthSprite = createEarthSprite()
        earthSprite.scale.set(5 * 3, 5 * 3, 1);
        this.earthGroup.add(earthSprite)
    }

    _createCloud() {
        let cloud = createCloud()
        this.earthGroup.add(cloud)
        this.cloud = cloud
    }

    _createLocations() {
        LOCATIONS.forEach((location) => {
            let sprite = createLocationSprite(location)
            sprite.name = location.name
            this.locationGroup.add(sprite)
        })
    }

    _createRenderer() {
        let renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        })
        let container = this.container

        renderer.setClearColor(0x000000, 0)
        // renderer.setPixelRatio(window.devicePixelRatio) // this line would make FPS decreased at 30 for mobile device
        renderer.setSize(this.width, this.height)
        renderer.domElement.style.position = 'relative'
        renderer.domElement.style.width = this.width / 2 + 'px'
        renderer.domElement.style.height = this.height / 2 + 'px'
        container.appendChild(renderer.domElement)
        this.renderer = renderer
    }


    _loop() {
        requestAnimationFrame(this._loop.bind(this))
        this._animate()
        this._render()
    }

    _animate() {
        const rotationSpeed = this.rotationSpeed
        const cloudSpeed = this.cloudSpeed

        if (this.autoRotate) {
            this.camera.position.x =
                this.camera.position.x * Math.cos(rotationSpeed) -
                this.camera.position.z * Math.sin(rotationSpeed)
            this.camera.position.z =
                this.camera.position.z * Math.cos(rotationSpeed) +
                this.camera.position.x * Math.sin(rotationSpeed)

            // this.earthGroup.rotation.y = this.earthGroup.rotation.y - rotationSpeed;
        }

        this.cloud.rotation.y += cloudSpeed
        this.controller.update()

    }

    // initTween() {
    //     this.tween = this._cameraCon();
    //     this.tween.start();
    // }

    // _cameraCon() {
    //     const that = this

    //     var tween = new TWEEN.Tween({
    //         x: 3.55,
    //         y: 0,
    //         z: -328,
    //         ry: 0
    //     })
    //         .to(
    //             {
    //                 x: 0,
    //                 y: 0,
    //                 z: -28,
    //                 ry: Math.PI * -2
    //             },
    //             1600
    //         )
    //         .onUpdate(function () {
    //             //@ts-ignore 
    //             that.setCamera(this.x, this.y, this.z)
    //             //@ts-ignore 
    //             that.earthGroup.rotation.y = this.ry
    //         })
    //         .onComplete(function () {
    //             // controller.changeState('idle')
    //         })
    //         .easing(TWEEN.Easing.Cubic.Out)
    //         .start()

    //     return tween;
    // }

    _render() {
        this.renderer.render(this.scene, this.camera)
    }

    setCamera() {
        if (arguments.length === 3) {
            this.camera.position.set(arguments[0], arguments[1], arguments[2])
        } else {
            this.camera.position.set(arguments[0].x, arguments[0].y, arguments[0].z)
        }
    }

    cameraPosition() {
        return {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        }
    }

    startAutoRotate() {
        this.autoRotate = true
    }

    stopAutoRotate() {
        this.autoRotate = false
    }
}