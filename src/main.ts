import { app, shell, BrowserWindow, protocol, net, ipcMain, dialog } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import contextMenu from "electron-context-menu";
//import icon from '../../resources/icon.png?asset'
import { isMacOS, isWindows, isLinux, isDev, isProd } from "./is-main.mjs";
import windowStateKeeper from "electron-window-state";
import * as fs from "fs";
import { homedir } from "os";
import * as path from "path";

//DON'T REMOVE IF YOU WANT HMR IN DEV
function hmr(): void {
    //write Electron PID to .hmr_pid.txt
    fs.writeFile(".hmr_pid.txt", String(process.pid), (err) => {
        if (err) {
            console.error(err);

            throw new Error("Unable to write current Electron PID to .hmr_pid.txt");
        }
    });
}

namespace MainProcess {
    class AppWindow {
        /**
         * Browser window
         *
         * @private
         */
        private mainWindow: BrowserWindow = {} as BrowserWindow;

        /**
         * Window state
         *
         * @private
         */
        private windowState: windowStateKeeper.State = {} as windowStateKeeper.State;

        /**
         * App instance
         *
         * @private
         */
        private appInstance(): void {
            //prevent multiple instances of Iris running
            if (!app.requestSingleInstanceLock()) {
                console.log("Another instance of Iris is running. Exiting.");

                dialog.showErrorBox("Iris", "Another instance of Iris is running. Closing current instance.");

                app.quit();
                process.exit(0);
            }
        }

        /**
         * ipcMain handlers
         *
         * @private
         */
        private ipcMainHandlers(): void {
            ipcMain.handle("error-dialog", (_: Electron.IpcMainInvokeEvent, title: string, content: string) => {
                dialog.showErrorBox(title, content);
            });

            ipcMain.handle("show-message-box", (_: Electron.IpcMainInvokeEvent, message: string) => {
                dialog.showMessageBox(this.mainWindow, {
                    message: message,
                });
            });
        }

        /**
         * Electron protocol handlers
         *
         * Call after app is ready
         *
         * @private
         */
        private handleProtocols(): void {
            //local protocol
            protocol.handle("local", (request): Promise<Response> => {
                const defaultPath = path.join(homedir(), "/Iris/Images") + request.url.slice("local://".length);

                console.log("file://" + defaultPath);

                return net.fetch("file://" + defaultPath).catch((e) => {
                    console.error(e);

                    throw new Error("Unable to register protocol handler (local://)");
                }) as Promise<Response>;
            });
        }

        /**
         * Call this after registering `windowState` listener
         *
         * @internal
         * @private
         */
        private browserWindowDetails(): void {
            console.log("Current window dimensions: " + this.windowState.width + "x" + this.windowState.height);
            console.log("Current window coordinates: " + "(" + this.windowState.x + ", " + this.windowState.y + ")");
        }

        /**
         * Initialize main window
         *
         * @private
         */
        private initializeMainWindow(): void {
            //esm version of __dirname
            const _dirname: string = dirname(fileURLToPath(import.meta.url));

            this.windowState = windowStateKeeper({
                defaultWidth: 1200,
                defaultHeight: 900,
            });

            console.log(join(_dirname, "preload", "preload.mjs"));

            this.mainWindow = new BrowserWindow({
                width: this.windowState.width,
                height: this.windowState.height,
                x: this.windowState.x,
                y: this.windowState.y,
                minWidth: 800,
                minHeight: 600,
                show: false,
                autoHideMenuBar: true,
                titleBarStyle: isMacOS() ? "hiddenInset" : "default", //only check macOS
                webPreferences: {
                    preload: join(_dirname, "preload", "preload.mjs"),
                    contextIsolation: true,
                    sandbox: false,
                    webviewTag: false,
                    spellcheck: false,
                },
            });

            //register windowState listener
            this.windowState.manage(this.mainWindow);

            //set min window size
            this.mainWindow.setMinimumSize(800, 600);

            //temporary, remove later
            contextMenu();

            //@ts-expect-error type error
            this.mainWindow.webContents.on("will-navigate", (e: Event, url: string) => {
                e.preventDefault();
                shell.openExternal(url);
            });

            this.mainWindow.webContents.setWindowOpenHandler((details) => {
                shell.openExternal(details.url);
                return {
                    action: "deny",
                };
            });

            //check dev
            if (isDev()) {
                //log browser window details
                this.browserWindowDetails();

                //load dev server url in main window
                this.mainWindow.loadURL("http://localhost:5173/");

                //open dev tools undocked by default
                this.mainWindow.webContents.openDevTools({
                    mode: "undocked",
                });

                //platform check
                if (isMacOS()) {
                    console.log("Platform is darwin (macOS)");
                } else if (isLinux()) {
                    console.log("Platform is Linux");
                } else if (isWindows()) {
                    console.log("Platform is Windows");
                }
                //check prod
            } else if (isProd()) {
                this.mainWindow.loadFile(join(_dirname, "index.html"));
            }

            this.mainWindow.on("ready-to-show", () => {
                this.mainWindow.show();
            });
        }

        /**
         * Initialize Electron app
         *
         * @private
         */
        private initializeElectronApp(): void {
            app.whenReady().then(() => {
                //initialize main window
                this.initializeMainWindow();

                app.on("activate", () => {
                    if (BrowserWindow.getAllWindows().length === 0) {
                        this.initializeMainWindow();
                    }
                });

                //handle protocols
                this.handleProtocols();
            });

            app.on("window-all-closed", () => {
                if ((isLinux() || isWindows()) && !isMacOS()) {
                    app.quit();
                }
            });
        }

        /**
         * Build main window
         *
         * @public
         */
        public buildMainWindow(): void {
            //invoke hmr in dev
            if (isDev()) {
                hmr();
            }

            this.appInstance();
            this.ipcMainHandlers();
            this.initializeElectronApp();
        }
    }

    //AppWindow object
    export const ElectronWindow: AppWindow = new AppWindow();
}

//build window
MainProcess.ElectronWindow.buildMainWindow();
