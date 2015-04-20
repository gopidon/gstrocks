/**
 * Created by gopi on 11/27/14.
 */

Template.dpostsList.events({
    "keyup #searchDiscussPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newDPosts',{'dpostsLimit':5,'dpostsSearch':text});
    }, 200),

    'click #loginLink': function(e) {
        e.preventDefault();
        $('#loginModal').modal("show");
    }
});
