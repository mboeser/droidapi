require('newrelic');
var express     =   require("express");
var app         =   express();
var helmet      =   require('helmet');
var cors        =   require('cors');
var mongoose    =   require('mongoose');
var Schema      =   mongoose.Schema;
var mongoURI    =   process.env.MONGODB_URI || 'mongodb://localhost/droidapi';
var mongoDB     =   mongoose.connect(mongoURI).connection;

var db = mongoose.model('oid', new Schema({
    oid: { type: Number, require: true, index: {unique: true }},
    date: [{ type: Date, require: true, default: Date.now }],
    ping: { type: Number, require: true, default: 0 }
}));

app.use(cors());
app.use(helmet());

//mongoose.set('debug', true)

app.get("/",function(req,res){
    var oid = Number(req.query.oid);

    if (!oid || isNaN(oid)) {
        res.send("hello world");
    } else {
    
    db.findOneAndUpdate(
        { oid: oid },
        { oid: oid, $push:{ date: Date.now() }, $inc: { ping: 1 }},
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
        function (err, data) {
        if (err) throw err;
        return data !== null ? res.send('1') : res.send('0');
        }
    );
    }
});

app.listen(process.env.PORT || 3000);
