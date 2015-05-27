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

        if(postId){
            //Insert into Elastic Search
            if(Meteor.isServer){
                esClient.create({
                    index: 'gst',
                    type: 'post',
                    id: postId,
                    body: post
                }, function (error, response) {
                    if (error) {
                        logger.error("Error indexing post: "+postId);
                    }
                    else{
                        logger.info("Indexed post "+postId + " successfully");
                    }
                });
            }
        }

        return {
            _id: postId
        };
    },
    postDelete: function(postId){
        check(postId, String);
        var post = Posts.findOne(postId);
        Posts.remove(postId, function(err){

            if(!err){


                // Remove Comments
                Comments.remove({postId: postId});

                //Remove from Elastic Search
                if(Meteor.isServer){

                    esClient.delete({
                        index: 'gst',
                        type: 'post',
                        id: postId
                    }, function (error, response) {
                        if (error) {
                            logger.error("Error deleting from index,  post: "+postId);
                        }
                        else{
                            logger.info("Deleted from index,  post: "+postId + " successfully");
                        }
                    });

                    var deleted = 0;
                    //Delete from index all comments of this post
                    esClient.search({
                        index: 'gst',
                        type: 'comment',
                        // Set to 30 seconds because we are calling right back
                        scroll: '30s',
                        body: {
                            query: {
                                match: {
                                    postId: postId
                                }
                            }
                        }
                    }, function getMoreUntilDone(error, response) {
                        // collect the title from each response
                        response.hits.hits.forEach(function (hit) {
                            //Delete comment from the index
                            esClient.delete({
                                index: 'gst',
                                type: 'comment',
                                id: hit._id
                            }, function (error, response) {
                                ++deleted;
                                if (error) {
                                    logger.error("Error deleting from index during bulk delete,  comment: "+hit._id);
                                }
                                else{

                                    logger.info("Deleted from index during bulk delete,  comment: "+hit._id + " successfully");
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
                            logger.info("All comments for postId: "+postId + " deleted successfully from the index");
                        }

                    });
                }

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

