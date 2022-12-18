import Localization from "../../../templates/LOCALIZATION_EN";

export default function getItemDragImage(childQuantity, data, type, metadata) {
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
                    <small>${childQuantity}</small>
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