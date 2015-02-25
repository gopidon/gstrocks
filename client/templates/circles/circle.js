/**
 * Created by gopi on 11/24/14.
 */
Template.circle.rendered = function(){
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});


}

Template.circle.events({
    'click li#link_juris': function(e){
        Session.set("sideMenuItem",'circle1_juris');
        Session.set("pageTitle",'Jurisdiction');
    },
    'click li#link_dashboard': function(e){
        Session.set("sideMenuItem",'circle1_dashboard');
        Session.set("pageTitle",'Dashboard');
    }
});