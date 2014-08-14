function Person(init) {
    fill(this,init,[
	'id',
	'label',
	'gender',
	'pic'
    ]);    
}

Person.prototype = Object.create({

    // Loading a person's data
    // 
    Load: function() {
	var self = this;
	return request("GET", ["people",this.id]).then(function(data) {
	    Person.call(self,data);
	    return Person.Cache(self);
	});
    }

});

// Searching for people by name
// 
Person.Search = function(q, params) {
    params = params || {};
    params.q = q;
    return request("GET", "people/search", keep(params,[ "q", "limit" ])).then(function(data) {
	return data.list.map(Person.Cache);
    });
};

// Listing all people in the database
// 
Person.List = function(params) {
    params = params || {};
    return request("GET", "people", keep(params,[ "limit", "offset" ])).then(function(data) {
	return data.list.map(Person.Cache);
    });
};

// Caching people by their identifier
// 
Person.Cache = function(init) {
    var p = new Person(init);
    person_cache[p.id] = p;
    return p;
};

var person_cache = {};

// Try loading a person from cache
// 
Person.Get = function(id) {
    if (id in person_cache) 
	return promised(person_cache[id]);
    return new Person(id).Load();
};