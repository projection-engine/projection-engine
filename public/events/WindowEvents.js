const {BrowserWindow, ipcMain} = require('electron')

const closeEventHome = 'home-close',
    minimizeEventHome = 'home-minimize',
    maximizeEventHome = 'home-maximize'
const closeEvent = 'project-close',
    minimizeEvent = 'project-minimize',
    maximizeEvent = 'project-maximize'

export default function WindowEvents() {
    let project = null,
        mainWindow,
        currentListeners = {
            close: undefined,
            minimize: undefined,
            maximize: undefined,
        }

    prepareHomeWindow()
    initEvents(mainWindow, maximizeEventHome, minimizeEventHome, closeEventHome)
    ipcMain.on('switch-window', onSwitchCall)
    ipcMain.on('load-page', getDataCall)


    function prepareHomeWindow() {
        if (mainWindow) {
            removeEvents()
            mainWindow.close()
        }
        project = null
        const newWindow = new BrowserWindow({
            width: 800,
            height: 650,
            frame: false,
            webPreferences: {
                webSecurity: false,
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
                nodeIntegrationInWorker: true,
            },
            autoHideMenuBar: true
        });
        mainWindow = newWindow
        newWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        console.log('OPENING')
        return {
            newWindow,
            closeEvent: closeEventHome,
            minimizeEvent: minimizeEventHome,
            maximizeEvent: maximizeEventHome
        }
    }




    function initEvents(window, mE, minE, closeE) {
        currentListeners.minimize = ipcMain.on(minE, () => window.minimize())
        currentListeners.maximize = ipcMain.on(mE, () => {
            if (window.isMaximized())
                window.setSize(800, 650)
            else
                window.maximize()
        })
        currentListeners.close = ipcMain.on(closeE, () => window.close())
    }

    function removeEvents() {
        if (project) {
            currentListeners.minimize?.removeAllListeners(maximizeEvent)
            currentListeners.maximize?.removeAllListeners(minimizeEvent)
            currentListeners.close?.removeAllListeners(closeEvent)
        } else {
            currentListeners.minimize?.removeAllListeners(maximizeEventHome)
            currentListeners.maximize?.removeAllListeners(minimizeEventHome)
            currentListeners.close?.removeAllListeners(closeEventHome)
        }
    }

    function getDataCall(ev) {
        ev.sender.send('page-load-props', project)
    }

    function prepareProjectWindow(data) {
        removeEvents()
        mainWindow.close()
        const newWindow = new BrowserWindow({
            show: false,
            frame: false,
            webPreferences: {
                webSecurity: false,
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
                nodeIntegrationInWorker: true,
            },
            autoHideMenuBar: true
        });
        mainWindow = newWindow
        newWindow.maximize();
        newWindow.show();

        newWindow.loadURL(PROJECT_WINDOW_WEBPACK_ENTRY);
        project = {
            package: data,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        }
        return {
            newWindow,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        }
    }


    function onSwitchCall(_, d) {
        const {
            newWindow,
            closeEvent,
            minimizeEvent,
            maximizeEvent
        } = project ? prepareHomeWindow() : prepareProjectWindow(d.data)

        initEvents(newWindow, maximizeEvent, minimizeEvent, closeEvent)
    }
}