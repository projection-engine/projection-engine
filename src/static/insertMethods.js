import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"

export default function insertMethods(fileSystem, pushEvent){

    // ALERT / FS
    alert.pushEvent = pushEvent
    document.fileSystem = fileSystem

    // MATH
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat


    // CONSOLE
    const oldLog = console.log
    console.targerts = []
    console.pushTarget = (ref) => {
        console.targerts.push(ref)
        ref.line = 0
    }
    console.removeTarget = (ref) => {
        console.targerts = console.targerts.filter(r => r !== ref)
    }
    console.log = (message) => {
        for(let i = 0; i < console.targerts.length; i++){
            const logger = console.targerts[i]
            const lastContent = logger.lastContent
            const emptyLine = ">> "

            if(lastContent === message){
                logger.looped += 1
                const newLine =  emptyLine + "(" + (logger.looped) + ") " + message + "\n"
                logger.textContent = logger.textContent.replace( logger.lastLine,  newLine)
                logger.lastLine = newLine
            }else {
                logger.looped = 0
                logger.line++
                let newLine
                if (typeof message == "object")
                    newLine = emptyLine + (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + "\n"
                else
                    newLine = emptyLine + message + "\n"
                logger.textContent += newLine
                logger.lastLine = newLine
            }
            logger.lastContent = message
            logger.scrollTop = logger.scrollHeight
        }
        // oldLog(message)
    }
}