const { Menu } = require('electron');

// Module function to create main app menu
module.exports = mainWindow => {

    // Menu template
    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New Task',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.send('add-new-item')
                    }
                },
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        }
    ]

    // Create Mac app menu
    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' })

    // Build menu
    let menu = Menu.buildFromTemplate(template)

    // Set as main app menu
    Menu.setApplicationMenu(menu)
}
