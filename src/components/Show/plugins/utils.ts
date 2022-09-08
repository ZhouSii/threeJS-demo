import { TextureLoader } from 'three'
import { IMAGE_URLS } from '@/config/constants'

const loader = new TextureLoader()
loader.crossOrigin = ''

// export function getCanvasImage(image, width, height) {
//     let canvas = document.createElement('canvas')
//     let context = null
//     canvas.width = width || image.naturalWidth
//     canvas.height = height || image.naturalHeight
//     context = canvas.getContext('2d')
//     context.drawImage(image, 0, 0)
// }

export function getTexture(imageName) {
    return loader.load(IMAGE_URLS[imageName])
}

export function isSamePosition(position1, position2, accuracy = 0.01) {
    return Math.abs(position1.x - position2.x) < accuracy && Math.abs(position1.y - position2.y) < accuracy && Math.abs(position1.z - position2.z) < accuracy
}
