/***
 * Created by gopi on 11/26/14.
 */
Errors = new Mongo.Collection(null);

throwError = function(message) {
    Errors.insert({message: message})
}
