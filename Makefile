runorg.min.js.gz: runorg.min.js
	@gzip $^ -c > $@
	@wc -c $@

runorg.min.js: runorg.js
	@cat $^ | yui-compressor --type js > $@
	@wc -c $@

runorg.js: open.js request.js api.js compile.js close.js 
	@cat $^ > $@
	@wc -c $@

api.js: api/compile.js api/api.js
	@(cd api ; nodejs compile.js) > $@

clean: 
	@rm runorg.js runorg.min.js api.js runorg.min.js.gz
