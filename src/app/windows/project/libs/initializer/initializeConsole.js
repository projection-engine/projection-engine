import ENVIRONMENT from "../engine/data/ENVIRONMENT";
import Entity from "../engine/libs/basic/Entity";

export default function initializeConsole() {
    const oldLog = console.log
    console.targerts = []
    console.pushTarget = (ref) => {
        console.targerts.push(ref)
        ref.line = 0
    }
    console.removeTarget = (ref) => {
        console.targerts = console.targerts.filter(r => r !== ref)
    }
    console.log = (...comps) => {
        let message = ""
        for (let i = 0; i < comps.length; i++) {
            if (typeof comps[i] === "object")
                message += JSON.stringify(
                    comps[i],
                    (key, value) => {
                        if (comps[i] instanceof Entity && key === "children" || key === "parent")
                            return {}
                        return value
                    },
                    4) + " \n"
            else
                message += comps[i] + " \n"
        }
        if (window.renderer && window.renderer.environment === ENVIRONMENT.PROD)
            for (let i = 0; i < console.targerts.length; i++) {
                const logger = console.targerts[i]
                const lastContent = logger.lastContent
                const emptyLine = ">> "

                if (lastContent === message) {
                    logger.looped += 1
                    const newLine = emptyLine + "(" + (logger.looped) + ") " + message + "\n"
                    logger.textContent = logger.textContent.replace(logger.lastLine, newLine)
                    logger.lastLine = newLine
                } else {
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
        oldLog(...comps)
    }
}