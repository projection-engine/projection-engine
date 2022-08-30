import compiler from "./compiler"
import {trimString} from "../../../libs/engine/production/controllers/instances/ShaderInstance";

export default async function buildShader(nodes, links, openFile, setStatus, translate){
    alert.pushAlert(translate("COMPILING"), "info")
    const {
        shader,
        vertexShader,
        uniformData,
        settings,
        info,
        cubeMapShader
    } = await compiler(nodes.filter(n => !n.isComment), links)

    if (shader) {
        const currentMaterial = window.renderer.materials.find(m => m.id === openFile.registryID)
        let promise
        if (!currentMaterial)
            alert.pushAlert(translate("NOT_APPLIED"), "alert")
        else {

            promise = new Promise(resolve => {
                currentMaterial.shader = [shader, vertexShader, uniformData, (shaderMessage) => resolve(shaderMessage), settings]
                currentMaterial.cubeMapShader = [cubeMapShader.code, vertexShader]
            })
        }
        const m = await promise
        const message = m ? m : {messages: []}
        const shaderSplit = trimString(shader).split(";")
        let parsed = []
        setStatus({
            ...message,
            messages: message.messages
                .map(m => m.split("ERROR"))
                .flat()
                .map(m => {
                    const data = {lines: []}
                    if (m.length > 0) {
                        const match = m.match(/:\s([0-9]+):([0-9]+)/gm),
                            matchS = m.match(/:\s([0-9]+):([0-9]+)/m)
                        if (matchS) {
                            let s = matchS[0].split("")
                            s.shift()
                            const [, end] = s.join("").split(":")
                            if (!parsed.includes(end)) {
                                data.lines = shaderSplit.slice(end - 9, end - 8)
                                parsed.push(end)
                                data.error = "ERROR" + m
                                data.label = "ERROR" + match[0]
                                return data
                            }
                        }
                    }
                }).filter(e => e),
            info
        })
    }
}