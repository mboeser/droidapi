var express     =   require("express");
var app         =   express();
var mongoose    =   require('mongoose');
var Schema      =   mongoose.Schema;
var mongoURI    =   process.env.MONGODB_URI || 'mongodb://localhost/droidapi';
var mongoDB     =   mongoose.connect(mongoURI).connection;

var db = mongoose.model('oid', new Schema({
    oid: { type: Number, require: true, index: {unique: true }},
    date: { type: Date, require: true, default: Date.now },
    seq: { type: Number, require: true, default: 0 }
}));

app.get("/",function(req,res){
    var oid = req.query.oid;
    
    if (!oid) {
        res.send("hello world");
    } else {
    
    db.findOneAndUpdate(
        { oid: oid},
        { oid: oid, seq: 1},
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
        function (err, data) {
        if (err) throw err;
        return data !== null ? res.send(data) : res.json({"isDuplicate": false});
        }
    );
    }
});

app.listen(process.env.PORT || 3000);