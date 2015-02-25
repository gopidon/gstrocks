/**
 * Created by gopi on 11/23/14.
 */
Template.circle_sidemenu.events({
    'click li#link_juris': function(e){
        Session.set("showMenu",'circle1_juris');
    },
    'click li#link_dashboard': function(e){
        Session.set("showMenu",'circle1_dashboard');
    }
});