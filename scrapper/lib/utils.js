var _ = require("underscore");

module.exports = {
    saveTags: function (db,t,callback) {
        db.collection('tags').findOne({'name':t},function (err,tag) {
            if(err){
                callback(err,null);
            }else if(tag){
                db.collection('tags').updateOne({
                    'name':t
                },{
                    $set: {
                        'count':tag.count+1
                    }
                });
                callback(null,"updated tag");
            }else{
                db.collection('tags').insertOne({
                    'name':t,
                    'count':1
                });
                callback(null,"saved new tag");
            }
        });
    },
    assembleTags: function (t1,t2) {
        return _.uniq(t1.concat(t2));
    },
    getTags: function (tags) {
        return tags.replace(/\s/ig, '').toLowerCase().split(/&|,|\//);
    }
};