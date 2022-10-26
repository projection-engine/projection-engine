import Localization from "../../../templates/Localization";

export default function getItemDragImage(childrenQuantity, data, type, metadata) {
    let body
    if (type !== 0)
        body = `
                <div>
                    <strong>${Localization.ITEM_TYPE}:</strong>
                    <small>${metadata.typeName}</small>
                </div>
                <div>
                    <strong>${Localization.REGISTRY_ID}:</strong>
                    <small>${data.registryID}</small>
                </div>
            `
    else
        body = `
                <div>
                    <strong>${Localization.CHILDREN}:</strong>
                    <small>${childrenQuantity}</small>
                </div>
            `
    return `
             <div style="   display: grid;">
                <div>
                    <strong>${Localization.ITEM_NAME}: </strong>
                    <small>${data.name}</small>
                </div>
                ${body}
            </div>
        `
}