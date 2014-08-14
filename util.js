// Utility functions

// Fill an object with data from the specified list
//
function fill(obj,data,fields) {

    if (typeof data == "string") data = { id : data };
    data = data || {};
    
    fields.forEach(function(field) {
	obj[field] = data[field] || null;
    });

}

// Keep only the specified fields from the source object
//
function keep(data,fields) {
    var out = {};
    fill(out,data,fields);
    return out;
}

// A constant, successful promise
//
function promise(data) {
    var r = $.Deferred();
    r.resolve(data);
    return r;
}

// Returns the value or its .id (if set)
//
function id(o) {
    if (typeof o == 'object' && o !== null && 'id' in o)
	return o.id;
    return o;
}