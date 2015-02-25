/**
 * Created by gopi on 11/4/14.
 */
DPosts = new Mongo.Collection('dposts');

validateDPost = function (dpost)
{
    var errors = {};
    if (!dpost.title)
        errors.title = "Please fill in the title";
    if (!dpost.content)
        errors.content = "Please fill in the content";
    return errors;
}

Meteor.methods({
    dpostInsert: function(dpostAttributes) {

        check(Meteor.userId(), String);
        check(dpostAttributes, {
            title: String,
            content: String
        });

        var errors = validateDPost(dpostAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your post");

        var user = Meteor.user();
        var dpost = _.extend(dpostAttributes, {
            userId: user._id,
            author: user.profile.name,
            submitted: new Date(),
            commentsCount: 0
        });
        var dpostId = DPosts.insert(dpost);

        return {
            _id: dpostId
        };
    },
    dpostDelete: function(postId){
        check(postId, String);
        DPosts.remove(postId, function(err){
            if(!err){
                DComments.remove({dpostId: postId});
            }
            else{
                throw new Meteor.Error('npost-remove-err',  'Error removing discussion post!');
            }
        });
    }




});

DPosts.allow({
    update: function(userId, dpost) { return ownsDocument(userId, dpost); },
    remove: function(userId, dpost) { return ownsDocument(userId, dpost); }
});


DPosts.deny({
    update: function(userId, dpost, fieldNames) {
        var errors = validateDPost(dpost);
        return errors.title || errors.content; }
});

