/**
 * Created by gopi on 2/18/15.
 */
UI.registerHelper('formatTime', function(context, options) {
    if(context)
        return moment(context).format('DD-MMM-YYYY, hh:mm A');
});

UI.registerHelper('formatDate', function(context, options) {
    if(context)
        return moment(context).format('DD-MMM-YYYY');
});

UI.registerHelper('pluralize', function(n, thing) { // fairly stupid pluralizer
    if (n === 1) {
        return '1 ' + thing;
    }
    else {
        return n + ' ' + thing + 's';
    }
});