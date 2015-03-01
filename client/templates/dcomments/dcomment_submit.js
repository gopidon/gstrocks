/**
 * Created by gopi on 1/8/15.
 */
Template.dcommentSubmit.created = function() { Session.set('dcommentSubmitErrors', {});
};
Template.dcommentSubmit.helpers({ errorMessage: function(field) {
    return Session.get('dcommentSubmitErrors')[field]; },
    errorClass: function (field) {
        return !!Session.get('dcommentSubmitErrors')[field] ? 'has-error' : '';
    } });
Template.dcommentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();
        var $body = $(e.target).find('[name=body]');
        var dcomment = {
            body: $body.val(),
            dpostId: template.data._id
        };
        var errors = {};
        if (! dcomment.body) {
            errors.body = "Please write some content";
            return Session.set('dcommentSubmitErrors', errors); }
        Meteor.call('dcommentInsert', dcomment, function(error, dcommentId) { if (error){
            throwError(error.reason); } else {
            $body.val('');
        }
        }); }
});