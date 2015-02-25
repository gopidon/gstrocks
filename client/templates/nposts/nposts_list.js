/**
 * Created by gopi on 11/27/14.
 */
Template.npostsList.events({
    "keyup #searchNewsPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newNPosts',{'npostsLimit':5,'npostsSearch':text});
    }, 200)
});