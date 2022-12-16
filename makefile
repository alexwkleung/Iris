#
# it is preferred to execute build/dev steps using make
#


# build
.PHONY: build
build:
	npm run build

# tauri
.PHONY: tauri
tauri:
	npm run tauri-dev

# tauri recompile
.PHONY: tauri-recompile
tauri-recompile:
	rm -r -f src-tauri/target/debug && npm run build && npm run tauri-dev
