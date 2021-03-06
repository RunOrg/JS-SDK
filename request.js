function now() { return +new Date(); }

// The last token returned by an authentication method
// --> RunOrg.token 

// The 'as' that corresponds to the token (if it is not null).
// --> RunOrg.as

// The clock returned by the last clock-based request
// --> RunOrg.clock 

// The time when the clock expires. Only used if 'clock' 
// is not null.
var clock_expiration;

// Perform a request. 
//
// Parameters: 
//   method: one of 'POST', 'GET', 'DELETE' or 'PUT'
//   url: an array that will be joined into the final url
//   query: a key-value dictionary of parameters to be appended to the URL
//   payload: JSON data to be sent (if 'POST' or 'PUT')
//
// Result: 
//   resolve [ status, data ] on success (200, 202, 403, 404) 
//   reject { HTTP: status } on other status
//   reject { error: status } if other failure

function request(method, url, query, payload)
{    
        // The current query string separator
    var sep = '?';

        // The returned result
    var result = $.Deferred();

    // Key for traversing the query string
    var key;

    // The ajax configuration.
    var ajax;

    query = query || {};

    if (RunOrg.clock && clock_expiration < now()) RunOrg.clock = null;
    if (typeof url == 'string') url = [url];

    // Construct the url by appending any necessary parameters

    url = RunOrg.endpoint + '/db/' + RunOrg.db + '/' + url.join('/');

    RunOrg.clock && (query.at = RunOrg.clock);
    RunOrg.token && (query.as = RunOrg.as);

    for (key in query) {
	if (query[key] === null) continue;
	url += sep + key + '=' + query[key]; 
	sep = '&';
    }

    // Construct the AJAX config that will be used for the call

    ajax = {
	
	url: url,
	dataType: 'json',
	type: method,

	beforeSend: function(xhr) {
	    RunOrg.token && xhr.setRequestHeader('Authorization','RUNORG token=' + RunOrg.token);
	}
    };

    // If the request has payload ('POST' and 'PUT', not 'GET' and 'DELETE'), add it

    if (method > 'P') {
	ajax.data = JSON.stringify(payload);
	ajax.contentType = 'application/json';
    }

    // Perform the request and parse the result. 

    $.ajax(ajax).always(function(a,status,b) {
	var xhr = ('responseJSON' in a) ? a : b, success = status == 'success';
	if (success && xhr.status < 500) {

	    var data = xhr.responseJSON;

	    // Is there a new clock value returned ? 
	    if ('at' in data) {

	    	var c = RunOrg.clock ? JSON.parse(RunOrg.clock) : {}, at = data.at;
		
		// Merge the new clock value with the old one
		for (k in at) 
		    if (!(k in c) || c[k] < at[k])
			c[k] = at[k];
		
		RunOrg.clock = JSON.stringify(c);
		clock_expiration = now() + 60000; // <- Assume that it expires after 1 minute
	    }

	    // Is there an authentication value returned ? 
	    if ('token' in data && 'self' in data) {
		RunOrg.token = data.token;
		RunOrg.as    = data.self.id;
	    } 

	    result.resolve(data);
	}
	else
	    result.reject(success ? {HTTP:xhr.status} : {error:status});
    });

    return result.promise();
}