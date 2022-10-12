export default function getUniformObject(u) {
    const o = {}
    u.forEach(uu => o[uu.key] = uu.data)
    return o
}