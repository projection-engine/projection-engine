export default function hsv2Rgb(h, s, v) {
    let rgb = {};


    if (s === 0)
        rgb.r = rgb.g = rgb.b = v;
    else {
        let t1 = v, t2 = (255 - s) * v / 255, t3 = (t1 - t2) * (h % 60) / 60;

        if (h === 360) h = 0;

        if (h < 60) {
            rgb.r = t1;
            rgb.b = t2;
            rgb.g = t2 + t3
            return rgb
        }
        if (h < 120) {
            rgb.g = t1;
            rgb.b = t2;
            rgb.r = t1 - t3
            return rgb
        }
        if (h < 180) {
            rgb.g = t1;
            rgb.r = t2;
            rgb.b = t2 + t3
            return rgb
        }
        if (h < 240) {
            rgb.b = t1;
            rgb.r = t2;
            rgb.g = t1 - t3
            return rgb
        }
        if (h < 300) {
            rgb.b = t1;
            rgb.g = t2;
            rgb.r = t2 + t3
            return rgb
        }
        if (h < 360) {
            rgb.r = t1;
            rgb.g = t2;
            rgb.b = t1 - t3
            return rgb
        }
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0

    }
    return rgb
}