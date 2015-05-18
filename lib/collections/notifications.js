/**
 * Created by gopi on 5/18/15.
 */

Notifications = new Mongo.Collection('notifications');
Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) &&
            fieldNames.length === 1 && fieldNames[0] === 'read';
    } });
createCommentNotification = function(comment, type) {
    var post;
    if(type == "Post"){
        post = Posts.findOne(comment.postId);
    }
    else if(type == "NPost"){
        post = NPosts.findOne(comment.npostId);
    }
    else{
        post = DPosts.findOne(comment.dpostId);
    }
    if (comment.userId !== post.userId) {
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            type: type,
            commentId: comment._id, commenterName: comment.author, read: false
        }); }
};