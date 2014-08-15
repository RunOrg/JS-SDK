runorg.min.js.gz: runorg.min.js
	@gzip $^ -c > $@
	@wc -c $@

runorg.min.js: runorg.js
	@cat $^ | yui-compressor --type js > $@
	@cp $@ www/
	@wc -c $@

runorg.js: open.js util.js request.js \
	api-people.js api-group.js api-auth.js api-key.js api-token.js api-chat.js \
	close.js 

	@cat $^ > $@
	@cp $@ www/
	@wc -c $@

clean: 
	@rm runorg.js runorg.min.js runorg.min.js.gz
