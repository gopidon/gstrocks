/**
 * Created by gopi on 5/23/15.
 */

Template.uploadFiles.events({
    /*'change input.any': function(event, template) {
        FS.Utility.eachFile(event, function(file) {
            FilesCFS.insert(file, function (err, fileObj) {
                if (err){
                    console.log(err);
                } else {
                    // handle success depending what you need to do
                    console.log(fileObj);
                }
            });
        });
    }*/
    'change input.any': FS.EventHandlers.insertFiles(FilesCFS, {
        metadata: function (fileObj) {
            return {
                uploadedBy: Meteor.userId()
            };
        },
        after: function (error, fileObj) {

        }
    })
});

Template.uploadFiles.helpers({
    uploadedFiles: function() {
       /* var files = FilesCFS.find({}).fetch();
        var file;
       for(var i=0 ; i<files.length; i++){
            file = files[i];
            for(var j in file){
                console.log(j+":"+file[j]);
            }

        }*/
        return FilesCFS.find({});
    }
});