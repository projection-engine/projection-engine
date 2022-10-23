import Localization from "../../../templates/Localization";

const translate = key => Localization.PROJECT.FILES[key]
export default function getItemDragImage(childrenQuantity, data, type, metadata) {
    let body
    if (type !== 0)
        body = `
                <div>
                    <strong>${translate("ITEM_TYPE")}:</strong>
                    <small>${metadata.typeName}</small>
                </div>
                <div>
                    <strong>${translate("REGISTRY_ID")}:</strong>
                    <small>${data.registryID}</small>
                </div>
            `
    else
        body = `
                <div>
                    <strong>${translate("CHILDREN")}:</strong>
                    <small>${childrenQuantity}</small>
                </div>
            `
    return `
             <div style="   display: grid;">
                <div>
                    <strong>${translate("ITEM_NAME")}: </strong>
                    <small>${data.name}</small>
                </div>
                ${body}
            </div>
        `
}