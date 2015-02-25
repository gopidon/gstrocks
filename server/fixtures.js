/**
 * Created by gopi on 11/26/14.
 */
Meteor.startup(function () {
    var admin = Meteor.users.findOne({emails: {$elemMatch: {address: "hydaudit3@gmail.com"}}});

    if (!admin) {
        //Seed one
        console.log('Seeding admin user........');
        var user = Accounts.createUser({email: 'hydaudit3@gmail.com', profile:{name: 'Gopi Don'}, password: 'cbecaudit'});
        console.log('Assigning admin role....');
        Roles.addUsersToRoles(user, ['admin']);
        console.log('Seeded admin user.......');
    }
    else{
        logger.info("Admin user already seeded..");
    }
});

/* Seed any messages here */

/*var msg = Messages.findOne({"screen":"home"});
if(!msg){
    Messages.insert({screen:"home",messages:[{code:"title", value:"Edit title"},{code:"desc", value:"Edit desc"}]});
}*/