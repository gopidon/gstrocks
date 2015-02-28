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
        return GSTPost.content.substring(0,600) + " ...";
    }
});

Template.home.rendered = function(){

    if(!this._rendered) {
        this._rendered = true;


    }



}