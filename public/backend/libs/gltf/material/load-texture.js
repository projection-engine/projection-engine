import getNormalizedName from "../utils/get-normalized-name";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import writeData from "../utils/write-data";
import {v4} from "uuid";
import TEXTURE_TEMPLATE from "../../../../engine/static/TEXTURE_TEMPLATE";

const path = require("path");
const fs = require("fs");


export default async function loadTexture(basePath, texture, textures, images, partialPath, projectPath, name, index) {
    const source = texture.index !== undefined ? textures[texture.index] : undefined
    const imgURI = source !== undefined ? images[source.source] : undefined

    if (imgURI !== undefined) {
        let file, fetched = false

        if (typeof imgURI.uri === "string" && imgURI.uri.includes("data:image"))
            file = imgURI.uri
        else {
            file = await new Promise(resolve => {
                const imgPath = path.resolve(basePath + path.sep + imgURI.uri)
                fs.readFile(
                    imgPath,
                    (_, buffer) => {
                        resolve(new Buffer(buffer).toString("base64"))
                    }
                )
            })
            fetched = true
        }
        if (file) {
            const imageBase64 = fetched ? `data:image/${imgURI.uri.split(".").pop()};base64, ` + file : "data:image/png;base64, " + file
            const id = v4().toString()

            await writeData(path.resolve(partialPath + getNormalizedName(`(${name}) texture-asset-(${id})`, index) + FILE_TYPES.TEXTURE), JSON.stringify({
                ...TEXTURE_TEMPLATE,
                base64: imageBase64
            }), id, projectPath, imageBase64)
            return id
        }
    }
}
