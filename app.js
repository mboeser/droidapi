var express     =   require("express");
var app         =   express();
var helmet      =   require('helmet');
var cors        =   require('cors');
var mongoose    =   require('mongoose');
var Schema      =   mongoose.Schema;
var mongoURI    =   process.env.MONGODB_URI || 'mongodb://localhost/droidapi';
var mongoDB     =   mongoose.connect(mongoURI).connection;

var db = mongoose.model('oid', new Schema({
    oid: { type: Mixed, require: true, index: {unique: true }},
    date: { type: Date, require: true, default: Date.now },
    ping: { type: Number, require: true, default: 0 }
}));

app.use(cors());
app.use(helmet());

app.get("/",function(req,res){
    var oid = req.query.oid;
    console.log(oid);
    if (!oid || isNaN(oid)) {
        res.send("hello world");
    } else {
    
    db.findOneAndUpdate(
        { oid: oid },
        { oid: oid, $inc: { ping: 1 }},
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
        function (err, data) {
        if (err) throw err;
        return data !== null ? res.send('1') : res.send('0');
        }
    );
    }
});

app.listen(process.env.PORT || 3000);
