/**
 * Created by gopi on 11/27/14.
 */


Template.userProfile.helpers(
    {
        userPhotoURL: function(){
            if(Meteor.user().services.facebook)
            {
                return "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=normal";
            }
            else if(Meteor.user().services.google){
                return Meteor.user().services.google.picture;
            }
        }
    }
);