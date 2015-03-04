/**
 * Created by gopi on 2/2/15.
 */
Template.homenews.helpers({
    briefContent: function(){
        return this.content.substring(0,100) + " ...";
    },
    HomeNewsPosts: function(){

        var posts = [];
        var _i = 0;
        NPosts.find({}, {sort: {submitted: -1}, limit: 6}).forEach(function(p){
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