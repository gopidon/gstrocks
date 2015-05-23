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