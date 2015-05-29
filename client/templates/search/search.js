/**
 * Created by gopi on 5/28/15.
 */
Template.search.onCreated(function () {
    console.log("Created!");
});

Template.search.onCreated(function () {
    console.log("Rendered!");
});

Template.search.helpers(
    {
        data: function(){
            return Session.get("data");
        },
        showSpinner: function(){
            return Session.get("showSpinner");
        }
    }
);