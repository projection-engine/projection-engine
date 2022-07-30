export default function checkGlslFloat(v){
    return `${v}${v % 1 !== 0 ? "" : "."}`
}
