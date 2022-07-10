const { contextBridge, ipcRenderer } = require("electron");

// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'task-empty' // Channel name
        ],
        // From main to render.
        'receive': [
            'add-new-item'
        ],
        // From render to main and back again.
        'sendReceive': []
    }
};

contextBridge.exposeInMainWorld("electronApi", {
    send: (channel, args = null) => {
        if (ipc.render.send.indexOf(channel) > -1)
            ipcRenderer.send(channel, args)
    },
    receive: (channel, func) => {
        if (ipc.render.receive.indexOf(channel) > -1) {
            ipcRenderer.on(channel, (event, args) => func(args))
        }
    }
});