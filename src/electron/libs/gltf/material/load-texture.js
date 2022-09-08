const path = require("path");
const fs = require("fs");
const {v4} = require("uuid");
const writeData = require("../../../utils/gltf/write-data");
const getNormalizedName = require("../../../utils/gltf/get-normalized-name")
const FILE_TYPES = require("../../../../data/FILE_TYPES");

const TEXTURE_TEMPLATE = require("../../../../data/TEXTURE_TEMPLATE")
module.exports = async function loadTexture(basePath, texture, textures, images, partialPath, projectPath, name, index) {
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
                const imageBase64 =fetched ?  `data:image/${imgURI.uri.split(".").pop()};base64, ` + file : "data:image/png;base64, " + file
                const id = v4().toString()

                await writeData(path.resolve(partialPath + getNormalizedName("texture-asset-" + name, index) + FILE_TYPES.TEXTURE), JSON.stringify({...TEXTURE_TEMPLATE, base64: imageBase64}), id, projectPath, imageBase64)
                return id
            }
        }
    }
