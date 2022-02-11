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


    static blendWithColor(widthR, heightR, src, [r, g, b, a]) {
        const c = document.createElement("canvas");
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
                    const red = data[i] * r;
                    const green = data[i + 1] * g;
                    const blue = data[i + 2] * b;
                    const alpha = data[i + 3] * a;

                    newImage[i] = red
                    newImage[i + 1] = green
                    newImage[i + 2] = blue
                    newImage[i + 3] = alpha
                }
                imgData.data.set( newImage)
                ctx.putImageData(imgData, 0, 0)

                resolve(c.toDataURL())
            }
        })
    }
}