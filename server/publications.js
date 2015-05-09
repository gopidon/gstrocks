/**
 * Created by gopi on 11/26/14.
 */
Meteor.publish('HomeMessages', function() {
    return Messages.find({screen:"home"});
});

Meteor.publish('Fbs', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Fbs.find({}, options);
});


Meteor.publish('posts', function(search, options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    if(search)
        check(search,String);
    else
        check(search, null);
    var searchObject = {};
    if(search){
        searchObject = {$or: [
            {title: new RegExp(search, 'i')},
            {content: new RegExp(search, 'i')}
        ]};

    }
    var searchObject2 = _.extend(searchObject, {
        visible:true
    });
    return Posts.find(searchObject2, options);
});

Meteor.publish('allposts', function(search, options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    if(search)
        check(search,String);
    else
        check(search, null);
    var searchObject = {};
    if(search){
        searchObject = {$or: [
            {title: new RegExp(search, 'i')},
            {content: new RegExp(search, 'i')}
        ]};

    }
    return Posts.find(searchObject, options);
});

Meteor.publish('GSTPost', function() {

    return Posts.find({title: 'GSTPost'});
});

Meteor.publish('comments', function(id) {
    check(id, String);
    return Comments.find({postId: id});
});

Meteor.publish('top5Posts', function() {
    return Posts.find({visible: true}, {sort: {submitted: -1}, limit: 5});
});


Meteor.publish('HomeNewsPosts', function() {
    return NPosts.find({makeHome: true}, {sort: {submitted: -1}, limit: 6});
});

Meteor.publish('HomeEditorOpinionPosts', function() {
    return DPosts.find({showOnHome: true}, {sort: {submitted: -1}, limit: 6});
});

Meteor.publish('singlePost', function(id) {
        check(id, String)
        return Posts.find(id);
    }
);



Meteor.publish('dposts', function(search, options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    if(search)
        check(search,String);
    else
        check(search, null);
    var searchObject = {};
    if(search){
        searchObject = {$or: [
            {title: new RegExp(search, 'i')},
            {content: new RegExp(search, 'i')}
        ]};

    }
    return DPosts.find(searchObject, options);
});



Meteor.publish('dcomments', function(id) {
    check(id, String);
    return DComments.find({dpostId: id});
});







Meteor.publish('singleDPost', function(id) {
        check(id, String)
        return DPosts.find(id);
    }
);

Meteor.publish('nposts', function(search, options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    if(search)
        check(search,String);
    else
        check(search, null);
    var searchObject = {};
    if(search){
         searchObject = {$or: [
            {title: new RegExp(search, 'i')},
            {content: new RegExp(search, 'i')}
        ]};

    }
    return NPosts.find(searchObject, options);
});

Meteor.publish('ncomments', function(id) {
    check(id, String);
    return NComments.find({npostId: id});
});



Meteor.publish('singleNPost', function(id) {
        check(id, String)
        return NPosts.find(id);
    }
);

Meteor.publish("facebook_email", function() {
    return Meteor.users.find({_id: this.userId}, {fields: {'services.facebook.email': 1}});
});

Meteor.publish("UserData", function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
            {fields: {'services': 1}});
    } else {
        this.ready();
    }
});

Meteor.publish("AllUsers", function() {
    return Meteor.users.find({});
});

