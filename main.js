
const express = require('express')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });
//const upload = require('./multer');
const cors = require('cors')

const app = express()
const port = process.env.PORT 
app.use(cors())
const ttl= [
  {
    lable: 'now',
    min: 0
  },{
    lable: '5 Min',
    min: ( 5 * 60 * 1000)
  },{
    lable: '30 Min',
    min: ( 30 * 60 * 1000)
  },{
    lable: '1 Hour',
    min: ( 60 * 60 * 1000)
  },{
    lable: '2 Hours',
    min: ( 120 * 60 * 1000)
  },{
    lable: '6 Hours',
    min: ( 6 * 60 * 60 * 1000)
  },
]
//Return Milliseconds of TimeToLife
function getTtl(lable){
  let ttls = -1
  for(let i =0;i< ttl.length;i++){
    if(ttl[i].lable == lable){
      ttls = ttl[i].min
      i = ttl.length
    }
  }
  return ttls
}
function deleteOld(){
  const now= Date.now()
  fs.readdir(path.join(__dirname, process.env.STORAGE+ '/') , (err, files) => {
    files.forEach(file => {
      let fn = parseInt( file.split('++')[2] )
      if(fn < now){
        fs.unlink(path.join(__dirname, process.env.STORAGE+ '/'+file),function(err){
         if(err)console.log(err)
        })
      }
    })
  })
}

const intervalID = setInterval(deleteOld, process.env.ttlCheck * 1000);

app.post('/api/upload', upload.fields([{ name: 'file' }]), (req, res, next) => {
    try {
      const file = req.files['file'][0];
//      console.log('BODY: '+req.body.ttl)
      const ttlVal = getTtl(req.body.ttl)
      if(ttlVal == -1){
        res.json({err: 'TTL Wrong'})
        return -1
      }
      // Save the encrypted file
      let time = Date.now()+ttlVal
      const filePath = path.join(__dirname, 'uploads', file.originalname+"++"+time);
      fs.writeFileSync(filePath, file.buffer);
  
      res.json({ message: 'File uploaded successfully', fileName: file.originalname });
    } catch (error) {
      console.error('Error saving files:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  });

  app.get('/api/ttl',function(req,res){
    res.json(ttl)
  })
  app.get('/api/decrypt/:uid',function(req,res) {
    let uuid = req.params.uid
    let list = []
    fs.readdir(path.join(__dirname, process.env.STORAGE+ '/') , (err, files) => {
      files.forEach(file => {
        const name = file.split('++')
        if(name[0] == uuid){
          list.push(file)
        }
      });
      if(list.length > 0){
        let pathFile = list[0]
        res.setHeader('filename', atob(list[0].split('++')[1]));
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.sendFile(pathFile, {root: './uploads'})
        res.on('finish', function() {

            fs.unlink(path.join(__dirname, process.env.STORAGE+ '/'+list[0]),function(err){
               if(err)console.log(err)
             })
        
      });
      }
    });

})

  app.get('/api/fetch-encrypted-data', (req, res) => {
    // Provide the filename of the encrypted file
    res.json({ fileName: 'your_encrypted_file' });
  });
  app.use('/api/static', express.static(path.join(__dirname, 'static')));
  // Ensure the uploads directory exists
  const uploadsDir = path.join(__dirname, process.env.STORAGE);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  app.use(express.static(__dirname + '/frontend/dist/frontend'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/frontend/dist/frontend/index.html');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

