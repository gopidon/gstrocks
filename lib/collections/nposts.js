/**
 * Created by gopi on 11/4/14.
 */
NPosts = new Mongo.Collection('nposts');

validateNPost = function (post)
{
    var errors = {};
    if (!post.title)
        errors.title = "Please fill in the title";
    if (!post.content)
        errors.content = "Please fill in the content";
    return errors;
}

Meteor.methods({
    npostInsert: function(npostAttributes) {

        check(Meteor.userId(), String);
        check(npostAttributes, {
            title: String,
            content: String
        });

        var errors = validateNPost(npostAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your post");

        var user = Meteor.user();
        var npost = _.extend(npostAttributes, {
            userId: user._id,
            author: user.profile.name,
            submitted: new Date(),
            commentsCount: 0
        });
        var npostId = NPosts.insert(npost);

        return {
            _id: npostId
        };
    },
    npostDelete: function(postId){
        check(postId, String);
        NPosts.remove(postId, function(err){
            if(!err){
                NComments.remove({npostId: postId});
            }
            else{
                throw new Meteor.Error('npost-remove-err',  'Error removing news post!');
            }
        });
    },

    makeHomeItem: function(params){
        check(params, {
            id: String,
            makeHome: Boolean
        });
        NPosts.update(
            {
                _id: params.id
            },
            {
                $set: {makeHome:params.makeHome}
            });
    }




});

NPosts.allow({
    update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); }
});


NPosts.deny({
    update: function(userId, post, fieldNames) {
        var errors = validateNPost(post);
        return errors.title || errors.content; }
});

