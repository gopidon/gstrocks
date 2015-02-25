/**
 * Created by gopi on 1/8/15.
 */
Template.ncommentSubmit.created = function() { Session.set('ncommentSubmitErrors', {});
}
Template.ncommentSubmit.helpers({ errorMessage: function(field) {
    return Session.get('ncommentSubmitErrors')[field]; },
    errorClass: function (field) {
        return !!Session.get('ncommentSubmitErrors')[field] ? 'has-error' : '';
    } });
Template.ncommentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();
        var $body = $(e.target).find('[name=body]');
        console.log("NComment post Id:", template.data._id);
        var ncomment = {
            body: $body.val(),
            npostId: template.data._id
        };
        var errors = {};
        if (! ncomment.body) {
            errors.body = "Please write some content";
            return Session.set('ncommentSubmitErrors', errors); }
        Meteor.call('ncommentInsert', ncomment, function(error, ncommentId) { if (error){
            throwError(error.reason); } else {
            $body.val('');
        }
        }); }
});