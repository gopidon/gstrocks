/**
 * Created by gopi on 11/4/14.
 */

Meteor.methods({
    getUserEmail: function() {

        check(Meteor.userId(), String);


        var user = Meteor.user();
        if(Meteor.isServer) {
            var email = user.services.facebook.email;

            return {
                email: email
            };
        }

    }




});


