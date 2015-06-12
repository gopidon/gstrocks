/**
 * Created by gopi on 1/8/15.
 */
NComments = new Mongo.Collection('ncomments');

Meteor.methods({
    ncommentInsert: function(ncommentAttributes) {
        check(this.userId, String);
        check(ncommentAttributes, {
            npostId: String,
            body: String
        });
        var user = Meteor.user();
        var npost = NPosts.findOne(ncommentAttributes.npostId);
        if (!npost)
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');
        ncomment = _.extend(ncommentAttributes, { userId: user._id,
            author: user.profile.name,
            submitted: new Date()
        });
        NPosts.update(ncomment.npostId, {$inc: {commentsCount: 1}});
        ncomment._id = NComments.insert(ncomment);
        createCommentNotification(ncomment, 'NPost');


        if(ncomment._id){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'ncomment',
                    id: ncomment._id,
                    body: ncomment
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing npost comment: "+ncomment._id);
                    }
                    else{
                        logger.info("Indexed ncomment "+ncomment._id + " successfully");
                    }
                });

                //Update comment count of the post in the index
                esClient.update({
                    index: 'gst',
                    type: 'npost',
                    id: ncomment.npostId,
                    body: {
                        doc:{
                            commentsCount: ++npost.commentsCount
                        }
                    }
                }, function (error, response) {
                    if (error) {
                        logger.error("Error updating comment count in the index for the npost: "+ncomment.npostId);
                    }
                    else{
                        logger.info("Updated comment count in the index for the npost: "+ncomment.npostId + " successfully");
                    }
                });

            }
        }

        return ncomment._id;
    },
    ncommentDelete: function(commentId){
        check(commentId, String);
        var npostId = NComments.findOne({_id: commentId}).npostId;
        var npost = NPosts.findOne(npostId);
        NComments.remove(commentId, function(err){
            if(err)
            {
                throw new Meteor.Error('ncomment-remove-err',  'Error removing news comment!');
            }
            else{
                NPosts.update(npostId, {$inc: {commentsCount: -1}});

                if(Meteor.isServer){
                    //Delete comment from the index
                    esClient.delete({
                        index: 'gst',
                        type: 'ncomment',
                        id: commentId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  ncomment: "+commentId);
                        }
                        else{
                            logger.info("Deleted from index,  ncomment: "+commentId + " successfully");
                        }
                    });

                    //Update comment count of the post in the index
                    esClient.update({
                        index: 'gst',
                        type: 'npost',
                        id: npostId,
                        body: {
                            doc:{
                                commentsCount: --npost.commentsCount
                            }
                        }
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error updating comment count in the index for the npost: "+npostId);
                        }
                        else{
                            logger.info("Updated comment count in the index for the npost: "+npostId + " successfully");
                        }
                    });
                }

            }
        });
    }
});

NComments.allow({
    remove: function(userId, doc) { return ownsDocument(userId, doc); }
});