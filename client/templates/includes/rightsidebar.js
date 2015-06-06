/**
 * Created by gopi on 11/25/14.
 */


Template.rightsidebar.helpers({
    isAdminUser: function(){
        var user = Meteor.user();
        if(user.services){
            email = user.services.facebook.email;
            if(email == 'gopi_don@rediffmail.com'){
                return true;
            }
            else{
                return false;
            }
        }

    },
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();
        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });
        return active && 'active';
    },
    notificationCount: function(){
        return Notifications.find({userId: Meteor.userId(), read: false}).count();
    }

});

Template.rightsidebar.events({
    'click #loginLink': function(e) {
        e.preventDefault();
        $('#loginModal').modal("show");
    },
    'click #logout': function(e) {
        e.preventDefault();
        Meteor.logout(function(err){
            if (err) {
                throwError("Logout failed");
            }
        })
    }
});


