function Key(init) {
    fill(this,init,[
	'id',
	'key'
    ]);
}

Key.prototype = Object.create({

    // Create a key on the server
    //
    Create: function() {
	var self = this;
	return request("POST","keys",{},{ 
	    key: this.key,
	    hash: 'SHA-1',
	    encoding: 'hex'
	}).then(function(data) {
	    Key.call(self,data);
	    return self;
	});
    }

});
