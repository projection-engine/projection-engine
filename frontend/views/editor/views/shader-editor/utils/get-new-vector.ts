import DATA_TYPES from "../../../../../../engine-core/static/DATA_TYPES";

export default function getNewVector(value, v, index, type) {
    switch (type) {
        case  DATA_TYPES.VEC2:
            return [index === 0 ? v : value[0], index === 1 ? v : value[1]]
        case  DATA_TYPES.VEC3:
            return [
                index === 0 ? v : value[0],
                index === 1 ? v : value[1],
                index === 2 ? v : value[2]
            ]
        case  DATA_TYPES.VEC4:
            return [
                index === 0 ? v : value[0],
                index === 1 ? v : value[1],
                index === 2 ? v : value[2],
                index === 3 ? v : value[3]
            ]
        default:
            return value
    }
}