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
        var commentId = Comments.insert(comment);

        if(commentId){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'comment',
                    id: commentId,
                    body: comment
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing post comment: "+commentId);
                    }
                    else{
                        logger.info("Indexed comment "+commentId + " successfully");
                    }
                });

                //Update comment count of the post in the index
                esClient.update({
                    index: 'gst',
                    type: 'post',
                    id: comment.postId,
                    body: {
                        doc:{
                            commentsCount: ++post.commentsCount
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        logger.error("Error updating comment count in the index for the post: "+comment.postId);
                    }
                    else{
                        logger.info("Updated comment count in the index for the post: "+comment.postId + " successfully");
                    }
                });

            }
        }
        return commentId;
    },
    commentDelete: function(commentId){
        check(commentId, String);

        var postId = Comments.findOne({_id: commentId}).postId;
        var post = Posts.findOne(postId);
        Comments.remove(commentId, function(err){
            if(err)
            {
                logger.error("Error deleting Comment");
                throw new Meteor.Error('comment-remove-err',  'Error removing comment!');
            }
            else{
                Posts.update(postId, {$inc: {commentsCount: -1}});

                if(Meteor.isServer){
                    //Delete comment from the index
                    esClient.delete({
                        index: 'gst',
                        type: 'comment',
                        id: commentId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  comment: "+commentId);
                        }
                        else{
                            logger.info("Deleted from index,  comment: "+commentId + " successfully");
                        }
                    });

                    //Update comment count of the post in the index
                    esClient.update({
                        index: 'gst',
                        type: 'post',
                        id: postId,
                        body: {
                            doc:{
                                commentsCount: --post.commentsCount
                            }
                        }
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error updating comment count in the index for the post: "+postId);
                        }
                        else{
                            logger.info("Updated comment count in the index for the post: "+postId + " successfully");
                        }
                    });
                }




            }
        });
    }
});