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

});


