module.exports.Person = {

    model: {
	fields: [ 
	    'label', 
	    'gender', 
	    'pic', 
	],
	statics: {
	    Get: {
		args:   ['id'], 
		method: 'GET', 
		url:    '/people/:id', 
		make:   'Person', 
	    },
	},
	methods: {	    
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
		Get: {
		    args:   ['id'], 
		    method: 'GET', 
		    url:    '/people/:id/info', 
		    make:   'Person.Profile',
		},
	    },
	    methods: {
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
	    Get: {
		args:   ['id'],
		method: 'GET',
		url:    '/groups/:id',
		make:   'Group', 
	    },
	},
	methods: {
	    Create: {
		method: 'POST',
		url:    '/groups',
		body:   { id: '@id', label: '@label', audience: '@audience' }, 
		make:   '@', 
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
	}
    }

};