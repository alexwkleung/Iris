# makefile that contains all necessary development scripts
# 
# this should reflect the package.json scripts
#


# build
.PHONY: build
build:
	npx vite build && npx tsc --build --clean && npx tsc --build && npm run tauri build -- --target universal-apple-darwin

# build debug
build-debug:
	npx vite build && npx tsc --build --clean && npx tsc --build && npm run tauri build -- --target universal-apple-darwin --debug

# tauri dev
.PHONY: tauri
tauri:
	npm run tauri-dev

# vite dev 
.PHONY: dev
dev: 
	npx vite dev --host

# vite preview
.PHONY: preview
preview: 
	npx vite preview