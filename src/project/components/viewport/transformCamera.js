export function rotateY(angle, vec) {
    const matrix = new Array(4)
    for (let i = 0; i < 4; i++) {
        matrix[i] = new Array(4).fill(0)
    }
    matrix[0][0] = Math.cos(angle);
    matrix[0][2] = Math.sin(angle);
    matrix[2][0] = -Math.sin(angle);
    matrix[1][1] = 1;
    matrix[2][2] = Math.cos(angle);
    matrix[3][3] = 1;
    return [
        vec[0] * matrix[0][0] + vec[1] * matrix[1][0] + vec[2] * matrix[2][0],
        vec[0] * matrix[0][1] + vec[1] * matrix[1][1] + vec[2] * matrix[2][1],
        vec[0] * matrix[0][2] + vec[1] * matrix[1][2] + vec[2] * matrix[2][2]
    ]
}


export function handleGrab(event, camera, type) {
    let requested = false
    const handleMouseMove = (e) => {
        if (!requested) {
            e.target.requestPointerLock()
            requested = true
        }


        const incrementX = ((0.1) * e.movementX),
            incrementY = ((0.1) * e.movementY),
            c = [...camera.centerOn]

        if (type === 1) {
            const newPosition = rotateY(camera.yaw, [incrementX, 0, 0])
            c[0] += newPosition[0]
            c[1] -= incrementY
            c[2] += newPosition[2]

            camera.centerOn = c
            camera.updateViewMatrix()
        } else {
            camera.radius += (0.1) * e.movementX
            camera.updateViewMatrix()
        }
    }
    const handleMouseUp = () => {
        document.exitPointerLock()
        document.removeEventListener('mousemove', handleMouseMove)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp, {once: true})
}