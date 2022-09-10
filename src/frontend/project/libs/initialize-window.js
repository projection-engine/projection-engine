import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../../libs/files/FilesAPI";
import ErrorLoggerAPI from "../../libs/files/ErrorLoggerAPI";


export default function InitializeWindow() {
    ErrorLoggerAPI.initialize()
    FilesAPI.initializeFolders()
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat
}