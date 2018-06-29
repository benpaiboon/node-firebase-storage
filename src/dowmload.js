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

// Get all files from firebase storage
bucket.getFiles().then(results => {
  const files = results[0];
  if (files.length <= 0) {
    console.log(`There are no any files in firebase storage.`);
  }
  else {
    files.forEach(file => {
      let cloudFilePath = `${file.name}`;
      let prefixFolder = `${folder.cloud_folder}/`;
      let onlyFileName = cloudFilePath.slice(prefixFolder.length);

      const firebaseFile = bucket.file(cloudFilePath);
      const destFilename = `${folder.destination_files_folder}/${onlyFileName}`;
      const options = { destination: destFilename };

      firebaseFile.download(options)
        .then(() => {
          // 1st then download file from firebase storage to local folder.
          console.log(`gs://${bucket.name}/${cloudFilePath} downloaded to ${destFilename}`);
        })
        .then(() => {
          // 2nd then delete all files from firebase storage.
          firebaseFile.delete()
            .then(() => {
              console.log(`Successfully deleted file from firebase: ${cloudFilePath}`)
            }).catch(err => {
              console.log(`Failed to remove, error: ${err}`)
            });
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    });
  }
}).catch(err => {
  console.error('ERROR:', err);
});