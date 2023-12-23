import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: './out',
        emptyOutDir: true
    },
    server: {
        port: 5173,
        strictPort: true
    },
    base: ''
});