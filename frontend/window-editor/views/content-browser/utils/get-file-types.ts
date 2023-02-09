import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
import FILE_TYPES from "../../../../../static/objects/FILE_TYPES";

export default function getFileTypes() {
    const c = {...FILE_TYPES}
    return Object.keys(c).map(m => m === FILE_TYPES.PROJECT ? undefined : [m, LOCALIZATION_EN[m]]).filter(e => e[1] != null)

}