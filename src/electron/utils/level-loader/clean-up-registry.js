const {readRegistry} = require( "../file-system/fs-operations")
const REG_PATH = require( "../../../data/REG_PATH")
const CHANNELS = require( "../../../data/CHANNELS")

const fs = require("fs")
const path = require("path")
const getBasePath = require("../get-base-path");
const os = require("os");

module.exports =  function cleanUpRegistry(projectID, sender) {
    const projectPath = getBasePath(os, path) + projectID
    readRegistry(projectPath + path.sep + REG_PATH).then(reg => {
        const promises = []
        for (let i in reg) {
            const {registryPath} = reg[i] ? reg[i] : {}
            if(registryPath) 
                promises.push(new Promise(resolve => {
                    fs.readFile(registryPath, (err, data) => {
                        if (!err) {
                            const objectData = JSON.parse(data.toString())
                            const filePath = path.resolve(projectPath + path.sep + "assets" + path.sep + objectData.path)
                            if (!fs.existsSync(filePath))
                                fs.rm(registryPath, () => resolve(true))
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
                    sender.send(CHANNELS.CLEAN_UP + "-" + projectID, undefined)
            })
    })
}
