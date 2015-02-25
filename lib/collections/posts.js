/**
 * Created by gopi on 11/4/14.
 */
Posts = new Mongo.Collection('posts');

validatePost = function (post)
{
    var errors = {};
    if (!post.title)
        errors.title = "Please fill in the title";
    if (!post.content)
        errors.content = "Please fill in the content";
    return errors;
}

Meteor.methods({
    postInsert: function(postAttributes) {

        check(Meteor.userId(), String);
        check(postAttributes, {
            title: String,
            content: String,
            visible: Boolean
        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your post");

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.profile.name,
            submitted: new Date(),
            commentsCount: 0
        });
        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },
    postDelete: function(postId){
        check(postId, String);
        Posts.remove(postId, function(err){
            if(!err){
                Comments.remove({postId: postId});
            }
            else{
                throw new Meteor.Error('post-remove-err',  'Error removing Whats new post!');
            }
        });
    }




});

Posts.allow({
    update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); }
});


Posts.deny({
    update: function(userId, post, fieldNames) {
        var errors = validatePost(post);
        return errors.title || errors.content; }
});

