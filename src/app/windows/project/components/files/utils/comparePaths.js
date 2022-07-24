import FileSystem from "../../../libs/FileSystem"

export default function comparePaths(includes, included) {
    const path = window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep
    const fixedIncludes = FileSystem.fixPath(path + includes)
    const fixedIncluded = FileSystem.fixPath(path + included)
    return fixedIncludes.includes(fixedIncluded)
}