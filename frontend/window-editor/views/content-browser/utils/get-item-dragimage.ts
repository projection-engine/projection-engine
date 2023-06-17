import LocalizationEN from "../../../../../contants/LocalizationEN";


export default function getItemDragImage(data, type, metadata) {
	let body
	if (type !== 0)
		body = `
                <div>
                    <strong>${LocalizationEN.ITEM_TYPE}:</strong>
                    <small>${metadata.typeName}</small>
                </div>
                <div>
                    <strong>${LocalizationEN.REGISTRY_ID}:</strong>
                    <small>${data.registryID}</small>
                </div>
            `
	else
		body = `
                <div>
                    <strong>${LocalizationEN.CHILDREN}:</strong>
                    <small>${metadata.childQuantity}</small>
                </div>
            `
	return `
             <div style="   display: grid;">
                <div>
                    <strong>${LocalizationEN.ITEM_NAME}: </strong>
                    <small>${data.name}</small>
                </div>
                ${body}
            </div>
        `
}