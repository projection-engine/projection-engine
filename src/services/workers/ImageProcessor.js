export const COLOR_BLEND_OPERATIONS = {
    ADD: 0,
    MULTIPLY: 1,
    POWER: 2
}
export default class ImageProcessor {
    static colorToImage(color) {
        const c = document.createElement("canvas");
        c.width = 1024
        c.height = 1024
        let ctx = c.getContext("2d");
        ctx.fillStyle = color
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


    static blendWithColor(widthR, heightR, src, color, operation) {
        const c = document.createElement("canvas");
        const split = color.match(/[\d.]+/g)
        const [r, g, b] = split.map(v => parseFloat(v))
        c.width = widthR
        c.height = heightR

        const imageToLoad = new Image()
        imageToLoad.src = src


        return new Promise(resolve => {
            imageToLoad.onload = () => {
                let ctx = c.getContext("2d");
                ctx.drawImage(imageToLoad, 0, 0)

                const imgData = ctx.getImageData(0, 0, widthR, heightR);
                const data = imgData.data;
                let newImage = new Array(data.length)
                for (let i = 0; i < data.length; i += 4) {
                    switch (operation) {
                        case COLOR_BLEND_OPERATIONS.POWER:
                            newImage[i] = data[i] ** r
                            newImage[i + 1] =  data[i + 1] ** g
                            newImage[i + 2] =data[i + 2] ** b
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

}