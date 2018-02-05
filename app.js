var express=require('express');
var bodyParser=require('body-parser');
var cors=require('cors');
var mongoose=require('mongoose');
var Url=require('./models/shortUrl');
var encoder=require('./encoder/encode');
var app=express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname+'/public'));

app.set('view engine','ejs');

mongoose.connect('mongodb://localhost/Url',function(){
    console.log("database connected...");
});

app.get('/',function(req,res){
    res.render('home');
})

app.post('/shorten',function(req,res){
    var originalUrl=req.body.url;

    var regex=/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
    if(!regex.test(originalUrl)) { 
        console.log("ERROR !!!!") 
      res.render('error');
    }else{
        var shortenURL=encoder(originalUrl);
        var newUrl=new Url({
            originalUrl:originalUrl,
            shorterUrl:shorterUrl
        }).save(function(err){
            if(err){
                console.log(err);
            }
            var shortenFullUrl=req.protocol+'://localhost:1000/'+shortenUrl;
            res.render('short',{shortenUrl:shortenFullUrl});
        });
    }
})

// Find in database and redirect to originalUrl
app.get('/:shortenUrl',function(req,res){
    var shortenUrl=req.params.shortenUrl;
    Url.findOne({shortenUrl:shortenURL},function(err,data){
        if(err){
            console.log(err);
        }
        if(data==null){
            res.render('home');
        }else{
            if(data.originalUrl[0]=='w'){
                res.redirect('http://'+data.originalUrl);
            }else{
                res.redirect(data.originalUrl);
            }
        }
    })
})

app.listen(1000,function(){
    console.log('Server started..');
});