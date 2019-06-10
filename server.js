var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wolfpack');

var WolfpackSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    gender: {type: String, required: true, maxlength: 6, minlength: 4},
    position: {type: String, required: true, maxlength: 60, minlength: 3},
    image: {type: String, required: true, minlength: 3}
}, {timestamps: true});
mongoose.model('Wolf', WolfpackSchema);
var Wolf = mongoose.model('Wolf');

// this route shows the home page with each of the wolves
app.get('/', function(req, res){
    Wolf.find({}, function(err, wolves){
        console.log(wolves);
        res.render('index', {all_wolves: wolves});
    });
});

// this route shows each individual wolf and their characteristics
app.get('/wolfpack/:id', function(req, res){
    Wolf.findOne({_id:req.params.id}, function(err, wolves){
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(wolves);
        res.render('show', {wolf: wolves});
    });
});

// this route shows the form for adding wolves to the pack
app.get('/new', function(req, res){
    res.render('form');
});

// this is the post route for carrying out the action of creating new wolves for the pack
app.post('/wolfpack', function(req, res){
    console.log("POST DATA", req.body);
    var newWolf = new Wolf();
    newWolf.name = req.body.name;
    newWolf.gender = req.body.gender;
    newWolf.position = req.body.position;
    newWolf.image = req.body.image;
    newWolf.save(function(err){
        if(err) {
            console.log("something went wrong");
        }
        else {
            console.log("successfully added quote!");
            res.redirect('/');
        }
    })
});

app.get('/wolfpack/edit/:id', function(req, res){
    Wolf.findOne({_id:req.params.id}, function(err, wolves){
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(wolves);
        res.render('edit', {wolf: wolves});
    });
});

app.post('/edit', function(req, res){
    console.log("POST DATA", req.body);
    var wolf = Wolf.find({id:req.params.id});
    wolf.name = req.body.name;
    wolf.gender = req.body.gender;
    wolf.position = req.body.position;
    wolf.image = req.body.image;
    wolf.save(function(err){
        if(err) {
            console.log("something went wrong");
        }
        else {
            console.log("successfully added quote!");
            res.redirect('/');
        }
    })
});

app.get('/wolfpack/destroy/:id', function(req,res){
    Wolf.findOne({_id: req.params.id}, function(err,wolves){
        wolves.remove(function(err){
            if(err){
                console.log("something went wrong", err);
            } else {
                console.log("successfully deleted")
                res.redirect('/');
            }
        });
    });
});

app.listen(8000, function () {
    console.log("listening on port 8000");
});