/**
 * Created by gopi on 2/2/15.
 */

Template.homediscussions.helpers({
    topDPosts: function(){
        Meteor.subscribe('topDPosts');
        return DPosts.find({}, {sort: {commentsCount: -1}, limit: 5});
    },
    latestDPosts: function(){
        Meteor.subscribe('latestDPosts');
        return DPosts.find({}, {sort: {submitted: -1}, limit: 5})
    }
});