/**
 * Created by gopi on 11/27/14.
 */
Template.postsList.events({
    "keyup #searchPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newPosts',{'postsLimit':5,'postsSearch':text});
    }, 200)
});