const path = require("path");
const fs = require("fs");
const {v4} = require("uuid");
const writeData = require("./write-data");
const getNormalizedName = require("../utils/get-normalized-name")
const FILE_TYPES = require("../../../../assets/FILE_TYPES");


module.exports = async function loadTexture(basePath, texture, textures, images, partialPath, projectPath, name, index) {
        const source = texture.index !== undefined ? textures[texture.index] : undefined
        const imgURI = source !== undefined ? images[source.source] : undefined

        if (imgURI !== undefined) {
            let file, fetched = false

            if (typeof imgURI.uri === "string" && imgURI.uri.includes("libs:image"))
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
                const imageBase64 = fetched ? `data:image/${imgURI.uri.split(".").pop()};base64, ` + file : "libs:image/png;base64, " + file
                const id = v4().toString()
                await writeData(path.resolve(partialPath + getNormalizedName("image-asset-" + name, index) + FILE_TYPES.IMAGE), imageBase64, id, projectPath, imageBase64)
            }
        }
    }

