.PHONY: dev
dev:
	npm run dev

.PHONY: test
test:
	npm run test

.PHONY: build-mac-x64
build-mac-x64:
	npm run build:mac-x64

.PHONY: build-mac-arm64
build-mac-arm64:
	npm run build:mac-arm64

.PHONY: build-mac-universal
build-mac-universal:
	npm run build:mac-universal