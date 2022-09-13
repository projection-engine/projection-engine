const {app, BrowserWindow} = require('electron');
const FSEvents = require("./libs/file-system");
const HomeWindow = require("./controllers/HomeWindowController");

app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

function createEnvironment(){
    FSEvents()
    HomeWindow()
}
app.on('ready', () => createEnvironment());
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();

});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createEnvironment()
});
