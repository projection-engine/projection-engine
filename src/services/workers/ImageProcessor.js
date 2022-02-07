export default class ImageProcessor{
    static colorToImage(color){
        const c = document.createElement("canvas");
        c.width=1024
        c.height=1024
        let ctx = c.getContext("2d");
        ctx.fillStyle = color
        ctx.fillRect(0,0,1024,1024)
        return c.toDataURL()
    }
    static async reduceImage(src){
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
}