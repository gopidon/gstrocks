/**
 * Created by gopi on 11/19/14.
 */



requireLogin = function()
{
    if (! Meteor.user()) {
        if (Meteor.loggingIn())
        {
            this.render(this.loadingTemplate);
        }
        else {
            this.render('accessDenied');
        }
    }
    else {
        this.next();
    }
}

requireAdmin = function() {
    var loggedInUser = Meteor.user();
    if (!loggedInUser) {
        if (Meteor.loggingIn())
        {
            this.render(this.loadingTemplate);
        }
        else {
            this.render('accessDenied');
        }
    } else {
        //console.log(Roles.getRolesForUser(loggedInUser));
        //console.log(Roles.userIsInRole(loggedInUser, 'admin'));
        if (Roles.userIsInRole(loggedInUser, 'admin')) {
            this.next()
        }
        else{
            this.render('accessDenied');
        }

    }
}

isUserAdmin = function(){
    var loggedInUser = Meteor.user();
    if (Roles.userIsInRole(loggedInUser, 'admin')) {
        return true;
    }
    else{
        return false;
    }
}

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { return Meteor.subscribe('facebook_email'); }

});

Router.route('/', {
    name: 'home',
    waitOn: function() {
        return [Meteor.subscribe('HomeNewsPosts'),Meteor.subscribe('GSTPost'), Meteor.subscribe('top5Posts')];
    },
    data: function() {

        return {
            HomeNewsPosts: NPosts.find({}, {sort: {submitted: -1}, limit: 3}),
            top5Posts: Posts.find({visible: true}, {sort: {submitted: -1}, limit: 5})
        };

    }
});

Router.route('/adminsignin', {name: 'adminsignin'});

Router.route('/signup', {name: 'signup'});

Router.route('/contact', {name: 'contact'});


FbsListController = RouteController.extend({ template: 'fbsList',
    increment: 5,

    fbsLimit: function() {
        return parseInt(this.params.fbsLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: this.sort,limit: this.fbsLimit()};
    },
    subscriptions: function() {
            this.fbsSub = Meteor.subscribe('Fbs', this.findOptions());


    },
    fbs: function() {
        return Fbs.find({},this.findOptions());
    },
    data: function() {

        var hasMore = this.fbs().count() === this.fbsLimit();
        return {
            Fbs: this.fbs(),
            ready: this.fbsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewFbsController = FbsListController.extend(
    {
        sort: {submitted:-1, _id: -1},
        nextPath: function() {
            return Router.routes.newFbs.path({fbsLimit: this.fbsLimit() + this.increment});
        }

    });
Router.route('/newFbs/:fbsLimit?', {name: 'newFbs'});



Router.route('/resources', {
    name: 'resources',
    waitOn: function() {
        return [Meteor.subscribe('GSTPost')];
    },
    data: function() {

        return {
            GSTPost: Posts.find({title: 'GSTPost'})
        };

    }


});
Router.route('/manageHome', {
    name: 'manageHome',
    waitOn: function() {
        return [Meteor.subscribe('HomeMessages')];
    },
    data: function() {

        return {
            homeMessages: Messages.findOne({screen:"home"})

        };

    }
});
Router.route('/postSubmit', {name: 'postSubmit'});
Router.route('/npostSubmit', {name: 'npostSubmit'});


Router.route('/circle/:id',
    {name: 'circle',

        action: function() {



            // render yieldTemplates
            this.render(Session.get('sideMenuItem'), {to: 'sideMenuItem'});

            this.render('circle');
        },
        data: function() {
            return {
                circle: this.params.id,
                pageTitle: Session.get('pageTitle')
            }
        }
    }

);

PostsListController = RouteController.extend({ template: 'postsList',
    increment: 5,

    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    postsSearchParams: function() {
        if(this.params.postsSearch){
            return {$or: [
                {title: new RegExp(this.params.postsSearch, 'i')},
                {content: new RegExp(this.params.postsSearch, 'i')}
            ]};
        }
        else{
            return {};
        }
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.postsLimit()};
    },
    subscriptions: function() {
        if(isUserAdmin()){
            this.postsSub = Meteor.subscribe('allposts', this.params.postsSearch, this.findOptions());
        }
        else{
            this.postsSub = Meteor.subscribe('posts', this.params.postsSearch, this.findOptions());
        }

    },
    posts: function() {
        return Posts.find(this.postsSearchParams(),this.findOptions());
    },
    data: function() {

        var hasMore = this.posts().count() === this.postsLimit();
        return {
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPostsController = PostsListController.extend(
    {
        sort: {submitted: -1, _id: -1},
        nextPath: function() {
            return Router.routes.newPosts.path({postsSearch: this.params.postsSearch, postsLimit: this.postsLimit() + this.increment});
        }

});
Router.route('/new/:postsLimit?/:postsSearch?', {name: 'newPosts'});

Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
        return [Meteor.subscribe('singlePost', this.params._id), Meteor.subscribe('comments', this.params._id)];
    },
    data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});

Router.onBeforeAction(requireAdmin, {only: ['manageHome','postSubmit','npostSubmit']});




DPostsListController = RouteController.extend({ template: 'dpostsList',
    increment: 5,

    dpostsLimit: function() {
        return parseInt(this.params.dpostsLimit) || this.increment;
    },
    dpostsSearchParams: function() {
        if(this.params.dpostsSearch){
            return {$or: [
                {title: new RegExp(this.params.dpostsSearch, 'i')},
                {content: new RegExp(this.params.dpostsSearch, 'i')}
            ]};
        }
        else{
            return {};
        }
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.dpostsLimit()};
    },
    subscriptions: function() {
        this.dpostsSub = Meteor.subscribe('dposts', this.params.dpostsSearch,this.findOptions());
    },
    dposts: function() {
        return DPosts.find(this.dpostsSearchParams(),this.findOptions());
    },
    data: function() {

        var hasMore = this.dposts().count() === this.dpostsLimit();
        return {
            dposts: this.dposts(),
            ready: this.dpostsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewDPostsController = DPostsListController.extend(
    {
        sort: {submitted: -1, _id: -1},
        nextPath: function() {
            return Router.routes.newDPosts.path({dpostsSearch: this.params.dpostsSearch, dpostsLimit: this.dpostsLimit() + this.increment});
        }

    });

Router.route('/newdposts/:dpostsLimit?/:dpostsSearch?', {name: 'newDPosts'});

Router.route('/dposts/:_id', {
    name: 'dpostPage',
    waitOn: function() {
        return [Meteor.subscribe('singleDPost', this.params._id), Meteor.subscribe('dcomments', this.params._id)];
    },
    data: function() { return DPosts.findOne(this.params._id); }
});

Router.route('/dposts/:_id/edit', {
    name: 'dpostEdit',
    waitOn: function() {
        return Meteor.subscribe('singleDPost', this.params._id);
    },
    data: function() { return DPosts.findOne(this.params._id); }
});



Router.route('/newDiscussion', {name: 'newDiscussion', template: 'dpostSubmit'});





NPostsListController = RouteController.extend({ template: 'npostsList',
    increment: 5,

    npostsLimit: function() {
        return parseInt(this.params.npostsLimit) || this.increment;
    },
    npostsSearchParams: function() {
        if(this.params.npostsSearch){
            return {$or: [
                {title: new RegExp(this.params.npostsSearch, 'i')},
                {content: new RegExp(this.params.npostsSearch, 'i')}
            ]};
            //return {title: new RegExp(this.params.npostsSearch, 'i')}
        }
        else{
            return {};
        }
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.npostsLimit()};
    },
    subscriptions: function() {
        this.npostsSub = Meteor.subscribe('nposts',this.params.npostsSearch,this.findOptions());
    },
    nposts: function() {
        return NPosts.find(this.npostsSearchParams(),this.findOptions());
    },
    data: function() {

        var hasMore = this.nposts().count() === this.npostsLimit();
        return {
            nposts: this.nposts(),
            ready: this.npostsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewNPostsController = NPostsListController.extend(
    {
        sort: {submitted: -1, _id: -1},
        nextPath: function() {
            return Router.routes.newNPosts.path({npostsSearch: this.params.npostsSearch,npostsLimit: this.npostsLimit() + this.increment});
        }

    });

Router.route('/newnposts/:npostsLimit?/:npostsSearch?', {name: 'newNPosts'});

Router.route('/nposts/:_id', {
    name: 'npostPage',
    waitOn: function() {
        return [Meteor.subscribe('singleNPost', this.params._id), Meteor.subscribe('ncomments', this.params._id)];
    },
    data: function() { return NPosts.findOne(this.params._id); }
});

Router.route('/nposts/:_id/edit', {
    name: 'npostEdit',
    waitOn: function() {
        return Meteor.subscribe('singleNPost', this.params._id);
    },
    data: function() { return NPosts.findOne(this.params._id); }
});

Router.route('/test', {
    name: 'test',
    waitOn: function() {

    },
    data: function() {

    }
});

// Server side routes

Router.route('/feed.xml/:dir/:file', {
    where: 'server',
    name: 'rss',
    action: function() {
        /*var fs = Npm.require('fs');
        var path = Npm.require('path');
        var basepath = process.env.PWD;
        console.log("Base:"+basepath);
        var imagePath = process.env['PWD']+'/.uploads/'+this.params.dir+'/'+this.params.file;
        console.log(imagePath);
        var file = fs.readFileSync(imagePath);*/
        var headers = {
            //'Content-type': 'image/jpg'
        };

        var file = Assets.getBinary('uploads/'+this.params.dir+'/'+this.params.file);

        this.response.writeHead(200, headers);
        this.response.end(new Buffer(file));
    }
});







