import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../../../libs/files/FilesAPI";
import BOARD_SIZE from "../views/shader-editor/data/BOARD_SIZE";
import compiler from "../views/shader-editor/libs/compiler";
import AssetAPI from "../../../libs/files/AssetAPI";
import ErrorLoggerAPI from "../../../libs/files/ErrorLoggerAPI";
import PreviewSystem from "./engine/editor/services/PreviewSystem";
import MaterialInstance from "./engine/production/controllers/instances/MaterialInstance";


export default function InitializeWindow() {
    ErrorLoggerAPI.initialize()
    FilesAPI.initializeFolders()
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat
}