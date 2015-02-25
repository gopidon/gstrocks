/**
 * Created by gopi on 2/7/15.
 */
var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'content'];

PackageSearch = new SearchSource('NewsPosts', fields, options);
