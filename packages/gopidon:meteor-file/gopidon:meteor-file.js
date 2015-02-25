// Write your package code here!

function defaultZero(value){
    _.isUndefined(value) ? 0: value;
}

MeteorFile = function(doc, options){
    options = options || {};
    doc = doc || {};
    this.name = doc.name;
    this.size = doc.size;
    this.type = doc.type;
    this.data = doc.data;

    this.start = defaultZero(doc.start);
    this.end = defaultZero(doc.end);
    this.bytesRead = defaultZero(doc.bytesRead);
    this.bytesUploaded = defaultZero(doc.bytesUploaded);


    this.collection = options.collection;
    this.readProgress = defaultZero(doc.readProgress);
    this.uploadProgress =  defaultZero(doc.uploadProgress);
    this._id = doc._id || Meteor.uuid();
}

MeteorFile.fromJSONValue = function(value){
    return new MeteorFile({
        name: value.name,
        size: value.size,
        type: value.type,
        data: EJSON.fromJSONValue(value.data),
        start: value.start,
        end: value.end,
        bytesRead: value.bytesRead,
        bytesUploaded: value.bytesUploaded,

        readProgress: value.readProgress,
        uploadProgress: value.uploadProgress,
        _id: value._id
    });
}

MeteorFile.prototype = {
    constructor: MeteorFile,


    typeName: function(){
        return "MeteorFile";
    },

    equals: function(other){
      return
        this._id == other._id;
    },

    clone: function(){
        return new MeteorFile({
            name: this.name,
            size: this.size,
            type: this.type,
            data: this.data,
            start: this.start,
            end: this.end,
            bytesRead: this.bytesRead,
            bytesUploaded: this.bytesUploaded,
            readProgress: this.readProgress,
            uploadProgress: this.uploadProgress,

            _id: this._id
        });
    },

    toJSONValue: function(){
        return {
            name : this.name,
            size: this.size,
            type: this.type,
            data: EJSON.toJSONValue(this.data),
            start: this.start,
            end: this.end,
            bytesRead: this.bytesRead,
            bytesUploaded: this.bytesUploaded,
            readProgress: this.readProgress,
            uploadProgress: this.uploadProgress,
            _id: this._id
        }
    }
}

EJSON.addType("MeteorFile", MeteorFile.fromJSONValue);

if(Meteor.isClient){
    _.extend(MeteorFile.prototype, {
        read: function(file, options, callback){
            var self = this;
            var reader = new FileReader;

            options = options || {};
            callback = callback || function(){};

            var chunkSize = options.size || 1024 * 1024;

            self.size = file.size;
            self.start = self.end;
            self.end += chunkSize;

            if(self.end > self.size){
                self.end = self.size
            }

            reader.onload = function(){
               self.bytesRead += self.end - self.start;
               self.data = new Uint8Array(reader.result);
                self._setStatus();
                callback(null, self);
            }

            reader.onerror = function(){
                self._setStatus(reader.error);
                callback(reader.error);
            }

            if(self.end - self.start > 0){
                var blob = file.slice(self.start, self.end);
                reader.readAsArrayBuffer(blob);
            }

            return self;

        },

        rewind: function(){
            this.data = null;
            this.start = 0;
            this.end = 0;
            this.bytesRead = 0;
            this.bytesUploaded = 0;
            this.readProgress = 0;
            this.uploadProgress = 0;
        },

        upload: function(file, method, options, callback){
            var self = this;
            self.rewind();

            self.size = file.size;

            var readNext = function(){
                if(self.bytesUploaded<self.size){
                    self.read(file,options,function(err,res){
                        if(err){
                            callback && callback(err)
                        }
                        else{
                            Meteor.apply(
                                method,
                                [self].concat(options.params || []),
                                {
                                    wait: true
                                },
                                function(err){
                                    if(err){
                                        self._setStatus(err);
                                        callback && callback(err)
                                    }
                                    else{
                                        self.bytesUploaded += self.data.length;
                                        self._setStatus();
                                        readNext();
                                    }
                                }
                            );
                        }

                    });
                }
                else{
                    self._setStatus();
                    callback && callback(null,self);
                }

            }

            readNext();
            return this;
        },

        _setStatus: function(err){
            this.readProgress = Math.round(this.bytesRead/this.size * 100);
            this.uploadProgress = Math.round(this.bytesUploaded/this.size * 100);

            if(err){
                this.status = err.toString();
            }
            else if(this.uploadProgress==100){
                this.status = "Upload Complete"
            }
            else if(this.uploadProgress>0){
                this.status = "File loading"
            }
            else if(this.readProgress>0){
                this.status = "File loading"
            }

            if(this.collection){
                this.collection.update(this._id, {
                        $set:{
                            status: this.status,
                            uploadProgress: this.uploadProgress,
                            readProgress: this.readProgress
                        }
                    }
                );
            }
        }
    });

    _.extend(MeteorFile, {
        read: function(file, options, callback){
            callback = callback || function(){};
            return new MeteorFile(file).read(file, options, callback);
        },
        upload: function(file, method, options, callback){
            return new MeteorFile(file).upload(file, method, options, callback);
        }
    })
}

if(Meteor.isServer){
    var fs = Npm.require('fs');
    var path = Npm.require('path');
    _.extend(MeteorFile.prototype,{
        save: function(dirPath, options){
            var buffer = new Buffer(this.data);
            var filePath = path.join(dirPath, this.name);

            var mode = this.start==0 ? 'w' : 'a';
            var fd = fs.openSync(filePath, mode);
            fs.writeSync(fd,buffer,0,buffer.length, this.start);
            fs.closeSync(fd);
        }
    });

    Meteor.methods({
        'uploadFile': function (meteorFile) {
         check(meteorFile, MeteorFile);
         meteorFile.save('/Users/gopi/tmp/uploads',{});
         }
    });
}