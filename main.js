
const express = require('express')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ storage: multer.memoryStorage() });
//const upload = require('./multer');

const app = express()
const port = process.env.PORT

console.log(process.env.STORAGE)
/*
app.post('/api/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    res.json({ message: 'File uploaded successfully!' });
  });
*/const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
app.post('/api/upload', upload.fields([{ name: 'file' }, { name: 'iv' }, { name: 'key' }]), (req, res) => {
    try {
      const file = req.files['file'][0];
     // const iv = req.files['iv'][0];
    //  const key = req.files['key'][0];
  
      // Save the encrypted file, IV, and key to disk
      const filePath = path.join(__dirname, 'uploads', file.originalname);
    //  const ivPath = path.join(__dirname, 'uploads', `${file.originalname}.iv`);
    //  const keyPath = path.join(__dirname, 'uploads', `${file.originalname}.key`);
  
      fs.writeFileSync(filePath, file.buffer);
    //  fs.writeFileSync(ivPath, iv.buffer);
    //  fs.writeFileSync(keyPath, key.buffer);
  
      res.json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error saving files:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})
/*
app.get('/api/files', (req, res) => {
  res.json([{name:'123',url:'abc'}])
})
*/

app.get('/api/fetch-encrypted-data', (req, res) => {
    try {
      const filePath = path.join(__dirname, 'uploads', '123.txt');
      const ivPath = path.join(__dirname, 'uploads', '123.txt.iv');
      const keyPath = path.join(__dirname, 'uploads', '123.txt.key');
  
      const encryptedData = fs.readFileSync(filePath);
      const iv = fs.readFileSync(ivPath);
      const key = fs.readFileSync(keyPath);
  
      res.json({
        encryptedData: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(new Uint8Array(iv)),
        key: Array.from(new Uint8Array(key))
      });
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      res.status(500).json({ message: 'Error fetching encrypted data' });
    }
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

