runorg.min.js: runorg.js
	cat $^ | yui-compressor --type js > $@

runorg.js: open.js request.js close.js 
	cat $^ > $@

clean: 
	rm runorg.js runorg.min.js
