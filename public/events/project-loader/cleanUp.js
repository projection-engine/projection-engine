import {rm} from "../file-system/FSEvents"
import {readRegistry} from "./FSOperations"
import PathSep from "../../static/PathSep"
import REG_PATH from "../../static/REG_PATH"
import CHANNELS from "../../static/CHANNELS"

const fs = require("fs")
const path = require("path")

export default function cleanUpRegistry(projectPath, listenID, sender) {
    
    readRegistry(projectPath + PathSep.sep + REG_PATH).then(reg => {
        const promises = []
        for (let i in reg) {
            const {registryPath} = reg[i] ? reg[i] : {}
            if(registryPath) 
                promises.push(new Promise(resolve => {
                    fs.readFile(registryPath, (err, data) => {
                        if (!err) {
                            const objectData = JSON.parse(data.toString())
                            const filePath = path.resolve(projectPath + PathSep.sep + "assets" + PathSep.sep + objectData.path)
                            if (!fs.existsSync(filePath))
                                fs.rm(registryPath, (err) => {
                                    console.log(err, registryPath)
                                    resolve(true)
                                })
                            else
                                resolve()
                        }
                        else
                            resolve()
                    })
                }))
        }

        Promise.all(promises)
            .then(res => {
                if(res.filter(s => s).length > 0)
                    sender.send(CHANNELS.CLEAN_UP + "-" + listenID, undefined)
            })
    })
}
