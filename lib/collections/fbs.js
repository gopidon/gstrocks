/**
 * Created by gopi on 2/17/15.
 */
Fbs = new Mongo.Collection('Fbs');

validateFb = function (fb)
{
    var errors = {};
    if (!fb.name)
        errors.name = "Please fill in the Name";
    if (!fb.suggestion)
        errors.suggestion = "Please fill in the suggestion";
    return errors;
}

Meteor.methods({
    fbInsert: function(postAttributes) {

        check(postAttributes, {
            name: String,
            suggestion: String
        });

        var errors = validateFb(postAttributes);
        if (errors.name || errors.suggestion)
            throw new Meteor.Error('invalid-fb', "You must set the name and suggestion for your feedback post");

        var user = Meteor.user();
        if(user) {
            postAttributes = _.extend(postAttributes, {
                userId: user._id,
                author: user.profile.name,
                submitted: new Date()
            });
        }
        else{
            postAttributes = _.extend(postAttributes, {
                submitted: new Date()
            });
        }
        var fbId = Fbs.insert(postAttributes);

        return {
            _id: fbId
        };
    }




});


