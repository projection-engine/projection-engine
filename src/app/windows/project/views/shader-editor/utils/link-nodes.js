import DATA_TYPES from "../../../libs/engine/data/DATA_TYPES";

export default function linkNodes(event, inputData, node, handleLink) {
    const data = JSON.parse(event.dataTransfer.getData("text"))
    event.currentTarget.style.background = "var(--pj-background-primary)"

    if (data.type === "output" && (inputData.accept.includes(data.attribute.type) || inputData.accept.includes(DATA_TYPES.ANY)))
        handleLink(data, {
            attribute: inputData,
            id: node.id
        })

    else
        alert.pushAlert(
            "Invalid type",
            "error"
        )

}