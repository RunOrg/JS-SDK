runorg.min.js: runorg.js
	cat runorg.js | yui-compressor --type js > runorg.min.js

runorg.js: open.js close.js 
	cat open.js close.js > runorg.js

clean: 
	rm runorg.js runorg.min.js