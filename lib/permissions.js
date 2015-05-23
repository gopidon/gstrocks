/**
 * Created by gopi on 11/27/14.
 */

isUserAdmin = function(){
    var loggedInUser = Meteor.user();
    if (!loggedInUser) {
        return false;
    }
    else{
        if (Roles.userIsInRole(loggedInUser, 'admin')) {
            return true;
        }
        else{
            return false;
        }
    }
}

isUserAdmin2 = function(userId, image){
    var loggedInUser = Meteor.user();
    if (!loggedInUser) {
        return false;
    }
    else{
        if (Roles.userIsInRole(loggedInUser, 'admin')) {
            return true;
        }
        else{
            return false;
        }
    }
}

isLoggedIn = function(){
    if (! Meteor.user()) {
        return false;
    }
    else {
        return true;
    }
}


ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
}

falseFunc = function(){
    return false;
}