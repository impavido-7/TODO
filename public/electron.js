const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

const path = require('path');

const appMenu = require("./electron/menu");

ipcMain.on("task-empty", (e, args) => {
    dialog.showErrorBox("Error", args);
});

// // Handle creating/removing shortcuts on Windows when installing/uninstalling
// if (require("electron-squirrel-startup")) {
//     app.quit();
// } // NEW!

let mainWindow;

const createWindow = () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500,
        height: 650,
        icon: path.join(__dirname, "electron", "icon", "todo.png"),
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "electron", "preload.js") // use a preload script
        },
    });

    // Set the window to not re-size
    mainWindow.setResizable(false);

    // Create main app menu
    appMenu(mainWindow.webContents);

    // and load the index.html of the app.
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});