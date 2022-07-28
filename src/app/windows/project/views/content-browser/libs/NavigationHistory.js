export default class NavigationHistory {
    history = {
        data: [],
        index: -1
    }

    constructor(setCurrentDirectory) {
        this.setCurrentDirectory = setCurrentDirectory
    }

    returnDir() {
        if (this.history.current.index > 0 && this.history.current.data[this.history.current.index - 1]) {
            this.history.current.index -= 1
            this.setCurrentDirectory({
                id: this.history.current.data[this.history.current.index]
            })
        }
    }

    forwardDir() {
        if (this.history.current.index < 10 && this.history.current.data[this.history.current.index + 1]) {
            this.history.current.index += 1
            this.setCurrentDirectory({
                id: this.history.current.data[this.history.current.index]
            })
        }
    }

    goToParent(currentDirectory) {
        const found = currentDirectory.id
        const split = found.split(FileSystem.sep)
        split.pop()
        if (split.length > 1)
            this.setCurrentDirectory({id: FileSystem.sep})
        else
            this.setCurrentDirectory({id: split.join(FileSystem.sep)})

    }
}