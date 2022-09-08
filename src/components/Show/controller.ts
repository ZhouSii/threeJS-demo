// import { LOCATIONS } from '@/assets/js/constants'
import TWEEN from 'tween.js'

/* BaseState class */
class BaseState {
    controller: any
    constructor(controller) {
        this.controller = controller
    }

    forward() { }

    backward() { }
}


/**
 * IdleState class
 *
 * Foward: 进入下一个状态，也就是 RotatingState
 * Backward: no backward
 */
class IdleState extends BaseState {
    constructor(controller) {
        super(controller)
        // don't play audio sprite if EnteringState => IdleState
        // cause nextTarget() will play the audio
        // if (!(controller.state instanceof EnteringState)) {
        //     controller.playSprite('audio')
        // }

        controller.earth.controller.enabled = true
    }

    forward() {
        console.log("changeState('rotating')")
        this.controller.changeState('rotating')
    }
}

/**
 * RotatingState class
 *
 * Forward: 如果到达cameraFarPosition，然后移动到下一个状态，这是ZoomingState;否则，保持相机固定，直到到达目标
 * Backward: 返回IdleState，直到旋转完成
 */
class RotatingState extends BaseState {
    tween: null
    constructor(controller) {
        super(controller)
        this.tween = null
        // controller.pauseSprite('audio')
        controller.earth.controller.enabled = false
    }

    forward() {
        console.log('RotatingState:forward')

        let that = this
        let earth = this.controller.earth
        let target = this.controller.target
        // let target = earth.target

        if (this.tween) {
            TWEEN.update()
        } else {
            this.tween = new TWEEN.Tween(earth.cameraPosition())
                .to(
                    {
                        x: target.cameraFarPosition[0],
                        y: target.cameraFarPosition[1],
                        z: target.cameraFarPosition[2]
                    },
                    1000
                )
                .onUpdate(function () {
                    //@ts-ignore 
                    earth.setCamera(this.x, this.y, this.z)
                })
                .onComplete(function () {
                    that.controller.changeState('zooming')
                    that.tween = null
                })
                .start()
        }
    }

    backward() {
        if (this.tween) {
            TWEEN.update()
        } else {
            this.controller.state = new IdleState(this.controller)
        }
    }
}


/**
 * ZoomingState class
 *
 * Forward: 从当前摄像机位置到目标摄像机附近位置，一旦到达该位置，进入下一个状态，即DivingState
 * Backward: 从当前相机位置到相机远端的目标位置，一旦到达该位置，进入空闲状态
 */
class ZoomingState extends BaseState {
    direction: string
    tween: any
    constructor(controller) {
        super(controller)
        this.direction = ''
        this.tween = null
        controller.hideCloud()
        controller.showEarth()
    }

    _setDirection(direction) {
        let that = this
        let earth = this.controller.earth
        let target = this.controller.target
        let from = earth.cameraPosition()
        let to: any = null

        if (this.direction !== direction) {
            if (direction === 'forward') {
                to = {
                    x: target.cameraNearPosition[0],
                    y: target.cameraNearPosition[1],
                    z: target.cameraNearPosition[2]
                }
            } else {
                to = {
                    x: target.cameraFarPosition[0],
                    y: target.cameraFarPosition[1],
                    z: target.cameraFarPosition[2]
                }
            }

            this.direction = direction
            this.tween && this.tween.stop()

            this.tween = new TWEEN.Tween(from)
                .to(to, 1000)
                .onUpdate(function () {
                    //@ts-ignore 
                    earth.setCamera(this.x, this.y, this.z)
                })
                .onComplete(function () {
                    that._handleTweenComplete()
                })
                .start()
        }
    }

    _handleTweenComplete() {
        console.log('_handleTweenComplete:');

        if (this.direction === 'forward') {
            this.controller.changeState('diving')
        } else {
            this.controller.changeState('idle')
        }
        this.tween = null
    }

    forward() {
        this._setDirection('forward')
        if (this.tween) {
            TWEEN.update()
        }
    }

    backward() {
        this._setDirection('backward')
        if (this.tween) {
            TWEEN.update()
        }
    }
}

/**
 * DivingState class
 *
 * Forward: 从当前帧索引到帧索引结束，一旦到达结束，进入下一个状态，即PresentingState
 * Backward: 从当前帧索引到帧索引的开始，一旦到达开始，就进入到之前的状态，即DivingState
 */
class DivingState extends BaseState {
    count: number
    constructor(controller) {
        super(controller)
        this.count = 0
        controller.showCloud()
        controller.hideEarth()
        controller.hideVideo()
    }

    _throttle(fn) {
        if (this.count % 3 === 0) {
            fn && fn()
            this.count = 0
        }
        this.count++
    }

    forward() {
        let cloud = this.controller.cloud
        if (cloud.currentFrameIndex === cloud.images.length - 1) {
            console.log('presenting:');

            this.controller.changeState('presenting')
        } else {
            this._throttle((_) => cloud.next())
        }
    }

    backward() {
        let cloud = this.controller.cloud
        if (cloud.currentFrameIndex === 0) {
            this.controller.changeState('zooming')
        } else {
            this._throttle((_) => cloud.prev())
        }
    }
}


/**
 * PresentingState class
 *
 * Forward: 不作任何操作
 * Backward: 切换到之前的状态，即DivingState
 */
class PresentingState extends BaseState {
    constructor(controller) {
        super(controller)
        controller.hideCloud()
        controller.showVideo()
    }

    backward() {
        this.controller.changeState('diving')
    }
}

class EnteringState extends BaseState {
    tween: any
    constructor(controller) {
        super(controller)
        this.tween = new TWEEN.Tween({
            x: 3.55,
            y: 0,
            z: -328,
            ry: 0
        })
            .to(
                {
                    x: 0,
                    y: 0,
                    z: -28,
                    ry: Math.PI * -2
                },
                1600
            )
            .onUpdate(function () {
                //@ts-ignore 
                controller.earth.setCamera(this.x, this.y, this.z)
                //@ts-ignore 
                controller.earth.earthGroup.rotation.y = this.ry
            })
            .onComplete(function () {
                controller.changeState('idle')
            })
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
    }

    forward() {
        TWEEN.update()
    }
}


/* Controller class */
export default class Controller {
    earth: any
    cloud: any
    // audioSprite: any
    videoSprite: any
    onStateChange: any
    state: any
    touchDown: boolean
    target: any
    content: any
    constructor(options) {
        // 地球
        this.earth = options.earth
        // 云层
        this.cloud = options.cloud

        this.content = options.content
        // this.audioSprite = options.audioSprite
        this.videoSprite = options.videoSprite
        this.onStateChange = options.onStateChange

        this.state = null
        this.touchDown = false
        this.target = null

        this._init()
    }

    _init() {
        setTimeout((_) => {
            this.state = new EnteringState(this)
        }, 800)
        this._loop()
    }
    _loop() {
        // throw new Error('Method not implemented.')
        requestAnimationFrame(this._loop.bind(this))
        this._animate()
    }

    _animate() {
        if (!this.state) {
            return
        }

        if (this.state instanceof EnteringState) {
            this.state.forward()
        }

        if (this.touchDown && this.target) {
            this.state.forward()
        } else {
            this.state.backward()
        }
    }

    showEarth() {
        this.earth.container.style.display = 'block'
    }

    hideEarth() {
        this.earth.container.style.display = 'none'
    }

    showCloud() {
        this.cloud.el.style.display = 'block'
    }

    hideCloud() {
        this.cloud.el.style.display = 'none'
    }

    showVideo() {
        // this.playSprite('video')
        // this.videoSprite.media.style.display = 'block'
        this.content.style.display = 'block'
    }

    hideVideo() {
        // this.pauseSprite('video')
        // this.videoSprite.media.style.display = 'none'
        this.content.style.display = 'none'
    }

    playSprite(type) {
        if (!this.target) {
            return
        }

        if (type === 'video') {
            this.videoSprite.repeat(this.target.name)
        } else if (type === 'audio') {
            // this.audioSprite.play(this.target.name)
        }
    }

    pauseSprite(type) {
        if (type === 'video') {
            this.videoSprite.pause()
        } else if (type === 'audio') {
            // this.audioSprite.pause()
        }
    }

    start() {
        this.touchDown = true
    }

    end() {
        this.touchDown = false
    }

    changeState(stateName) {
        console.log('stateName', stateName)

        switch (stateName) {
            case 'idle':
                this.state = new IdleState(this)
                break
            case 'rotating':
                this.state = new RotatingState(this)
                break
            case 'zooming':
                this.state = new ZoomingState(this)
                break
            case 'diving':
                this.state = new DivingState(this)
                break
            case 'presenting':
                this.state = new PresentingState(this)
                break
            default:
                this.state = new BaseState(this)
        }
        this.onStateChange && this.onStateChange(stateName)
    }
}