dev:
	node_modules/babel-cli/bin/babel-node.js --presets es2015 src/bin/www | node_modules/bunyan/bin/bunyan

start:
	npm start

install:
	@echo 'Installing dependencies...' && npm install

build: install
	@echo 'Building API...' && node_modules/gulp/bin/gulp.js build
