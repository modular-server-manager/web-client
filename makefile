

build:
	python ./build_package.py --outdir dist --version "0.1.0"

install:
	pip install --upgrade --force-reinstall ./dist/modular_server_manager_web_client-0.1.0-py3-none-any.whl

start:
	./env/bin/modular-server-manager \
	-c /var/minecraft/config.json \
	--log-file server.trace.log:TRACE \
	--log-file server.debug.log:DEBUG