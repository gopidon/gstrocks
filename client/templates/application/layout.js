/**
 * Created by gopi on 11/23/14.
 */
Template.layout.rendered = function() {
    // Initialize navgoco with default options
    $('#navCloseMe').on('click',function(e){
        alert("hello");
        e.preventDefault();
        $('body').removeClass('nav-expanded');
    });

    $(".main-menu").navgoco({
        caret: '<span class="caret"></span>',
        accordion: false,
        openClass: 'open',
        save: true,
        cookie: {
            name: 'navgoco',
            expires: false,
            path: '/'
        },
        slide: {
            duration: 300,
            easing: 'swing'
        }
    });
}

Template.layout.events({
    'click #menu-toggle': function(e, t){
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    },
    'click #menu-content .clickable a': function(e, t){
       // $("#wrapper").toggleClass("active");
    },
    'submit form#search': function(e) {
        e.preventDefault();
        var search =  $(e.currentTarget).find('#search').val();
        Router.go('search',{'searchLimit':5,'searchText':search});
        $("#wrapper").toggleClass("active");
    },
    'click #nav-expander': function(e, t){
        e.preventDefault();
        $('body').toggleClass('nav-expanded');
    },
    'click #navCloseMe': function(e, t){
        alert("Hello");
        e.preventDefault();
        $('body').removeClass('nav-expanded');
    }

});