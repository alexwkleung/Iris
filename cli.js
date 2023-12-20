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
    'src/renderer/**/*.mts',
    'src/**/*'
];

const chokidarPathsIgnore = [
    'src/**/*.css'
]

const chokidarDev = () => {
    fs.open('.hmr_pid.txt', 'w', (err, fd) => {
        if(!err) {
            fs.close(fd, (err) => {
                if(err) {
                    throw console.error(err);
                }
            })
        } else {
            throw console.error(err);
        }
    })

    console.log("HMR is active");

    chokidar.watch(chokidarPaths, { ignored: chokidarPathsIgnore }).on('all', (event, path) => {
        if(event === 'change' && path !== null && path !== undefined) {
            console.log("File changed: " + path);

            console.log("Rebuilding files...");

            try {                  
                exec('npm run build').on('exit', () => {
                    fs.readFile('.hmr_pid.txt', { encoding: 'utf-8' }, (err, data) => {
                        if(!err) {
                            process.kill(data);
                        } else {
                            throw console.error(err);
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