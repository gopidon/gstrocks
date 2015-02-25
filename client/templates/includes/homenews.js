/**
 * Created by gopi on 2/2/15.
 */
Template.homenews.helpers({
    briefContent: function(){
        return this.content.substring(0,100) + " ...";
    }

});