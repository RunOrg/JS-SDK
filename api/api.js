module.exports.Person = {

    model: {
	fields: [ 
	    'label', 
	    'gender', 
	    'pic', 
	],
	statics: {
	    List: {
		args:   ['limit', 'offset'],
		method: 'GET', 
		url:    '/people',
		query:  { limit: ':limit', offset: ':offset' },
		make:   { '.list': [ 'Person' ] },
	    },
	    Search: {
		args:   ['q', 'limit'],
		method: 'GET',
		url:    '/people/search',
		query:  { limit: ':limit', q: ':q' },
		make:   { '.list': [ 'Person' ] },
	    },
	},
	methods: {
	    Load: {
		method: 'GET',
		url:    '/people/@id',
		make:   '@',
	    },
	},
    },
    
    Profile: {
	model: {
	    fields: [
		'label', 
		'name', 
		'email', 
		'givenName', 
		'familyName', 
	    ],
	    statics: {
	    },
	    methods: {
		Load: {
		    method: 'GET',
		    url:    '/people/@id/info',
		    make:   '@',
		},
	    },
	},
    },
};

module.exports.Group = {
    
    model: {
	fields: [
	    'label',
	    'count',
	    'audience',
	    'access',
	],
	statics: {
	    List: {
		args:   ['limit','offset'],
		method: 'GET',
		url:    '/groups',
		query:  { limit: ':limit', offset: ':offset' },
		make:   { '.list' : [ 'Group' ] },
	    }, 
	},
	methods: {
	    Create: {
		method: 'POST',
		url:    '/groups',
		body:   { id: '@id', label: '@label', audience: '@audience' }, 
		make:   '@', 
	    }, 
	    List: {
		args:   ['limit', 'offset'],
		method: 'GET',
		url:    '/groups/@id',
		query:  { limit: ':limit', offset: ':offset' },
		make:   { '.list' : [ 'Person' ] },
	    },
	    Load: {
		method: 'GET',
		url:    '/groups/@id/info',
		make:   '@',
	    },
	    Delete: {
		method: 'DELETE',
		url:    '/groups/@id',
	    },
	    Add: {
		args:   ['person'],
		method: 'POST',
		url:    '/groups/@id/add',
		body:   [':person'], 
	    },
	    Remove: {
		args:   ['person'], 
		method: 'POST',
		url:    '/groups/@id/remove',
		body:   [':person'], 
	    },
	    AddMany: {
		args:   ['people'],
		method: 'POST',
		url:    '/groups/@id/add',
		body:   ':people', 
	    },
	    RemoveMany: {
		args:   ['people'], 
		method: 'POST',
		url:    '/groups/@id/remove',
		body:   ':people', 
	    },
	},
    },
};

module.exports.Auth = {
    model: {
	fields: [
	],
	statics: {
	    Persona: {
		args:   ['assertion'],
		method: 'POST',
		url:    '/people/auth/persona',
		body:   { assertion: ':assertion' },
		make:   { '.self': 'Person' },
	    },
	    HMAC: {
		args:   [ 'proof' ],
		method: 'POST',
		url:    '/people/auth/hmac',
		body:   ':proof',
		make:   { '.self': 'Person' },
	    },
	},
	methods: {
	},
    },
};

module.exports.Key = {
    model: {
	fields: [
	    'key',
	],
	statics: {
	},
	methods: {
	    Create: {
		method: 'POST',
		url:    '/keys',
		body:   { key: '@key', hash: 'SHA-1', encoding: 'hex' },
		make:   '@',
	    },
	},
    },
};

module.exports.Token = {
    model: {
	fields: [
	],
	statics: {
	    Describe: {
		args:   [ 'token' ],
		method: 'GET',
		url:    '/tokens/:token',
		make:   { '.self': 'Person' },
	    },
	},
	methods: {
	},
    },
};

module.exports.Form = {
    model: {
	fields: [
	    'label',
	    'custom',
	    'owner',
	    'fields',
	    'audience',
	    'access',
	],
	statics: {
	    List: {
		args:   [ 'limit', 'offset' ],
		method: 'GET',
		url:    '/forms',
		query:  { limit: ':limit', offset: ':offset' },
		make:   { '.list': [ 'Form' ] },
	    }
	},
	methods: {
	    Create: {
		method: 'POST',
		url:    '/forms',
		body:   { id: '@id', label: '@label', custom: '@custom', owner: '@owner', 
			  fields: '@fields', audience: '@audience' },
		make:   '@',
	    },	    
	    Load: {
		method: 'GET',
		url:    '/forms/@id',
		make:   '@',
	    },
	    Save: {
		method: 'PUT',
		url:    '/forms/@id',
		body:   { id: '@id', label: '@label', custom: '@custom', owner: '@owner', 
			  fields: '@fields', audience: '@audience' },
	    },
	    Filled: {
		args:   [ 'limit', 'offset' ],
		method: 'GET',
		url:    '/forms/@id/filled',
		query:  { limit: 'limit', offset: ':offset' },
		merge:  { form: '@id' }, 
		make:   { '.list': [ 'Form.Filled' ] }
	    },
	    Stats: {
		method: 'GET',
		url:    '/forms/@id/stats',
	    },
	},
    },
    Filled: {
	model: {
	    fields: [
		'form',
		'owner',
		'data',
	    ],
	    statics: {
	    },
	    methods: {
		Load: {
		    method: 'GET',
		    url:    '/forms/@id/filled/@owner',
		    make:   '@',
		},
		Save: {
		    method: 'PUT',
		    url:    '/forms/@id/filled/@owner',
		    body:   { data: '@data' },
		},
	    },
	},
    },
};

module.exports.Mail = {
    Outgoing: {
	model: {
	    fields: [
		'from',
		'subject',
		'text',
		'html',
		'access',
		'audience',
		'urls',
		'self',
		'custom',
	    ],
	    statics: {
	    },
	    methods: {
		Save: {
		    method: 'POST',
		    url:    '/mail',
		    body:   { from: '@from', subject: '@subject', text: '@text', html: '@html',
			      audience: '@audience', urls: '@urls', self: '@self', custom: '@custom' },
		    make:   '@',
		},
		Send: {
		    args:   [ 'group' ],
		    method: 'POST',
		    url:    '/mail/@id/send',
		    body:   { group: ':group' },
		},
		Load: {
		    method: 'GET',
		    url:    '/mail/@id',
		    make:   '@',
		},
		Stats: {
		    method: 'GET',
		    url:    '/mail/@id/stats',		    
		},
		View: {
		    args:   ['person'],
		    method: 'GET',
		    url:    '/mail/@id/to/:person',		    
		},
	    },
	},
    },
};