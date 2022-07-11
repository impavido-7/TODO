const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

const fs = require('fs');
const path = require('path');

const appMenu = require("./electron/menu");

ipcMain.on("task-empty", (e, args) => {
    dialog.showErrorBox("Error", args);
});

const pathToUserData = app.getPath("userData");

// // Handle creating/removing shortcuts on Windows when installing/uninstalling
// if (require("electron-squirrel-startup")) {
//     app.quit();
// } // NEW!

let mainWindow;

const storePositions = (function () {
    let storedBounds;
    return function (type, bounds = {}) {
        if (type === "set") {
            storedBounds = bounds;
        }
        else {
            const fileLocation = path.join(pathToUserData, "position.json");
            fs.writeFileSync(fileLocation, JSON.stringify(storedBounds))
        }
    }
}());

const createWindow = (bounds) => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        x: bounds.x || 0,
        y: bounds.y || 0,
        width: bounds.width || 500,
        height: bounds.height || 650,
        show: false,
        icon: path.join(__dirname, "electron", "icon", "todo.png"),
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "electron", "preload.js") // use a preload script
        },
    });

    if (!bounds.x) {
        mainWindow.center();
        storePositions("set", mainWindow.getBounds());
    }

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

    mainWindow.webContents.on("did-finish-load", e => {
        mainWindow.show();
    });

    // Move Event
    mainWindow.on("move", function (event) {
        /**
         * event.sender.getBounds() -> x: 132, y: 127, width: 503, height: 652
         */
        storePositions("set", event.sender.getBounds());
    });

    mainWindow.on('closed', () => {
        storePositions("get");
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
    // Creating a position.json file if not present earlier
    const fileLocation = path.join(pathToUserData, "position.json");
    if (!fs.existsSync(fileLocation)) {
        fs.writeFileSync(fileLocation, JSON.stringify({}));
    }
    const bounds = fs.readFileSync(fileLocation, "utf-8");
    createWindow(JSON.parse(bounds));
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