CHROME_TMP_PATH=dist/chrome/phpdbg-ext-tmp.js
CHROME_PATH=dist/chrome/phpdbg-ext.js

tmpsrc:
	mkdir -p dist/chrome/
	rm -rf tmp/
	mkdir -p tmp/
	cp -R src/* tmp/
	find tmp/ -type f -name '*.js' -exec cpp -P -nostdinc -D CHROME {} {}.bak \; -exec mv {}.bak {} \;

cleantmp:
	rm -rf tmp/

chrome:
	make tmpsrc
	browserify tmp/index.js > ${CHROME_TMP_PATH}
# temporary path necessary for uglifyjs
	cat ${CHROME_TMP_PATH} | uglifyjs -mc > ${CHROME_PATH}
	rm -rf ${CHROME_TMP_PATH}
	make cleantmp

chromedebug:
	make tmpsrc
	find tmp/ -type f -name '*.js' -exec cpp -P -nostdinc -D CHROME {} {}.bak \; -exec mv {}.bak {} \;
	browserify -d tmp/index.js > ${CHROME_TMP_PATH}
# No need to minify it in this case, so just mv it
	mv ${CHROME_TMP_PATH} ${CHROME_PATH}
	make cleantmp

test:
	rm -rf tmp/
	mkdir -p tmp/
	cp -R src/* tmp/
	find tmp/ -type f -name '*.js' -exec cpp -P -nostdinc -D CHROME -D TESTING {} {}.bak \; -exec mv {}.bak {} \;
	node_modules/.bin/mocha tests/
	rm -rf tmp/
