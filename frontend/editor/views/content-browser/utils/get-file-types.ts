import Localization from "../../../templates/LOCALIZATION_EN";

export default function getFileTypes() {
    const c = {...FILE_TYPES}
    return Object.keys(c).map(m => [m, Localization[m]]).filter(e => e[1] != null)

}