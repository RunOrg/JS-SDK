var api = require('./api.js')

// Generated code is appended here, and will be post-compiled later. 
// Individual cells are: 
//  - strings
//  - { m: key } for member access to be collapsed later
//  - { s: key } for string literals to be collapsed later
var generated = [];

recurse(api,'');
compressGenerated();

console.log(generated.join(''));

// Recurse through the API tree, compiling everything
function recurse(tree,path) 
{
    for (var key in tree) 
    {
	if (key == 'model') 
	{
	    compile(tree[key], path);
	    continue;
	}

	recurse(tree[key], path == '' ? key : path + '.' + key)
    }
}

// Compile a specific model
function compile(model,path) 
{
    model.fields.push('id');

    // ex: RunOrg.Person.Profile = ...
    generated.push('RunOrg');
    path.split('.').forEach(member);
    generated.push('=');

    var content = newClass;

    for (var k in model.statics) 
    {
	var s = model.statics[k];
	content = addFunction(k, s, false, content);
    }

    for (var k in model.methods) 
    {
	var s = model.methods[k];
	content = addFunction(k, s, true, content);
    }

    content();
    generated.push(';\n');

    // ex: addFunction(...,'Get','GET',['person',0],query,body,['Person'],m)
    function addFunction(name,data,member,then) 
    {
	var method = data.method;
	var url    = data.url;
	var make   = data.make || null;
	var body   = data.body || {};
	var query  = data.query || null;
	var args   = data.args || [];

	return function() 
	{
	    generated.push('addFunction(');

	    then(); comma();

	    string(name); comma();
	    
	    string(method); comma();
	    
	    array(url.split('/').filter(function(s) { return s != ''; }),argument); comma();

	    if (query) argument(query);
	    else generated.push('0');

	    comma();
	    
	    if (body) argument(body); 	    
	    else generated.push('0');

	    comma(); 

	    output(make);
 
	    if (member) generated.push(',1');

	    generated.push(')');
	}

	// Format an argument constructor
	function argument(arg) 
	{
	    if (arg instanceof Array) 
	    {
		array(arg,argument);
		return;
	    }

	    if (typeof arg === 'object')
	    {
		var out = {};
		var first = true;
		
		generated.push('dictionary(');

		for (var k in arg) 
		{
		    if (first) first = false;
		    else comma();
		    
		    string(k);
		    comma();
		    argument(arg[k]);
		}

		generated.push(')');

		return;
	    }

	    if (arg.charAt(0) === ':') 
	    {
		var key = arg.substring(1);
		
		for (var i = 0; i < args.length; ++i) 
		    if (args[i] === key) 
			return generated.push('getArgument(',i,')');

		throw ("Unknown argument " + arg + " in " + path + "." + name)
	    }

	    if (arg.charAt(0) === '@') 
	    {
		var key = arg.substring(1);

		if (key === '') 
		{
		    generated.push('identity');
		    return;
		}

		for (var i = 0; i < model.fields.length; ++i) 
		{
		    if (model.fields[i] === key) 
		    {	
			generated.push('getMember(');
			string(key);
			generated.push(')');
			return;
		    }
		}

		throw ("Unknown field " + arg + " in " + path + "." + name)
	    }

	    return string(arg);	    
	}

	// Format an output constructor
	function output(make) 
	{
	    if (make === null) return generated.push('identity');
	    if (make === '@') return generated.push('assignToThis');		
	    
	    if (typeof make === 'string') 
	    {
		generated.push('assignToNew(');
		implode(make.split('.'),',',string);
		generated.push(')');
		return;
	    }
	}
    }

    // ex: newClass('label','gender','pic')
    function newClass() 
    {
	generated.push('newClass(');
	implode(model.fields.filter(function (k) { return k != 'id'; }), ',', string);
	generated.push(')');
    }
}

// Code generation helpers

function comma() { generated.push(','); }

function member(key) { generated.push({m:key}); }
function string(key) { generated.push({s:key}); }

function implode(array,sep,f) 
{ 
    var first = true;
    array.forEach(function(element) {
	if (first) first = false;
	else generated.push(sep);
	f(element);
    });
}

function array(array,f) 
{
    generated.push('[');
    implode(array,',',f);
    generated.push(']');
}

// Compressing the generated code
function compressGenerated()
{
    // Count the occurrences of each string
    var occurrences = {};
    generated.forEach(function(x) {
	if (typeof x !== 'object') return;
	if ('m' in x) occurrences[x.m] = 1 + (occurrences[x.m] || 0);
	if ('s' in x) occurrences[x.s] = 1 + (occurrences[x.s] || 0);
    });

    var next = 0;
    var hashes = {};
    
    function replace(string) {	
	if (string.length < 2 || occurrences[string] < 2) return null;
	if (string in hashes) return hashes[string];
	return hashes[string] = 'string' + (next++);
    }

    for (var i = 0; i < generated.length; ++i) 
    {
	var x = generated[i];
	if (typeof x !== 'object') continue;
	if ('m' in x) 
	{
	    var y = replace(x.m);
	    if (y == null) generated[i] = '.' + x.m;
	    else generated[i] = '[' + y + ']';
	}
	if ('s' in x)
	{
	    var y = replace(x.s);
	    if (y == null) generated[i] = '"' + x.s + '"';
	    else generated[i] = y;
	}
    }

    if (next > 0) 
    {
	var init = ['var '];
	var first = true;
	for (var k in hashes) 
	{
	    if (first) first = false;
	    else init.push(',');
	    init.push(hashes[k],'="',k,'"');
	}
	init.push(';\n');
	generated.unshift(init.join(''));
    }
}