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
        return DComments.insert(dcomment);
    },
    dcommentDelete: function(commentId){
        check(commentId, String);
        var dpostId = DComments.findOne({_id: commentId}).dpostId;
        DComments.remove(commentId, function(err){
            if(err)
            {
                logger.warn("Error deleting dComment");
                throw new Meteor.Error('dcomment-remove-err',  'Error removing discussion comment!');
            }
            else{

                DPosts.update(dpostId, {$inc: {commentsCount: -1}});
            }
        });
    }
});