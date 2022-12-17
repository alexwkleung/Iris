# it is preferred to execute build/dev steps using make
#
# for now, most of the target commands are wrappers around npm run scripts
# 
# later on, this makefile will contain all the necessary executed commands for each
# target without wrapping over npm run scripts (like an alias)
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
