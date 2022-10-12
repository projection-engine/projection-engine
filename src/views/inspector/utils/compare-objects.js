export default function compareObjects(obj1, obj2) {
    let isValid = true
    Object.entries(obj1).forEach(([k, v]) => {
        if(k === "value")
            return

        if (typeof obj2[k] === "object")
            isValid = isValid && compareObjects(v, obj2[k])
        else if (obj2[k] === v)
            isValid = isValid && true

    })
    return isValid
}