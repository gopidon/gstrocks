/**
 * Created by gopi on 2/6/15.
 */
Template.test.helpers({
    packages: function() {
        //console.log("Inside getPackages");

        return PackageSearch.getData({
            sort: {submitted: -1}
        });
    },

    isLoading: function() {
        return PackageSearch.getStatus().loading;
    },

    printHello: function(){
        return "Hello!!!!";
    }
});


Template.test.events({
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        var options = {sort: {submitted: -1, id:-1}, limit: 20};
        PackageSearch.search(text, options);
    }, 200)
});