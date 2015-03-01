/**
 * Created by gopi on 2/6/15.
 */


    SearchSource.defineSource('NewsPosts', function(searchText, options) {
        var options = options || {};

        if(searchText) {
            var regExp = buildRegExp(searchText);
            var selector = {$or: [
                {title: regExp},
                {content: regExp}
            ]};

            return NPosts.find(selector, options).fetch();
        } else {
            return NPosts.find({}, options).fetch();
        }
    });

    function buildRegExp(searchText) {
        // this is a dumb implementation
        var parts = searchText.trim().split(/[ \-\:]+/);
        var searchRegExp = new RegExp("(" + parts.join('|') + ")", "ig");
        return searchRegExp;
    }
