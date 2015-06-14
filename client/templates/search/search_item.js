/**
 * Created by gopi on 5/28/15.
 */

Template.searchItem.helpers(
    {
        isResource: function(){
            return this._type == "resource";
        },
        isPost: function(){
            return this._type == "post";
        },
        isDPost: function(){
            return this._type == "dpost";
        },
        isNPost: function(){
            return this._type == "npost";
        }
    }
);