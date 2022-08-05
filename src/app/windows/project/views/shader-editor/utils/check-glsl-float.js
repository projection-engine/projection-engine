export default function checkGlslFloat(v){
    return `${v}${Number.isInteger(v)? "." : ""}`
}
