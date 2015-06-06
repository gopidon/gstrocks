/**
 * Created by gopi on 11/23/14.
 */
Template.layout.rendered = function() {
    // Initialize navgoco with default options
    $('#nav-close').on('click',function(e){
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
    'click #menu-content li.clickable a': function(e, t){
        $('body').toggleClass('nav-expanded');
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
    }

});
