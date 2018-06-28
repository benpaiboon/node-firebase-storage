// Init Dependencies
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-adminsdk.json");
const folder = require('../config/folder.json');

// Init Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

// Init Bucket
const bucket = admin.storage().bucket();

// Download all files from firebase storage
bucket.getFiles().then(results => {
  const files = results[0];
  files.forEach(file => {
    // console.log(file.name);
    const destFilename = `${folder.destination_files_folder}/${file.name}`;
    const options = { destination: destFilename };

    bucket.file(file.name)
      .download(options)
      .then(() => {
        console.log(
          `gs://${bucket.name}/${file.name} downloaded to ${destFilename}`
        );
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  });
}).catch(err => {
  console.error('ERROR:', err);
});

