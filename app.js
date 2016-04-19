var express     =   require("express");
var app         =   express();
var mongoose    =   require('mongoose');
var Schema      =   mongoose.Schema;
var mongoURI    =   process.env.MONGOLAB_URI || 'mongodb://localhost/droidapi';
var mongoDB     =   mongoose.connect(mongoURI).connection;

var db = mongoose.model('oid', new Schema({
    oid: { type: Number, require: true, index: {unique: true }},
    date: { type: Date, require: true, default: Date.now }
}));

app.get("/",function(req,res){
    var oid = req.query.oid;
    db.findOneAndUpdate(
        { oid: oid},
        { oid: oid},
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
        function (err, data) {
        if (err) throw err;
        return data !== null ? res.send(data) : res.json({"isDuplicate": false});
        }
    );
});

app.listen(process.env.PORT || 3000);
console.log("Listening to PORT 3000");