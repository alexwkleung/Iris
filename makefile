# it is preferred to execute build/dev steps using make
#
# for now, most of the target commands are wrappers around npm run scripts
# 
# later on, this makefile will contain all the necessary executed commands for each
# target without wrapping over npm run scripts
#


# build
.PHONY: build
build:
	npm run build

# tauri
.PHONY: tauri
tauri:
	npm run tauri-dev
