import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";

export default function getItemDragImage(childQuantity, data, type, metadata) {
    let body
    if (type !== 0)
        body = `
                <div>
                    <strong>${LOCALIZATION_EN.ITEM_TYPE}:</strong>
                    <small>${metadata.typeName}</small>
                </div>
                <div>
                    <strong>${LOCALIZATION_EN.REGISTRY_ID}:</strong>
                    <small>${data.registryID}</small>
                </div>
            `
    else
        body = `
                <div>
                    <strong>${LOCALIZATION_EN.CHILDREN}:</strong>
                    <small>${childQuantity}</small>
                </div>
            `
    return `
             <div style="   display: grid;">
                <div>
                    <strong>${LOCALIZATION_EN.ITEM_NAME}: </strong>
                    <small>${data.name}</small>
                </div>
                ${body}
            </div>
        `
}