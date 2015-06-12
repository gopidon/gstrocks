/**
 * Created by gopi on 1/8/15.
 */
DComments = new Mongo.Collection('dcomments');

Meteor.methods({
    dcommentInsert: function(dcommentAttributes) {
        check(this.userId, String);
        check(dcommentAttributes, {
            dpostId: String,
            body: String
        });
        var user = Meteor.user();
        var dpost = DPosts.findOne(dcommentAttributes.dpostId);
        if (!dpost)
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');
        dcomment = _.extend(dcommentAttributes, { userId: user._id,
            author: user.profile.name,
            submitted: new Date()
        });
        DPosts.update(dcomment.dpostId, {$inc: {commentsCount: 1}});

        dcomment._id = DComments.insert(dcomment);
        createCommentNotification(dcomment,"DPost");

        if(dcomment._id){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'dcomment',
                    id: dcomment._id,
                    body: dcomment
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing dpost comment: "+dcomment._id);
                    }
                    else{
                        logger.info("Indexed dcomment "+dcomment._id + " successfully");
                    }
                });

                //Update comment count of the post in the index
                esClient.update({
                    index: 'gst',
                    type: 'dpost',
                    id: dcomment.dpostId,
                    body: {
                        doc:{
                            commentsCount: ++dpost.commentsCount
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        logger.error("Error updating comment count in the index for the dpost: "+dcomment.dpostId);
                    }
                    else{
                        logger.info("Updated comment count in the index for the dpost: "+dcomment.dpostId + " successfully");
                    }
                });

            }
        }


        return dcomment._id;
    },
    dcommentDelete: function(commentId){
        check(commentId, String);
        var dpostId = DComments.findOne({_id: commentId}).dpostId;
        var dpost = DPosts.findOne(dpostId);
        DComments.remove(commentId, function(err){
            if(err)
            {
                logger.warn("Error deleting dComment");
                throw new Meteor.Error('dcomment-remove-err',  'Error removing discussion comment!');
            }
            else{

                DPosts.update(dpostId, {$inc: {commentsCount: -1}});

                if(Meteor.isServer){
                    //Delete comment from the index
                    esClient.delete({
                        index: 'gst',
                        type: 'dcomment',
                        id: commentId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  dcomment: "+commentId);
                        }
                        else{
                            logger.info("Deleted from index,  dcomment: "+commentId + " successfully");
                        }
                    });

                    //Update comment count of the post in the index
                    esClient.update({
                        index: 'gst',
                        type: 'dpost',
                        id: dpostId,
                        body: {
                            doc:{
                                commentsCount: --dpost.commentsCount
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
        });
    }
});