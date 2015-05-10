/**
 * Created by gopi on 2/2/15.
 */
Template.homeeopinions.helpers({
    HomeEditorOpinionPosts: function(){

        var posts = [];
        var _i = 0;
        DPosts.find({showOnHome: true}, {sort: {submitted: -1}, limit: 6}).forEach(function(p){
            p.position = _i;
            _i++;
            posts.push(p);

        });
        return posts;


    },
    firstRow: function() {
        return (this.position < 3);
    },
    secondRow: function() {
        return (this.position >= 3);
    }



});