const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 창 테두리 및 기본 메뉴 제거
    alwaysOnTop: true, // 항상 위에 표시
    resizable: true, // 크기 조절 기능

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 필요할 경우 Preload 스크립트 추가
      nodeIntegration: true,
    },
  });

  const startUrl = 'http://localhost:3000/timer/';
  // process.env.NODE_ENV === 'development'
  //   ? 'http://localhost:3000' // Next.js 개발 서버
  //   : `file://${path.join(__dirname, '../out/index.html')}`; // Next.js 정적 빌드 결과

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

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