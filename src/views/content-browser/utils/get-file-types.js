import FILE_TYPES from "shared-resources/FILE_TYPES";
import Localization from "../../../templates/Localization";

export default function getFileTypes() {
    const c = {...FILE_TYPES}
    return Object.keys(c).map(m => [m, Localization[m]]).filter(e => e[1] != null)

}