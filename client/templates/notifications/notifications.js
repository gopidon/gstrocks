/**
 * Created by gopi on 5/18/15.
 */
Template.notifications.helpers({
    notifications: function() {
        return Notifications.find({userId: Meteor.userId(), read: false});
    },
    notificationCount: function(){
        return Notifications.find({userId: Meteor.userId(), read: false}).count();
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function() {
        if(this.type == "Post"){
            return Router.routes.postPage.path({_id: this.postId});
        }
        else if (this.type == "NPost"){
            return Router.routes.npostPage.path({_id: this.postId});
        }
        else{
            return Router.routes.dpostPage.path({_id: this.postId});
        }
    }

});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, {$set: {read: true}});
    }
});