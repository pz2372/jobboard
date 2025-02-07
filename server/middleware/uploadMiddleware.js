const multer = require('multer');

const storage = multer.memoryStorage(); // Files are stored in memory for direct upload to S3

// Set up multer upload middleware (single file upload with 'file' as field name)
const upload = multer({ storage });

module.exports = upload;
