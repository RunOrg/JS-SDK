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
    return function(data) {
	if (isString(data)) {
	    this.id = data;
	} else { 
	    for (var i = 0; i < a.length; ++i) {
		var k = a[i]; 
		if (k in data) this[k] = data[k];
	    }
	}
    }
}

// Adds a static function to a class.
//
// Parameters: 
//   cls: the class
//   name: the name of the function
//   method: the HTTP method used to send data
//   url: an array describing how to build the URL
//   build: the class to instantiate post-request
//   member: truthy if a member function 
//
// Returns: 
//   cls
function addFunction(cls,name,method,url,build,member) {
    (member ? cls.prototype : cls)[name] = function() {
	
	var a = arrayOfArguments(arguments), u = url.slice(0), promise;

	// Construct the contents of the URL
	for (var i = 0; i < u.length; ++i) {
	    
	    if (isString(u[i])) {
		// Arguments that start with '@' are member references
		if (u[i].charAt(0) == '@') 
		    u[i] = this[u[i].substring(1)];
		
	    }

	    // Non-string elements are argument numbers
	    else u[i] = a[u[i]];	    
	}

	return request(method,u,{},{}).then(
	    
	    // Determine what happens to the result 
	    build.length ? construct(grabFromRunOrg(build)) : function(x) { return x; }

	);
	
    };
    return cls;
}
