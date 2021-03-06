/**
 * Created by gopi on 11/25/14.
 */

Template.header.rendered = function(){
    if(!Meteor.user()){
        /*$('#social-logins').tooltip({
            placement: 'bottom'
        });
        $('#social-logins').tooltip('show');*/
    }
    else{
        //$('#social-logins').tooltip('hide');
    }

};

Template.header.helpers({
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
    }

});

Template.header.events({
    'click #signOut': function(e, t){
        e.preventDefault();
        Meteor.logout(function() {

        });

    },
    'click #facebook-login': function(e) {
        e.preventDefault();
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throwError("Facebook login failed");
            }
            $('#loginModal').modal("hide");
        });
    },
    'click #google-login': function(e) {
        e.preventDefault();
        Meteor.loginWithGoogle({}, function(err){
            if (err) {
                throwError("Google login failed");
            }
            $('#loginModal').modal("hide");
        });
    },

    'click #logout': function(e) {
        e.preventDefault();
        Meteor.logout(function(err){
            if (err) {
                throwError("Logout failed");
            }
        })
    },

    'click #loginLink': function(e) {
        e.preventDefault();
        $('#loginModal').modal("show");
     },

    'submit form': function(e) {
        e.preventDefault();
        var search =  $(e.currentTarget).find('#search').val();
        Router.go('search',{'searchLimit':5,'searchText':search});
    }
});


