/**
 * Created by gopi on 5/23/15.
 */

var fileStore = new FS.Store.GridFS("filestore");

FilesCFS = new FS.Collection("filescfs", {
    stores: [fileStore]
});

FilesCFS.deny({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    },
    download: function(){
        return false;
    }
});

FilesCFS.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    },
    download: function(){
        return true;
    }
});

if(Meteor.isServer){
    Meteor.methods({
        indexFileInES: function(id) {
            var future = new Future();
            check(id, String);
            var doc = FilesCFS.findOne({_id: id});
            var readStream = doc.createReadStream();
            var buffer = new Buffer(0);
            readStream.on('data', function(chunk) {
                buffer = Buffer.concat([buffer, chunk]);
            });

            readStream.on('end', function() {
                var base64 = buffer.toString('base64');
                //console.log("Base64", base64);

                esClient.create({
                    index: 'gst',
                    type: 'resource',
                    id: id,
                    body: {
                        "file" : {
                            "_content": base64,
                            "_indexed_chars" : -1
                        }
                    }
                }, function (error, response) {
                    // This is a non meteor callback! You cant put meteor code here like updating a collection (FileCFS object above)
                    // To do that u need wrap/bind or whatever. Check
                    if (error) {
                        logger.error("Error indexing file: "+id);
                        future.throw(error);
                    }
                    else{
                        logger.info("Indexed file "+id + " successfully");
                        future.return(response);
                    }
                });

            });
            return future.wait();
        }
    });
}

