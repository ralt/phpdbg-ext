CHROME_TMP_PATH=dist/chrome/phpdbg-ext-tmp.js
CHROME_PATH=dist/chrome/phpdbg-ext.js

chrome:
	mkdir -p dist/chrome/
	rm -rf tmp/
	mkdir -p tmp/
	cp -R src/* tmp/
	find tmp/ -type f -name '*.js' -exec cpp -P -nostdinc -D CHROME {} {}.bak \; -exec mv {}.bak {} \;
	browserify tmp/index.js > ${CHROME_TMP_PATH}
# temporary path necessary for uglifyjs
	cat ${CHROME_TMP_PATH} | uglifyjs -mc > ${CHROME_PATH}
	rm -rf ${CHROME_TMP_PATH} tmp/

chromedebug:
	mkdir -p dist/chrome/
	rm -rf tmp/
	mkdir -p tmp/
	cp -R src/* tmp/
	find tmp/ -type f -name '*.js' -exec cpp -P -nostdinc -D CHROME {} {}.bak \; -exec mv {}.bak {} \;
	browserify -d tmp/index.js > ${CHROME_TMP_PATH}
# No need to minify it in this case, so just mv it
	mv ${CHROME_TMP_PATH} ${CHROME_PATH}
	rm -rf tmp/
