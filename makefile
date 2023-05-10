# build
.PHONY: build
build:
	npm run build && npm run tauri build -- --target universal-apple-darwin

# build debug
build-debug:
	npm run build && npm run tauri build -- --target universal-apple-darwin --debug

# tauri dev
.PHONY: tauri
tauri:
	npm run tauri-dev

# vite dev 
.PHONY: dev
dev: 
	npm run dev
