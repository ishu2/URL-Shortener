var express=require('express');
var bodyParser=require('body-parser');
var cors=require('cors');
var mongoose=require('mongoose');
var shortUrl=require('./models/shortUrl');
var app=express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname+'/public'));

app.set('view engine','ejs');

mongoose.connect('mongodb://localhost/shortUrl');

app.get('/new',function(req,res){
    res.render('home');
})

app.post('/new',function(req,res,next){
    var urlToShorten=req.params.urlToShorten;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex=expression;
    if(regex.test(urlToShorten)===true){
       var short=Math.floor(Math.random()*100000).toString();
       
       var data=new shortUrl({
           originalUrl: urlToShorten,
           shorterUrl: short
       });

       data.save(err=>{
           if(err){
               return res.send("ERROR!!");
           }
       });

     res.render('short',{value:data.shorterUrl});
    }
    var data=new shortUrl({
        originalUrl: urlToShorten,
        shorterUrl: 'InvalidURL'
    });
    res.json(data.shorterUrl);
});

// Find in database and redirect to originalUrl
app.get('/:urlToForward',function(req,res,next){
    var shorterUrl=req.params.urlToForward;

    shortUrl.findOne({'shorterUrl':shorterUrl},function(err,data){
        if(err) return res.send('Error!!');
        var re=new RegExp('^(http|https)://','i');
        var str=data.originalUrl;
        if(re.test(str)){
            res.redirect(301,data.originalUrl);
        }else{
            res.redirect(301,'http://'+data.originalUrl);
        }
    });
})

app.listen(process.env.PORT || 1000,function(){
    console.log('Server started..');
});