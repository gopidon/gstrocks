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

        if(npostId){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'npost',
                    id: npostId,
                    body: npost
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing npost: "+npostId);
                    }
                    else{
                        logger.info("Indexed npost "+npostId + " successfully");
                    }
                });
            }
        }

        return {
            _id: npostId
        };
    },
    npostUpdate: function(currentNPostId, npostAttributes) {
        check(Meteor.userId(), String);
        check(currentNPostId, String);
        check(npostAttributes, {
            title: String,
            content: String
        });

        var errors = validateNPost(npostAttributes);
        if (errors.title || errors.content)
            throw new Meteor.Error('invalid-post', "You must set the title and content for your npost");

        NPosts.update(currentNPostId, {$set: npostAttributes}, function(error) {
            if(!error) {
                if (Meteor.isServer) {
                    esClient.update({
                        index: 'gst',
                        type: 'npost',
                        id: currentNPostId,
                        body: {
                            doc: npostAttributes
                        }
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error indexing updated npost: " + currentNPostId);
                        }
                        else {
                            logger.info("Indexed updated npost " + currentNPostId + " successfully");
                        }
                    });
                }
            }

        });
    },
    npostDelete: function(postId){
        check(postId, String);
        NPosts.remove(postId, function(err){
            if(!err){
                NComments.remove({npostId: postId});

                //Remove from Elastic Search
                if(Meteor.isServer){

                    esClient.delete({
                        index: 'gst',
                        type: 'npost',
                        id: postId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  npost: "+postId);
                        }
                        else{
                            logger.info("Deleted from index,  npost: "+postId + " successfully");
                        }
                    });

                    var deleted = 0;
                    //Delete from index all comments of this post
                    esClient.search({
                        index: 'gst',
                        type: 'ncomment',
                        // Set to 30 seconds because we are calling right back
                        scroll: '30s',
                        body: {
                            query: {
                                match: {
                                    npostId: postId
                                }
                            }
                        }
                    }, function getMoreUntilDone(error, response) {
                        // collect the title from each response
                        response.hits.hits.forEach(function (hit) {
                            //Delete comment from the index
                            esClient.delete({
                                index: 'gst',
                                type: 'ncomment',
                                id: hit._id
                            }, function (error, response) {
                                ++deleted;
                                if (error) {
                                    logger.error("Error deleting from index during bulk delete,  ncomment: "+hit._id);
                                }
                                else{

                                    logger.info("Deleted from index during bulk delete,  ncomment: "+hit._id + " successfully");
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
                            logger.info("All comments for npostId: "+postId + " deleted successfully from the index");
                        }

                    });
                }
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

