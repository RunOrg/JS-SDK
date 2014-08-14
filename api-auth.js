var Auth = {

    Persona: function(assertion) {
	return request("POST","people/auth/persona",{},{assertion:assertion}).then(function(data) {
	    return Person.Cache(data.self);
	});
    },

    HMAC: function(proof) {
	return request("POST","people/auth/hmac",{},{proof:proof}).then(function(data) {
	    return Person.Cache(data.self);
	});
    }

};
