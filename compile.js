// Compile the compressed API representation into actual JavaScript classes

// Creates a new class. 
//
// Parameters:
//   (variadic): the expected fields of the class 
//
// Returns: 
//   The class (as a function)
function newClass() {
    var a = arrayOfArguments(arguments);
    a.push('id');
    function RunOrgModel(data) {
	if (isString(data)) {
	    this.id = data;
	} else { 
	    for (var i = 0; i < a.length; ++i) {
		var k = a[i]; 
		if (k in data) this[k] = data[k];
	    }
	}
    }
    RunOrgModel.prototype._isRunOrgModel = true;
    return RunOrgModel;
}

// Adds a static function to a class.
//
// Parameters: 
//   cls: the class
//   name: the name of the function
//   method: the HTTP method used to send data
//   url: an array describing how to build the URL
//   merge: construct an object to merged into the result
//   build: the class to instantiate post-request
//   member: truthy if a member function 
//
// Returns: 
//   cls
function addFunction(cls,name,method,url,query,body,merge,build,member) {
    (member ? cls.prototype : cls)[name] = function() {
	
	var a = arrayOfArguments(arguments), promise, self = this;

	function compose(arg) {
	    var out, k, temp, t = typeof arg;

	    // Null values are ignored
	    if (arg === null) return null;

	    // Arrays are traversed and composed recursively
	    if (arg instanceof Array) {
		out = [];
		for (k = 0 ; k < arg.length; ++k) 
		    out.push(compose(arg[k]));		
		return out;
	    }

	    // Objects are traversed and composed recursively
	    if (t == 'object') {

		// Only keep 'id' for model objects
		// Note that 'this' never goes through this line
		if ('_isRunOrgModel' in arg) return arg.id;

		out = {};
		for (k in arg) {
		    temp = compose(arg[k]);
		    if (temp !== null) out[k] = temp;
		}		    
		return out;

	    }

	    // Functions are called on (self,this)
	    if (t == "function") {
		return arg(self,a);
	    }

	    // Anything else is kept as-is
	    return arg;
	}

	return request(method,compose(url),compose(query)||{},compose(body)).then(function(data) {
	    var merged = merge ? merge(self) : {};
	    for (var k in merged) if (!k in data) data[k] = merged[k];
	    return build(data,self);
	});	
    };

    return cls;
}

// A function that extracts the member from 'this'
//
// Parameters: 
//   member: the name of the member
//
// Returns: 
//   a function which returns this[member] or null if not set
function getMember(member) {
    return function(self) { return self[member] || null; };
}

// A function that extracts the requested argument
//
// Parameters: 
//   nth: the position of the argument
//
// Returns: 
//   a function which returns args[nth]
function getArgument(nth) {
    return function(self,args) { return args[nth] || null; };
}

// Assign to a new instance of a class
function assignToNew() {
    var a = arrayOfArguments(arguments);
    return function(data,self) { return new (grabFromRunOrg(a))(data); };
}

// Assign data to the 'self' object
function assignToThis(data,self) {
    for (var k in data) self[k] = data[k];
    return self;
}

// Apply inner function to a member of the data
function fromDataMember(member,func) {
    return function(data,self) { return func(data[member],self); };
}

// Construct a dictionary from the result
function assignToDictionary() {
    var a = arguments;
    return function(data,self) {	
	for (var out = {}, i = 0; i < a.length; i+=2) out[a[i]] = a[i+1](data,self);
	return out;
    }
}

// Parse a list using a function
function fromEach(func) {
    return function(data,self) {
	for (var out = [], i = 0; i < data.length; ++i) out.push(func(data[i],self));
	return out;
    }
}