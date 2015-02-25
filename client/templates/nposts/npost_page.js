/**
 * Created by gopi on 11/27/14.
 */
Template.npostPage.rendered = function(){


}

Template.npostPage.helpers(
    {

        ncomments: function() {
            return NComments.find({npostId: this._id});
        }
    });