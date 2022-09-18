import NodeFS from "../../shared/libs/NodeFS";
import FilesAPI from "../../shared/libs/files/FilesAPI";
const { shell} = window.require("electron")

export default function getProjectContextMenu(toRender, setToRender){
    return [
        {
            icon: "delete_forever",
            label: "Delete",
            onClick: async node => {
                const id = node.getAttribute("data-card")
                const found = toRender.find(t => t.id === id)
                if(!found)
                    return

                await NodeFS.rm(FilesAPI.resolvePath(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + id), {recursive: true, force: true})
                setToRender(toRender.filter(e => e.id !== id))
            }
        },
        {
            icon: "folder",
            label: "Open in explorer",
            onClick: async node => {
                const id = node.getAttribute("data-card")
                const found = toRender.find(t => t.id === id)
                if(!found)
                    return

                shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FilesAPI.sep + id)
            }
        },

    ]
}