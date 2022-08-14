const {readRegistry} = require( "./fs-operations")
const REG_PATH = require( "../../../../assets/REG_PATH")
const CHANNELS = require( "../../../../assets/CHANNELS")

const fs = require("fs")
const path = require("path")

module.exports =  function cleanUpRegistry(projectPath, listenID, sender) {
    
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
