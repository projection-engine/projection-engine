import ProjectController from "../libs/ProjectController";

const {BrowserWindow, app, ipcMain, webContents, dialog, Menu, } = require("electron")
const isDev = require("electron-is-dev")
const os = require("os")
const path = require("path");
export default async function createEnv() {
    await ProjectController.initialize()
    await ProjectController.openWindow()
}