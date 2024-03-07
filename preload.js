const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    uploadFile: (filePath) => ipcRenderer.send('upload-file', filePath)
});
