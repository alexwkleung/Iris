#!/usr/bin/env node

import chokidar from 'chokidar'
import { exec } from 'child_process'
import * as fs from 'fs'

const chokidarPaths = [
    'index.html', 
    'src/is-main.mts',
    'src/main.ts',
    'src/preload/**/*.mts',
    'src/renderer/**/*.ts',
    'src/renderer/**/*.mts'
];

chokidarPaths = [];

const chokidarDev = () => {
    fs.open('.hmr_pid.txt', 'w', (err, fd) => {
        if(err) {
            throw console.error(err);
        }
        
        fs.close(fd, (err) => {
            if(err) {
                throw console.error(err);
            }
        })
    })

    console.log("HMR is active");

    chokidar.watch(chokidarPaths).on('all', (event, path) => {
        if(event === 'change' && path !== null && path !== undefined) {
            console.log("File changed: " + path);

            console.log("Rebuilding files...");

            try {                  
                exec('npm run build').on('exit', () => {
                    fs.readFile('.hmr_pid.txt', { encoding: 'utf-8' }, (err, data) => {
                        if(err) {
                            throw console.error(err);
                        } else {
                            process.kill(data);
                        }
                    })

                    console.log("Restarting Electron process...");
                    exec('npm run electron');
                });
            } catch(e) {
                throw console.error(e);
            }    
        }
    })
}
chokidarDev();