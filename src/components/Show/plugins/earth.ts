import { Mesh, SphereGeometry, MeshPhongMaterial, Color, Sprite, SpriteMaterial } from 'three'
import { getTexture } from './utils'

export function createEarth() {
    return new Mesh(
        new SphereGeometry(5, 32, 32),
        new MeshPhongMaterial({
            map: getTexture('earth'),
            bumpMap: getTexture('earthBump'),
            bumpScale: 0.15,
            specularMap: getTexture('earthSpec'),
            specular: new Color('#909090'),
            shininess: 5,
            transparent: true
        })
    )
}


/**
 * 创建地球光晕特效
 */
export function createEarthSprite() {
    return new Sprite(
        new SpriteMaterial({
            map: getTexture('earthAperture'),
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        })
    )
}
