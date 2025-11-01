.PHONY: all build clean

all: build

TEMP_DIR = build

PYPROJECT = pyproject.toml


BUILD_DIR = modular_server_manager_web_client/
WEB_BUILD_DIR = $(BUILD_DIR)client

PYTHON_PATH = $(shell if [ -d env/bin ]; then echo "env/bin/"; elif [ -d env/Scripts ]; then echo "env/Scripts/"; else echo ""; fi)
PYTHON_LIB = $(shell find env/lib -type d -name "site-packages" | head -n 1; if [ -d env/Lib/site-packages ]; then echo "env/Lib/site-packages/"; fi)
PYTHON = $(PYTHON_PATH)python

EXECUTABLE_EXTENSION = $(shell if [ -d env/bin ]; then echo ""; elif [ -d env/Scripts ]; then echo ".exe"; else echo ""; fi)
APP_EXECUTABLE = $(PYTHON_PATH)modular-server-manager$(EXECUTABLE_EXTENSION)

INSTAL_PATH = $(PYTHON_LIB)/modular_server_manager_web_client

# if not defined, get the version from git
VERSION ?= $(shell $(PYTHON) get_version.py)

# if version is in the form of x.y.z-dev-aaaa or x.y.z-dev+aaaa, set it to x.y.z-dev
VERSION_STR = $(shell echo $(VERSION) | sed "s/-dev-[a-z0-9]*//; s/-dev+.*//")

WHEEL = modular_server_manager_web_client-$(VERSION_STR)-py3-none-any.whl
ARCHIVE = modular_server_manager_web_client-$(VERSION_STR).tar.gz

SRV_SRC_DIR = src/server/
SRV_SRC = $(shell find $(SRV_SRC_DIR) -type f -name "*.py") $(SRV_SRC_DIR)compatibility.json
SRV_DIST = $(patsubst $(SRV_SRC_DIR)%,$(BUILD_DIR)%,$(SRV_SRC))

WEB_SRC_DIR = src/web/
WEB_SRC = $(shell find $(WEB_SRC_DIR) -type f -name "*.html" -o -name "*.scss" -o -name "*.ts")
WEB_DIST = $(WEB_BUILD_DIR)/index.html $(WEB_BUILD_DIR)/assets/css/main.css $(WEB_BUILD_DIR)/assets/app.js


print-%:
	@echo $* = $($*)

dist:
	mkdir -p dist

dist/$(WHEEL): $(SRV_DIST) $(PYPROJECT) $(WEB_DIST) $(PYTHON_LIB)/build dist
	mkdir -p $(TEMP_DIR)
	$(PYTHON) build_package.py --outdir $(TEMP_DIR) --wheel --version $(VERSION_STR)
	mkdir -p dist
	mv $(TEMP_DIR)/*.whl dist/$(WHEEL)
	rm -rf $(TEMP_DIR)
	@echo "Building wheel package complete."

dist/$(ARCHIVE): $(SRV_DIST) $(PYPROJECT) $(WEB_DIST) $(PYTHON_LIB)/build dist
	mkdir -p $(TEMP_DIR)
	$(PYTHON) build_package.py --outdir $(TEMP_DIR) --sdist --version $(VERSION_STR)
	mkdir -p dist
	mv $(TEMP_DIR)/*.tar.gz dist/$(ARCHIVE)
	rm -rf $(TEMP_DIR)
	@echo "Building archive package complete."

$(WEB_DIST): $(WEB_SRC)
	npm run build

$(BUILD_DIR)%: $(SRV_SRC_DIR)%
	@mkdir -p $(@D)
	@echo "Copying $< to $@"
	@cp $< $@


$(INSTAL_PATH) : dist/$(WHEEL)
	@echo "Installing package..."
	@$(PYTHON) -m pip install --upgrade --force-reinstall dist/$(WHEEL)
	@echo "Package installed."


build: dist/$(WHEEL) dist/$(ARCHIVE)

install: $(INSTAL_PATH)

start: install
	@$(APP_EXECUTABLE) \
		-c /var/minecraft/config.json \
		--log-file server.trace.log:TRACE \
		--log-file server.debug.log:DEBUG


clean:
	rm -rf $(BUILD_DIR)
	rm -rf dist
	rm -rf $(PYTHON_LIB)/modular_server_manager_web_client
	rm -rf $(PYTHON_LIB)/modular_server_manager_web_client-*.dist-info
