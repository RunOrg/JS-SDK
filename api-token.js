function Token(init) {
    fill(this,init,[
	'id'
    ]);
}

Token.prototype = Object.create({

    // Describe a token's associated person
    //
    Owner: function() {
	return request("GET",["tokens",this.id]).then(function(data) {
	    return Person.Cache(data.self);
	});
    },

    // Delete the token
    // 
    Delete: function() {
	return request("DELETE",["tokens",this.id]);
    }

});
