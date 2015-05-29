/**
 * Created by gopi on 5/26/15.
 */

if(Meteor.isServer){
    Future = Meteor.npmRequire("fibers/future");
    elasticsearch = Meteor.npmRequire('elasticsearch');
    esClient = new elasticsearch.Client({
        host: process.env.ELASTIC_URL,
        log: {
            type: 'file',
            level: process.env.ES_LOG_LEVEL,
            path: process.env.UPLOAD_DIR+'/logs/es/es.log'
        }
    });

    Meteor.methods({
        postsSearch: function(queryString, limit){
            check(queryString, String);
            check(limit, Number);

            var future = new Future();
            esClient.search({
                index: 'gst',
                type : 'posts',
                body: {
                    "from" : 0, "size" : limit,
                    query: {
                        "wildcard" : {"title": queryString+"*"}
                    },
                    "sort": { "submitted": { "order": "desc" }}
                }
            }, function (error, response) {
                future.return(response.hits.hits);
            });
            return future.wait();
        },

        globalSearch: function(queryString, limit){
            check(queryString, String);
            check(limit, String);
            var future = new Future();
            queryString = "*" + queryString + "*";
            console.log(queryString);
            esClient.search({
                index: 'gst',
                body: {
                    "from" : 0,
                    "size" : limit,
                    "fields":["title","highlight","name","url"],
                    "query": {
                        "bool": {
                            "should": [
                                { "wildcard": { "title":  queryString }},
                                { "wildcard": { "content": queryString }},
                                { "wildcard": { "file": queryString }}
                            ]
                        }
                    },
                    "highlight" : {
                        "fields" : {
                            "content" : {},
                            "file":{}
                        }
                    }
                }
            }, function (error, response) {
                future.return(response.hits.hits);
            });
            return future.wait();
        }
    });

}