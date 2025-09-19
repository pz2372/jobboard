// Middleware to process file uploads
const processFileUpload = (req, res, next) => {
  try {
    if (!req.body || !req.body.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Extract file data and metadata from request body
    const { file } = req.body;
    
    // Expect file to be in format: { data: "base64string", filename: "example.jpg", contentType: "image/jpeg" }
    if (!file.data || !file.filename || !file.contentType) {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.data, 'base64');
    
    // Attach file info to request object
    req.file = {
      buffer,
      originalname: file.filename,
      mimetype: file.contentType
    };

    next();
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ error: 'Error processing file upload' });
  }
};

module.exports = processFileUpload;
