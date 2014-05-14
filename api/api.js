module.exports.Person = {

    model: {
	fields: [ 
	    'label', 
	    'gender', 
	    'pic', 
	],
	statics: {
	},
	methods: {
	    Load: {
		method: 'GET',
		url:    '/people/@id',
		make:   '@',
	    },
	}
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
	    }
	}
    }
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
		make:   { '.list' : [ 'Person' ] } 
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
	}
    }

};