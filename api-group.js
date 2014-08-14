function Group(init) {
    fill(this,init,[
	"id",
	"label",
	"count",
	"audience",
	"access"
    ]);
}

Group.prototype = Object.create({
   
    // Create a group on the server
    // 
    Create: function() {
	var self = this;
	return request("POST","groups",{},keep(this,[ "id", "label", "audience" ])).then(function(data) {
	    Group.call(self,data);
	    return self;
	});
    },

    // List people in the group
    List: function(params) {
	params = params || {};
	return request("GET",["groups",this.id],keep(params,[ "limit", "offset" ])).then(function(data) {
	    return data.list.map(Person.Cache);
	});
    },

    // Load the group information
    //
    Load: function() {
	var self = this;
	return request("GET",["groups",this.id,"info"]).then(function(data) {
	    Group.call(self,data);
	    return self;
	});
    },

    // Save the group information
    //
    Save: function() {
	return request("PUT",["groups",this.id,"info"],{},keep(this,["label", "audience"]));
    },

    // Delete the group from the server
    //
    Delete: function() {
	return request("DELETE",["groups",this.id]);
    },
 
    // Add a single person to this group
    //
    Add: function(person) {
	return this.AddMany([person]);
    },

    // Removes a single person from this group
    //
    Remove: function(person) {
	return this.RemoveMany([person]);
    },

    // Adds many people to this group
    // 
    AddMany: function(people) {
	return request("POST",["groups",this.id,"add"],{},people.map(id));
    },

    // Remove many people from this group
    //
    RemoveMany: function(people) {
	return request("POST",["groups",this.id,"remove"],{},people.map(id));
    },

});

// Load a list of groups from the server
// 
Group.List = function(params) {
    params = params || {};
    return request("GET","groups",keep(params,[ "limit", "offset" ])).then(function(data) {
	return data.list.map(function(init) { return new Group(init); });
    });
};