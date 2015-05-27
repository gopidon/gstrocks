/**
 * Created by gopi on 5/27/15.
 */
printObject = function(object){
    console.log("Printing object .....");
    console.log("Type:", typeof object);
    for(var key in object){
        console.log(key, ":", object[key]);
    }
    console.log("End printing object .....");
}

printObjectProperties = function(object){
    console.log("Printing object .....");
    console.log("Type:", typeof object);
    Object.getOwnPropertyNames(object).forEach(function(val, idx, array) {
        console.log(val, ':', object[val]);
    });
    console.log("End printing object .....");
}

