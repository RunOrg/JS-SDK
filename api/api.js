module.exports.Person = {

    model: {
	fields: [ 
	    'label', 
	    'gender', 
	    'pic' 
	],
	statics: {
	    Get: [ ['id'], [ 'GET', '/people/:id' ], 'Person' ],
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
		'familyName' 
	    ],
	    statics: {
		Get: [ ['id'], [ 'GET', '/people/:id/info' ], 'Person.Profile' ],
	    },
	    methods: {
	    }
	}
    }
};

module.exports.Group = {
    
    model: {
	fields: [
	    'id',
	    'label'
	],
	statics: {
	    Get: [ ['id'], [ 'GET', '/groups/:id' ], 'Group' ],
	},
	methods: {
	    Create: [ [], [ 'POST', '/groups', { id: '@id?', label: '@label?' } ], 'this' ],		      
	}
    }

};