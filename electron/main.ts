import { app, BrowserWindow, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'

let win: BrowserWindow

app.on('ready', createWindow)

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  win = new BrowserWindow();
  win.maximize() 

  globalShortcut.register('f5', function() {
    win.reload()
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../../dist/index.html`),
        protocol: 'file:',
        slashes: true,
      })
    )
	})

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}