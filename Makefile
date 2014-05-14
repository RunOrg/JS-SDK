runorg.min.js: runorg.js
	cat $^ | yui-compressor --type js > $@
	wc -c runorg.min.js
	gzip runorg.min.js -c | wc -c 

runorg.js: open.js request.js api.js compile.js close.js 
	cat $^ > $@
	wc -c runorg.js

api.js: api/compile.js api/api.js
	(cd api ; nodejs compile.js) > $@

clean: 
	rm runorg.js runorg.min.js
