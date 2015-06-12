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
            content: String,
            eOpinion: Boolean
        });

        var errors = validateDPost(dpostAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your post");

        var user = Meteor.user();
        var dpost = _.extend(dpostAttributes, {
            userId: user._id,
            author: user.profile.name,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
        var dpostId = DPosts.insert(dpost);

        if(dpostId){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'dpost',
                    id: dpostId,
                    body: dpost
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing dpost: "+dpostId);
                    }
                    else{
                        logger.info("Indexed dpost "+dpostId + " successfully");
                    }
                });
            }
        }

        return {
            _id: dpostId
        };
    },
    dpostUpdate: function(currentDPostId, dpostAttributes) {
        check(Meteor.userId(), String);
        check(currentDPostId, String);
        check(dpostAttributes, {
            title: String,
            content: String,
            eOpinion: Boolean
        });

        var errors = validateDPost(dpostAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your dpost");

        DPosts.update(currentDPostId, {$set: dpostAttributes}, function(error) {
            if(!error) {
                if (Meteor.isServer) {
                    esClient.update({
                        index: 'gst',
                        type: 'dpost',
                        id: currentDPostId,
                        body: {
                            doc: dpostAttributes
                        }
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error indexing updated dpost: " + currentDPostId);
                        }
                        else {
                            logger.info("Indexed updated dpost " + currentDPostId + " successfully");
                        }
                    });
                }
            }

        });
    },
    dpostDelete: function(postId){
        check(postId, String);
        DPosts.remove(postId, function(err){
            if(!err){
                DComments.remove({dpostId: postId});

                //Remove from Elastic Search
                if(Meteor.isServer){

                    esClient.delete({
                        index: 'gst',
                        type: 'dpost',
                        id: postId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  dpost: "+postId);
                        }
                        else{
                            logger.info("Deleted from index,  dpost: "+postId + " successfully");
                        }
                    });

                    var deleted = 0;
                    //Delete from index all comments of this post
                    esClient.search({
                        index: 'gst',
                        type: 'dcomment',
                        // Set to 30 seconds because we are calling right back
                        scroll: '30s',
                        body: {
                            query: {
                                match: {
                                    dpostId: postId
                                }
                            }
                        }
                    }, function getMoreUntilDone(error, response) {
                        // collect the title from each response
                        response.hits.hits.forEach(function (hit) {
                            //Delete comment from the index
                            esClient.delete({
                                index: 'gst',
                                type: 'dcomment',
                                id: hit._id
                            }, function (error, response) {
                                ++deleted;
                                if (error) {
                                    logger.error("Error deleting from index during bulk delete,  dcomment: "+hit._id);
                                }
                                else{

                                    logger.info("Deleted from index during bulk delete,  dcomment: "+hit._id + " successfully");
                                }
                            });
                        });
                        //console.log("Total:",response.hits.total );
                        if (response.hits.total !== deleted) {
                            // now we can call scroll over and over
                            esClient.scroll({
                                scrollId: response._scroll_id,
                                scroll: '30s'
                            }, getMoreUntilDone);
                        } else {
                            logger.info("All comments for dpostId: "+postId + " deleted successfully from the index");
                        }

                    });
                }
            }
            else{
                throw new Meteor.Error('dpost-remove-err',  'Error removing discussion post!');
            }
        });
    },

    showOnHome: function(params){
        check(params, {
            id: String,
            showOnHome: Boolean
        });
        DPosts.update(
            {
                _id: params.id
            },
            {
                $set: {showOnHome:params.showOnHome}
            });
    },
    upvote: function(dpostId) {
        check(this.userId, String);
        check(dpostId, String);
        var affected = DPosts.update({ _id: dpostId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId}, $inc: {votes: 1}
        });
        if (! affected)
        {
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
        }

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

