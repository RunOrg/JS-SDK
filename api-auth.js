var Auth = {

    Persona: function(assertion) {
	return request("POST","people/auth/persona",{},{assertion:assertion}).then(function(data) {
	    return Person.Cache(data.self);
	});
    },

    HMAC: function(params) {
	params = keep(params,['id','expires','key','proof']);
	return request("POST","people/auth/hmac",{},params).then(function(data) {
	    return Person.Cache(data.self);
	});
    }

};
