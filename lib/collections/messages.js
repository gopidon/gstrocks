/**
 * Created by gopi on 11/26/14.
 */
Messages = new Mongo.Collection("messages");

Messages.allow({
    update: function(userId, message) {
        return isUserAdmin();
    }
});