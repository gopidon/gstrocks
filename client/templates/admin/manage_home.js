/**
 * Created by gopi on 11/27/14.
 */

Files = new Mongo.Collection(null);

Template.manageHome.created = function() {

    Session.set('manageHomeErrors', {});
    Session.set("FileUploadStatus", {status:false});

};

Template.manageHome.helpers(
    {
        errorMessage: function(field) {
            return Session.get('manageHomeErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('manageHomeErrors')[field] ? 'has-error' : '';
        },
        uploadCompleteClass: function(){
            return this.uploadProgress == 100? 'progress-bar-success':'';
        },
        files: function(){
            return Files.find();
        }
    }
);

Template.manageHome.events(
    {

        'submit form': function(e,t) {
            e.preventDefault();
            var messageId = this.homeMessages._id;
            var form = $(e.currentTarget);
            var title = form.find('#title').val(),
                desc = form.find('#desc').val();

            var homeMessages = {
                title: title,
                desc: desc
            };

           var errors = validateHomeMessages(homeMessages);
           if(errors.title || errors.desc)
            return Session.set("manageHomeErrors", errors);

            var newMessage = {
                messages: [{code:'title', value:title}, {code:'desc',value:desc}]
            };

            Messages.update(messageId, {$set: newMessage}, function(error)
            {
                if (error) {
                    throwError(error.reason);
                }
                else {

                }
            });
        },

        'change .btn-file :file': function (e,t){
            var fileList = t.find(':file').files;
            var fileTextInput = t.find("#fileTextInput");
            var file;
            if(fileList.length>0){
                file = fileList[0];
                if(file.type != 'image/jpeg' && file.type!='image/png'){
                    fileTextInput.value="";
                    Session.set("FileUploadStatus", {status:false});
                    throwError('Incorrect image format. Should be either jpeg or png!');

                }

                else if(file.size > 10*1024*1024){
                    fileTextInput.value="";
                    Session.set("FileUploadStatus", {status:false});
                    throwError('File size cannot be greater than 10MB');

                }
                else{
                    Session.set("FileUploadStatus", {status:true});
                    fileTextInput.value=file.name;
                    var mFile = new MeteorFile(file,{collection: Files});
                    Files.insert(mFile, function(err, res){
                        mFile.upload(file, "uploadFile", {size: 1024*1024},function(err){
                            if(err){
                                logger.error(err);
                            }
                            else{
                                logger.info("Upload Complete Braaaa!");
                                setTimeout(function(){
                                    Files.remove(mFile._id);
                                }, 1000);

                                Session.set("FileUploadStatus", {status:false});
                            }
                        });
                    })

                }
            }
            else{
                Session.set("FileUploadStatus", {status:false});
                fileTextInput.value="";
            }
            logger.info(Session.get("FileUploadStatus"));
        }
});


validateHomeMessages = function (messages)
{
    var errors = {};
    if (!messages.title)
        errors.title = "Please fill in the title";
    if (!messages.desc)
        errors.desc = "Please fill in the description";
    return errors;
};