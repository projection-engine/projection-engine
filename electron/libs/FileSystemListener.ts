import {ipcMain,} from "electron"

import * as pathRequire from "path"
import * as fs from "fs"
import FileTypes from "../../shared/enums/FileTypes"
import IPCRoutes from "../../shared/enums/IPCRoutes"
import AbstractSingleton from "../../shared/AbstractSingleton"
import FileSystemUtil from "./FileSystemUtil"

export default class FileSystemListener extends AbstractSingleton {

	#watchSignals = []
	#filesToWatch = []

	constructor() {
		super()
		ipcMain.on(IPCRoutes.FS_WATCH, this.#watch.bind(this))
		ipcMain.on(IPCRoutes.FS_UPDATE_WATCH, this.#updateWatch.bind(this))
		ipcMain.on(IPCRoutes.FS_UNWATCH, this.#unwatch.bind(this))
		ipcMain.on(IPCRoutes.FS_READ, this.#read.bind(this))
		ipcMain.on(IPCRoutes.FS_WRITE, this.#write.bind(this))
		ipcMain.on(IPCRoutes.FS_RM, this.#rm.bind(this))
		ipcMain.on(IPCRoutes.FS_MKDIR, this.#mkdir.bind(this))
		ipcMain.on(IPCRoutes.FS_STAT, this.#stat.bind(this))
		ipcMain.on(IPCRoutes.FS_EXISTS, this.#exists.bind(this))
		ipcMain.on(IPCRoutes.FS_READDIR, this.#readdir.bind(this))
		ipcMain.on(IPCRoutes.FS_RENAME, this.#rename.bind(this))
	}

	async #watch(ev, path) {
		if (this.#watchSignals.length > 0)
			await this.#unwatch()
		this.#filesToWatch = await FileSystemUtil.directoryStructure(path)
		for (let i = 0; i < this.#filesToWatch.length; i++) {
			const file = this.#filesToWatch[i]
			if (!file.includes(FileTypes.UI_LAYOUT) && !file.includes(FileTypes.COMPONENT))
				continue
			this.#watchSignals.push(fs.watch(file, (event) => {
				if (event === "change")
					ev.sender.send(IPCRoutes.FS_WATCH, file)
			}))
		}
	}

	async #updateWatch(ev, path) {
		this.#filesToWatch = await FileSystemUtil.directoryStructure(path)
	}

	async #unwatch() {
		for (let i = 0; i < this.#watchSignals.length; i++) {
			const signal = this.#watchSignals[i]
			if (signal)
				signal.close()
		}
		this.#watchSignals = []
	}

	async #read(event, data) {
		const {path, options, listenID} = data
		let result
		try {
			result = await fs.promises.readFile(pathRequire.resolve(path), options)
		} catch (err) {
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_READ + listenID, result ? result.toString() : undefined)
	}

	async #write(event, {path, data, listenID}) {
		let error
		try {
			await fs.promises.writeFile(pathRequire.resolve(path), data)
		} catch (err) {
			error = err
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_WRITE + listenID, error)
	}

	async #rm(event, data) {
		const {path, options, listenID} = data
		let error
		try {
			await fs.promises.rm(pathRequire.resolve(path), options)
		} catch (err) {
			error = err
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_RM + listenID, error)
	}

	async #mkdir(event, {path, listenID}) {
		let error
		try {
			await fs.promises.mkdir(pathRequire.resolve(path))
		} catch (err) {
			error = err
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_MKDIR + listenID, error)
	}

	async #stat(event, data) {
		const {path, options, listenID} = data
		const result = await new Promise(resolve => {
			fs.stat(pathRequire.resolve(path), options, (err, res) => resolve(res ? {isDirectory: res.isDirectory(), ...res} : undefined))
		})
		event.sender.send(IPCRoutes.FS_STAT + listenID, result)
	}

	async #exists(event, data) {
		const {
			path, listenID
		} = data
		const result = fs.existsSync(pathRequire.resolve(path))
		event.sender.send(IPCRoutes.FS_EXISTS + listenID, result)
	}

	async #readdir(event, data) {
		const {path, options, listenID} = data
		let response
		try {
			response = await fs.promises.readdir(pathRequire.resolve(path), options)
		} catch (err) {
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_READDIR + listenID, response)
	}

	async #rename(event, data) {
		const {oldPath, newPath, listenID} = data
		let result
		try {
			await fs.promises.rename(pathRequire.resolve(oldPath), pathRequire.resolve(newPath))
		} catch (err) {
			result = err
			console.error(err)
		}
		event.sender.send(IPCRoutes.FS_RENAME + listenID, result)
	}
}


