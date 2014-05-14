module.exports.Person = {

    model: {
	fields: [ 
	    'label', 
	    'gender', 
	    'pic' 
	],
	statics: {
	    Get: [ ['id'], [ 'GET', '/people/:id' ], 'Person' ]
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
		Get: [ ['id'], [ 'GET', '/people/:id/info' ], 'Person.Profile' ]
	    },
	    methods: {
	    }
	}
    }
};