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
        return NComments.insert(ncomment);
    },
    ncommentDelete: function(commentId){
        check(commentId, String);
        var npostId = NComments.findOne({_id: commentId}).npostId;
        NComments.remove(commentId, function(err){
            if(err)
            {
                throw new Meteor.Error('ncomment-remove-err',  'Error removing news comment!');
            }
            else{
                NPosts.update(npostId, {$inc: {commentsCount: -1}});
            }
        });
    }
});

NComments.allow({
    remove: function(userId, doc) { return ownsDocument(userId, doc); }
});