// Utility functions

// Turn an array into argumens
function arrayOfArguments(a) {
    return Array.prototype.slice(a,0);
}

// Grab a class member of the 'RunOrg' object
function grabFromRunOrg(path) {
    for (var i = 0, r = RunOrg; i < path.length; ++i) {
	r = RunOrg[path[i]];
    }
    return r;
}

// Turn a class into a 'new' call to that class
function construct(cls) {
    return function(arg) {
	return new cls(arg);
    }
}

// Is a value a string?
function isString(x) { return typeof x === 'string'; }

// Create a dictionary from the argument pairs. 
function dictionary() {
    var a = arrayOfArguments(arguments), out = {};
    for (var i = 0; i < a.length; i += 2) out[a[i]] = a[i+1];
    return out;
}

// Identity function
function identity(x) { return x; }