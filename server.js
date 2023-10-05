const express = require('express');
const app = express();
var cors = require('cors');
const cloudinary = require('./utils/cloudinary');
const cassandraDb = require('./cassandra');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const courseId = req.body.courseId;
       const uploadedRes = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'ml_default'
       });

       const updateQuery = `UPDATE course SET image_url = ? WHERE id = ?`;
       const params = [uploadedRes.secure_url, courseId];
       await cassandraDb.execute(updateQuery, params, { prepare: true })
       .catch(err => console.log(err));
       return res.json({ message: "uploaded succesfully"})
       
       



    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('listening on 4000');
});