export default function checkFloat(v){
    return `${v}${v % 1 !== 0 ? "" : "."}`
}
