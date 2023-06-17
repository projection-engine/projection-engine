const pathRequire = window.require("path")
const {ipcRenderer} = window.require("electron")
const fs = window.require("fs")
const os = window.require("os")
const {shell, clipboard} = window.require("electron")

export default class ElectronResources {
	static path = pathRequire
	static ipcRenderer = ipcRenderer
	static fs = fs
	static os = os
	static shell = shell
	static clipboard = clipboard
}