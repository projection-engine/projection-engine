import FileSystem from "../libs/FileSystem"
import AsyncFS from "../libs/AsyncFS"
import SCRIPT_TEMPLATE from "../static/misc/SCRIPT_TEMPLATE"
import FILE_TYPES from "../../../../electron/static/FILE_TYPES";

const {shell} = window.require("electron")
export default function openLevelBlueprint(){
    const path = window.fileSystem.path + FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT
    AsyncFS.exists(path)
        .then(res=> {
            if(!res)
                window.fileSystem.writeFile(FileSystem.sep + FILE_TYPES.LEVEL_SCRIPT, SCRIPT_TEMPLATE)
                    .then(res => {
                        if(res) {
                            window.fileSystem.refresh()
                            shell.openPath(path).catch(() => alert.pushAlert("Error opening file", "error"))
                        }
                        else
                            alert.pushAlert("Error creating file", "error")
                    })
            else
                shell.openPath(path).catch(() => alert.pushAlert("Error loading file", "error"))
        })
}