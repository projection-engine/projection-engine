import FilesAPI from "./FilesAPI";
import ERROR_LOG_FILE from "../../../assets/ERROR_LOG_FILE";

export default class ErrorLoggerAPI{
    static get path(){
        return localStorage.getItem("basePath") + FilesAPI.sep + ERROR_LOG_FILE
    }
    static initialize(){
        // console.error = (...messages) => {
        //     const p = ErrorLoggerAPI.path
        //     FilesAPI.writeFile(p, JSON.stringify(messages), true).catch()
        //     console.error(...messages)
        // }
    }
}