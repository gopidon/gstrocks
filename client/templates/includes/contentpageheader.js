/**
 * Created by gopi on 11/25/14.
 */


Template.contentpageheader.helpers({
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

    }

});

Template.contentpageheader.events({
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
    }
});


