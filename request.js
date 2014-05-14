function now() { return +new Date(); }

    // The last token returned by an authentication method
var token = null, 

    // The 'as' that corresponds to the token (if it is not
    // null).
    as,

    // The clock returned by the last clock-based request
    clock = null,

    // The time when the clock expires. Only used if 'clock' 
    // is not null.
    clock_expiration;

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
    var sep = '?', 

        // The returned result
        result = $.Deferred(),

        // Key for traversing the query string
        key,

        // The ajax configuration.
        ajax;

    if (clock && clock_expiration < now()) clock = null;

    // Construct the url by appending any necessary parameters

    url = RunOrg.endpoint + '/db/' + RunOrg.db + '/' + url.join('/');

    clock && (query.at = clock);
    token && (query.as = as);

    for (key in query) {
	url += sep + key + '=' + query[key]; 
	sep = '&';
    }

    // Construct the AJAX config that will be used for the call

    ajax = {
	
	url: url,
	dataType: 'json',
	type: method,

	beforeSend: function(xhr) {
	    token && xhr.setRequestHeader('Authorization','RUNORG token=' + token);
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

	    	var c = clock ? JSON.parse(clock) : [], i, j, n = c.length, at = data.at;
		
		// Merge the new clock value with the old one
		for (i = 0; i < at.length; ++i) {
		    for (j = 0; j < n; ++j) 
			if (c[j][0] == at[i][0]) { c[j][1] = at[i][1]; break; }
		    if (j == n) 
			c.push(at[i]);
		}
		
		clock = JSON.stringify(c);
		clock_expiration = now() + 60000; // <- Assume that it expires after 1 minute
	    }

	    // Is there an authentication value returned ? 
	    if ('token' in data && 'self' in data) {
		token = data.token;
		as    = data.self.id;
	    } 

	    result.resolve([ xhr.status, data ]);
	}
	else
	    result.reject(success ? {HTTP:xhr.status} : {error:status});
    });

    return result.promise();
}