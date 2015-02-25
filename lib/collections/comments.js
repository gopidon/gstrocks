/**
 * Created by gopi on 1/8/15.
 */


Comments = new Mongo.Collection('comments');

Meteor.methods({
    commentInsert: function(commentAttributes) {
        check(this.userId, String); check(commentAttributes, {
            postId: String,
            body: String
        });
        var user = Meteor.user();
        var post = Posts.findOne(commentAttributes.postId);
        if (!post)
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');
        comment = _.extend(commentAttributes, { userId: user._id,
            author: user.profile.name,
            submitted: new Date()
        });
        Posts.update(comment.postId, {$inc: {commentsCount: 1}});
        return Comments.insert(comment);
    },
    commentDelete: function(commentId){
        check(commentId, String);
        var postId = Comments.findOne({_id: commentId}).postId;
        Comments.remove(commentId, function(err){
            if(err)
            {
                logger.warn("Error deleting Comment");
                throw new Meteor.Error('comment-remove-err',  'Error removing comment!');
            }
            else{

                Posts.update(postId, {$inc: {commentsCount: -1}});
            }
        });
    }
});