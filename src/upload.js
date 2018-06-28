// Init Dependencies
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-adminsdk.json');
const folder = require('../config/folder.json');
const fs = require('fs');
const mime = require('mime');

// Init Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

// Init Bucket
const bucket = admin.storage().bucket();

// Upload all files to firebase storage
fs.readdirSync(folder.get_files_local_folder).forEach(file => {
  let filePath = `${folder.get_files_local_folder}/${file}`;
  let uploadTo = `${file}`;
  let fileMime = mime.getType(filePath);

  bucket.upload(filePath, {
    destination: uploadTo,
    public: true,
    metadata: { contentType: fileMime, cacheControl: "public, max-age=300" }
  }, function (err, file) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`http://storage.googleapis.com/${bucket.name}/${encodeURIComponent(uploadTo)}`);
  });
});

