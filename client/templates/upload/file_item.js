/**
 * Created by gopi on 5/26/15.
 */
Template.fileItem.events({
    'click #indexFile': function(e, t) {
        e.preventDefault();
        var doc = FilesCFS.findOne({_id: this._id});
        doc.update({
            $set:{
                "index_status": "Indexing ..."
            }
        });
        Meteor.call('indexFileInES', this._id, function(error, result) {
            if (error) {
                //printObjectProperties(error);
                doc.update({
                    $set:{
                        "index_status": "Error Indexing ..."
                    }
                });
                throwError(error);
            }
            else{
                doc.update({
                    $set:{
                        "index_status": "Indexed"
                    }
                });
            }
        });

    },
    'click #deleteFile': function(e, t) {
        e.preventDefault();
        Meteor.call('deleteFile', this._id, function(error, result) {
            if (error) {
                //printObjectProperties(error);
                throwError(error);
            }
            else{
                console.log("Deleted successfully!");
            }
        });

    }
});