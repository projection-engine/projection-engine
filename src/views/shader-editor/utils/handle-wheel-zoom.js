import ShaderEditorTools from "../libs/ShaderEditorTools";

export default function handleWheelZoom(e){
    e.preventDefault()
    let s = ShaderEditorTools.scale
    if (e.wheelDelta > 0 && s < 3)
        s += s * .1
    else if (e.wheelDelta < 0 && s >= .5)
        s -= s * .1
    e.currentTarget.lastElementChild.style.transform = "scale(" + s + ")"
    ShaderEditorTools.scale = s
}