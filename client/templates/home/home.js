/**
 * Created by gopi on 11/21/14.
 */

Template.home.helpers({
   /* home_title: function(){
        var msg = Messages.findOne({'code':'home_title'});
        return msg.value;

    },
    home_message: function(){
        var msg = Messages.findOne({'code':'home_desc'});
        return msg.value;

    }*/
    GSTBrief: function(){
        var GSTPost = Posts.findOne({title: 'GSTPost'});
        return GSTPost.content.substring(0,900) + " ...";
    }


});

Template.home.rendered = function(){


    !function(d,s,id){
        var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
        //if(!d.getElementById(id))
        //{
            js=d.createElement(s);
            js.id=id;
            js.src=p+"://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js,fjs);
        //}
    }(document,"script","twitter-wjs");
}