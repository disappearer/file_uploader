var express = require('express')
var app = express()
var path = require('path')
var formidable = require('formidable')
var fs = require('fs')

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res){
  fs.readdir('uploads', function(err,files){
    if(err) return console.error(err)
    var file_array = []
    files.forEach(function(file){
      if(!file.startsWith('.')){
        var filepath = path.join(__dirname,'uploads',file)
        var fsize = fs.statSync(filepath)['size']
        file_array.push({name: file, size: fsize})
      }
    })
    res.render('pages/index', {files: file_array})
  })
})

app.post('/upload', function(req,res){
  var form = new formidable.IncomingForm()
  form.uploadDir = path.join(__dirname, 'uploads')

  // when uploaded successfully, rename file to original name
  form.on('file', function(field, file){
    fs.rename(file.path, path.join(form.uploadDir, file.name))
  })

  form.on('error', function(err){
    console.log('An error has occured: \n' + err)
  })

  form.on('end', function() {
    res.end('success')
  })

  form.parse(req)
})

var port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('File upload app listening on port ' + port + '!')
})
