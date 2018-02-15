let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')
let mongoose = require('mongoose')
let app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './static')))

app.set('views',path.join(__dirname, './views'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/tasksAPI')

let TaskSchema = new mongoose.Schema({
    title:{type: String},
    description:{type: String, default:''},
    completed: {type:Boolean, default:false},
    created_at:{type:Date, default: Date.now()},
    updated_at:{type:Date, default:Date.now()}
})

let Task = mongoose.model('Task', TaskSchema)


app.get('/', function(req,res){
    res.send('root')
})


app.get('/task',function(req, res){
    Task.find({}, function (err, data) {
        if (err) {
            res.json({error: err})
        } else {
            res.json({
                db: data
            })
        }
    })
})


app.post('/task', function(req,res){
    let task = new Task({
        title : req.body.title,
        description: req.body.description
    })
    task.save(function(err){
        if(err){
            res.json({error:err})
        }else{
            res.redirect('/')
        }
    })
})

app.get('/task/:id', function(req, res){
    Task.find({_id:req.params.id}, function(err,data){
        if (data.length === 1) {
            res.json({db:data})
        }else{
            res.json({message:'something is wrong with the ID',error:err})
        }
    })
})

app.put('/task/:id',function(req,res){
    Task.find({_id:req.params.id}, function(err, data){
        if(err){
            res.send('failed')
        }else{
            data[0].title = req.body.title;
            data[0].description = req.body.description;
            data[0].updated_at = Date.now();
            
            data[0].save(function(err){
                if(err){
                    res.send(err)
                }else{
                    res.redirect('/')
                }
            })
           
        }
    })
})

app.delete('/task/:id', function(req, res){
    Task.remove({_id:req.params.id}, function(err){
        if(err){
            res.send(err)
        }else{
            res.redirect('/')
        }
    })
})






app.listen(8000)