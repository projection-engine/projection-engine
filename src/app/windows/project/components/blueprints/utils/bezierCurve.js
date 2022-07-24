
export default function getBezierCurve({x, y}, {x1, y1}) {
    const pivot = x < x1 ? x + (x1 - x)/2 :x1 + (x - x1)/2
    return `M${x},${y} C${pivot},${y} ${pivot},${y1 } ${x1},${y1}`
}