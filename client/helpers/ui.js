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