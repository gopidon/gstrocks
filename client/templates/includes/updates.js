/**
 * Created by gopi on 11/23/14.
 */
Template.updates.rendered = function(){
    if (!this.rendered){
        // run my code
     Meteor.setTimeout(function(){
         this.$(".demo").bootstrapNews({
             newsPerPage: 5,
             navigation: true,
             autoplay: true,
             direction:'up', // up or down
             animationSpeed: 'normal',
             newsTickerInterval: 4000, //2 secs
             pauseOnHover: true,
             onStop: null,
             onPause: null,
             onReset: null,
             onPrev: null,
             onNext: null,
             onToDo: null
         });

     }, 1000)

        this.rendered = true;
    }





};