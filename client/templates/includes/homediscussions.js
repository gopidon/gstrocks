/**
 * Created by gopi on 2/2/15.
 */

Template.homediscussions.onCreated(function(){
    Meteor.subscribe('topDPosts');
    Meteor.subscribe('latestDPosts');
});

Template.homediscussions.helpers({
    topDPosts: function(){
        return DPosts.find({}, {sort: {commentsCount: -1}, limit: 5});
    },
    latestDPosts: function(){
        return DPosts.find({}, {sort: {submitted: -1}, limit: 5})
    }
});