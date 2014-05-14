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
    // ex: RunOrg.Person.Profile = ...
    generated.push('RunOrg');
    path.split('.').forEach(member);
    generated.push('=');

    var content = newClass;

    for (var k in model.statics) 
    {
	var s = model.statics[k];
	content = addFunction(k, s[0], s[1][0], s[1][1], s[2], false, content);
    }

    for (var k in model.methods) 
    {
	var s = model.methods[k];
	content = addFunction(k, s[0], s[1][0], s[1][1], s[2], true, content);
    }


    content();
    generated.push(';\n');

    // ex: addFunction(...,'Get','GET',['person',0],['Person'],m)
    function addFunction(name,args,method,url,make,member,then) 
    {
	return function() 
	{
	    generated.push('addFunction(');

	    then(); comma();

	    string(name); comma();
	    
	    string(method); comma();
	    
	    array(url.split('/').filter(function(s) { return s != ''; }),argument); comma();

	    array(make.split('.'),string);

	    if (member) generated.push(',1');

	    generated.push(')');
	}

	function argument(arg) 
	{
	    if (arg.charAt(0) === ':') 
	    {
		var key = arg.substring(1);
		
		for (var i = 0; i < args.length; ++i) 
		    if (args[i] === key) 
			return generated.push(i);

		throw ("Unknown argument " + arg + " in " + path + "." + name)
	    }

	    if (arg.charAt(0) === '@') 
	    {
		var key = arg.substring(1);
		
		for (var i = 0; i < model.fields.length; ++i) 
		    if (model.fields[i] === key) 
			return string(arg);

		throw ("Unknown field " + arg + " in " + path + "." + name)
	    }

	    return string(arg);	    
	}
    }

    // ex: newClass('label','gender','pic')
    function newClass() 
    {
	generated.push('newClass(');
	implode(model.fields, ',', string);
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
	if (string.length < 3 || occurrences[string] < 2) return null;
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