import FileSystem from "../../../../../libs/FileSystem"

export default class NavigationHistory {

    data = []
    index = -1
    constructor(setCurrentDirectory) {
        this.setCurrentDirectory = setCurrentDirectory
    }

    returnDir() {
        // const subtraction = this.index === this.data.length?
        if (this.index > 0 && this.data[this.index - 1]) {
            this.index -= 1
            this.setCurrentDirectory({
                id: this.data[this.index]
            })
        }
    }

    forwardDir() {
        if (this.index < 10 && this.data[this.index + 1]) {
            this.index += 1
            this.setCurrentDirectory({
                id: this.data[this.index]
            })
        }
    }

    goToParent(currentDirectory) {
        const found = currentDirectory.id
        const split = found.split(FileSystem.sep)
        split.pop()
        if (!split.join(FileSystem.sep))
            this.setCurrentDirectory({id: FileSystem.sep})
        else
            this.setCurrentDirectory({id: split.join(FileSystem.sep)})
    }

    updateCurrentDirectory(v, currentDirectory) {
        const historyData = this.data
        historyData.push(currentDirectory.id)
        if (historyData.length > 10) historyData.shift()
        this.index = historyData.length - 1
        this.setCurrentDirectory(v)
    }
}