function Post(init) {
    fill(this,init,[
	'id',
	'chat',
	'author',
	'time',
	'body',
	'track',
	'custom',
	'tree'
    ]);

    // Recursively fill the tree
    var tree = this.tree = this.tree || { count: 0, top: [] };
    var chat = this.chat;
    if (tree.top.length > 0) {
	tree.top = tree.top.map(function(data) { 
	    data.chat = chat; 
	    return new Post(data); 
	});
    }
}

Post.prototype = Object.create({

    // Load post data from the server
    //
    Load: function() {
	var self = this;
	return request('GET',['chat',this.chat,'posts',this.id]).then(function(data) {
	    Post.call(self,data.info);
	    data.people.forEach(Person.Cache);
	    return self;
	});
    },

    // Delete the post from the server
    //
    Delete: function() {
	return request('DELETE',['chat',this.chat,'posts',this.id]);
    },

    // Reply to the post
    //
    Reply: function(params) {
	var self = this;
	params = keep(params,['body','custom']);
	params.reply = this.id;
	return request('POST',['chat',this.chat,'posts'],{},params).then(function(data) {
	    return new Chat.Post({ 
		body: params.body, 
		custom: params.custom || null, 
		id: data.id, 
		chat: self.chat
	    });
	});
    },

    // Start (or stop) tracking a post
    //
    Track: function(track) {
	return request('POST',['chat',this.chat,'posts',this.id,'track'],{},track);
    },

    // List replies 
    //
    Replies: function(params) {
	var self = this;
	params = keep(params || {},['limit','offset']);
	params.under = self.id;
	return request('GET',['chat',this.chat,'posts'],params).then(function(data) {
	    data.people.forEach(Person.Cache);
	    return data.posts.map(function(post) { 
		post.chat = self.chat; 
		return new Chat.Post(post);
	    });
	});	
    }

});

function Chat(init) {
    fill(this,init,[
	'id',
	'subject',
	'custom',
	'audience',
	'count',
	'last',
	'access',
	'track'
    ]);
}

Chat.prototype = Object.create({

    // Load chat data from the server
    //
    Load: function() {
	var self = this;
	return request('GET',['chat',this.id]).then(function(data) {
	    Chat.call(self,data.info);
	    return self;
	});
    },

    // Update an existing chatroom
    // 
    Save: function() {
	return request('PUT',['chat',this.id],{},keep(this,['subject','custom','audience']));
    },

    // Create a chatroom and retrieve its identifier
    //
    Create: function() {
	var self = this;
	return request('POST','chat',{},keep(this,['subject','custom','audience'])).then(function(data) {
	    self.id = data.id;
	    return self;
	});
    },

    // Delete a chatroom
    //
    Delete: function() {
	return request('DELETE',['chat',this.id]);
    },

    // Start (or stop) tracking a chatroom
    //
    Track: function(track) {
	return request('POST',['chat',this.id,'track'],{},track);
    },

    // Grab a tree of posts from a chatroom
    // 
    Posts: function(params) {
	var self = this;
	params = params || {};
	return request('GET',['chat',this.id,'posts'],keep(params,['limit','offset'])).then(function(data) {
	    data.people.forEach(Person.Cache);
	    return data.posts.map(function(post) { 
		post.chat = self.id; 
		return new Chat.Post(post);
	    });
	});
    },

    // Create a new post in this chatroom
    // 
    Post: function(params) {
	var self = this;
	return request('POST',['chat',this.id,'posts'],{},keep(params,['body','custom'])).then(function(data) {
	    return new Chat.Post({ 
		body: params.body, 
		custom: params.custom || null, 
		id: data.id, 
		chat: self.id
	    });
	});
    }

});

// List all visible chatrooms
//
Chat.List = function(params) {
    params = params || {};
    return request('GET','chat',keep(params,['limit','offset'])).then(function(data) {
	return data.list.map(function(info) { return new Chat(info); });
    });
};

Chat.Post = Post;
