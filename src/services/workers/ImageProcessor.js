import {func} from "prop-types";

export const COLOR_BLEND_OPERATIONS = {
    ADD: 0,
    MULTIPLY: 1,
    POWER: 2,
    LERP: 3 // TODO
}
export default class ImageProcessor {
    static noise(size) {
        let canvas = document.createElement("canvas");
        let w = canvas.width = size;
        let h = canvas.height = size;
        let context = canvas.getContext("2d");

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let num = Math.floor(Math.random() * 2)
                context.fillStyle = "rgb(" + num + "," + num + "," + num + ")";
                context.fillRect(i, j, 1, 1);
            }
        }

        return canvas.toDataURL()
    }

    static getPixel(ctx, x, y) {
        const imgData = ctx.getImageData(x, y, 1, 1);
        return imgData.data;
    }

    static getContext(image) {
        const c = document.createElement("canvas");
        c.width = image.naturalWidth
        c.height = image.naturalHeight

        let ctx = c.getContext("2d");
        ctx.drawImage(image, 0, 0)

        return ctx
    }

    static dataToImage(data, width, height, zeroToOne) {
        let parsed = data
        if (zeroToOne)
            parsed = data.map(d => {
                return d * 255 * (d < 0 ? -1 : 1)
            })

        let canvas = document.createElement("canvas");
        let w = canvas.width = width;
        let h = canvas.height = height;
        let context = canvas.getContext("2d");

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                context.fillStyle = `rgb(${parsed[i]}, ${parsed[i + 1]}, ${parsed[i + 2]})`
                context.fillRect(i, j, 1, 1);
            }
        }
        return canvas.toDataURL()
    }

    static extractChannel([r, g, b, a], img) {
        const c = document.createElement("canvas");
        const imageToLoad = new Image()

        return new Promise(resolve => {

            if (imageToLoad) {
                imageToLoad.onerror = () => resolve('')
                imageToLoad.onload = () => {
                    c.width = imageToLoad.width
                    c.height = imageToLoad.height

                    let ctx = c.getContext("2d");
                    ctx.drawImage(imageToLoad, 0, 0)

                    const imgData = ctx.getImageData(0, 0, imageToLoad.width, imageToLoad.height);
                    const data = imgData.data;
                    let newImage = new Array(data.length)
                    let accent = r ? 'iR' : g ? 'iG' : b ? 'iB' : 'iA'
                    for (let i = 0; i < data.length; i += 4) {
                        let col = {
                            iR: data[i] * r,
                            iG: data[i + 1] * g,
                            iB: data[i + 2] * b,
                            iA: data[i + 3] * a
                        }

                        newImage[i] = col[accent]
                        newImage[i + 1] = col[accent]
                        newImage[i + 2] = col[accent]
                        newImage[i + 3] = col.iA
                    }
                    imgData.data.set(newImage)
                    ctx.putImageData(imgData, 0, 0)
                    resolve(c.toDataURL())
                }
                imageToLoad.src = img
            } else
                resolve(img)
        })
    }

    static byChannels([r, g, b, a], img) {
        const c = document.createElement("canvas");
        const imageToLoad = new Image()

        return new Promise(resolve => {

            if (imageToLoad) {
                imageToLoad.onerror = () => resolve('')
                imageToLoad.onload = () => {
                    c.width = imageToLoad.width
                    c.height = imageToLoad.height

                    let ctx = c.getContext("2d");
                    ctx.drawImage(imageToLoad, 0, 0)

                    const imgData = ctx.getImageData(0, 0, imageToLoad.width, imageToLoad.height);
                    const data = imgData.data;
                    let newImage = new Array(data.length)
                    for (let i = 0; i < data.length; i += 4) {

                        newImage[i] = data[i] * r
                        newImage[i + 1] = data[i + 1] * g
                        newImage[i + 2] = data[i + 2] * b
                        newImage[i + 3] = data[i + 3] * a
                    }
                    imgData.data.set(newImage)
                    ctx.putImageData(imgData, 0, 0)
                    resolve(c.toDataURL())
                }
                imageToLoad.src = img
            } else
                resolve(img)
        })
    }

    static async invert(img) {
        const c = document.createElement("canvas");
        const imageToLoad = new Image()
        const ctx = c.getContext("2d");
        imageToLoad.src = img
        return await new Promise(resolve => {
            imageToLoad.onload = () => {
                c.width = imageToLoad.width
                c.height = imageToLoad.height

                ctx.drawImage(imageToLoad, 0, 0);
                ctx.globalCompositeOperation = 'difference';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, imageToLoad.width, imageToLoad.height);

                resolve(c.toDataURL())
            }
        })

    }

    static async heightBasedLinearInterpolate(image0, image1, heightImg, f) {
        const i0 = await getImageData(image0,),
            i1 = await getImageData(image1),
            heightMap = await getImageData(heightImg)


        return new Promise(resolve => {
            const data = i0.data.data
            const data0 = i1.data.data
            const height = heightMap.data.data

            let newImage = new Array(data.length)
            const factor = f*255
            for (let i = 0; i < data.length; i += 4) {
                if(height[i] > factor) {
                    newImage[i] = data[i]
                    newImage[i + 1] = data[i + 1]
                    newImage[i + 2] = data[i + 2]
                    newImage[i + 3] = data[i + 3]
                }
                else{
                    newImage[i] = data0[i]
                    newImage[i + 1] = data0[i + 1]
                    newImage[i + 2] = data0[i + 2]
                    newImage[i + 3] = data0[i + 3]
                }
            }
            i0.data.data.set(newImage)
            i0.context.putImageData(i0.data, 0, 0)
            resolve(i0.canvas.toDataURL())
        })
    }

    static async linearInterpolate(img, img0, factor) {
        const i0 = await getImageData(img),
            i1 = await getImageData(img0)


        return new Promise(resolve => {
            const data = i0.data.data
            const data0 = i1.data.data

            let newImage = new Array(data.length)

            for (let i = 0; i < data.length; i += 4) {
                newImage[i] = data[i] * (1 - factor) + data0[i] * factor
                newImage[i + 1] = data[i + 1] * (1 - factor) + data0[i + 1] * factor
                newImage[i + 2] = data[i + 2] * (1 - factor) + data0[i + 2] * factor
                newImage[i + 3] = data[i + 3] * (1 - factor) + data0[i + 3] * factor
            }
            i0.data.data.set(newImage)
            i0.context.putImageData(i0.data, 0, 0)
            resolve(i0.canvas.toDataURL())
        })
    }

    static colorToImage(color) {
        const c = document.createElement("canvas");
        c.width = 1024
        c.height = 1024
        let ctx = c.getContext("2d");
        ctx.fillStyle = typeof color === 'string' ? color : `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
        ctx.fillRect(0, 0, 1024, 1024)
        return c.toDataURL()
    }

    static async reduceImage(src) {
        return new Promise(resolve => {
            let img = new Image();
            img.src = src

            img.onload = () => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, 256, 256);
                resolve(canvas.toDataURL())
            }

        })
    }


    static blendWithColor(src, color, operation) {
        const c = document.createElement("canvas");
        const split = color.match(/[\d.]+/g)
        const [r, g, b] = split.map(v => parseFloat(v))

        const imageToLoad = new Image()
        imageToLoad.src = src


        return new Promise(resolve => {
            imageToLoad.onload = () => {
                c.width = imageToLoad.width
                c.height = imageToLoad.height
                let ctx = c.getContext("2d");
                ctx.drawImage(imageToLoad, 0, 0)

                const imgData = ctx.getImageData(0, 0, imageToLoad.width, imageToLoad.height);
                const data = imgData.data;
                let newImage = new Array(data.length)
                for (let i = 0; i < data.length; i += 4) {
                    switch (operation) {
                        case COLOR_BLEND_OPERATIONS.POWER:
                            newImage[i] = data[i] ** r
                            newImage[i + 1] = data[i + 1] ** g
                            newImage[i + 2] = data[i + 2] ** b
                            newImage[i + 3] = data[i + 3]
                            break
                        case COLOR_BLEND_OPERATIONS.ADD:
                            newImage[i] = data[i] + r
                            newImage[i + 1] = data[i + 1] + g
                            newImage[i + 2] = data[i + 2] + b
                            newImage[i + 3] = data[i + 3]
                            break
                        default:
                            newImage[i] = data[i] * r
                            newImage[i + 1] = data[i + 1] * g
                            newImage[i + 2] = data[i + 2] * b
                            newImage[i + 3] = data[i + 3]
                            break
                    }
                }
                imgData.data.set(newImage)
                ctx.putImageData(imgData, 0, 0)

                resolve(c.toDataURL())
            }
        })
    }

    static specularToMetallic(img) {

    }
}

async function getImageData(img) {
    const c = document.createElement("canvas");
    const imageToLoad = new Image()
    imageToLoad.src = img

    return await new Promise(resolve => {
        imageToLoad.onload = () => {
            c.width = imageToLoad.width
            c.height = imageToLoad.height
            let ctx = c.getContext("2d");
            ctx.drawImage(imageToLoad, 0, 0)
            resolve({
                data: ctx.getImageData(0, 0, imageToLoad.width, imageToLoad.height),
                canvas: c,
                context: ctx
            })
        }
    })
}