const File = require('../models/file');
const fs = require('fs');
const upload = require('../middlewares/upload');

// Upload File
exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const newFile = new File({
                filename: req.file.filename,
                filepath: req.file.path,
                taskId: req.params.taskId // assuming taskId is passed as a parameter
            });

            await newFile.save();
            res.status(201).json({ message: 'File uploaded successfully', file: newFile });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Update File (e.g., replace file)
exports.updateFile = async (req, res) => {
    const { fileId } = req.params;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const file = await File.findById(fileId);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Delete the old file from the filesystem
            fs.unlinkSync(file.filepath);

            // Update file information in the database
            file.filename = req.file.filename;
            file.filepath = req.file.path;
            await file.save();

            res.status(200).json({ message: 'File updated successfully', file });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Delete File
exports.deleteFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete the file from the filesystem
        fs.unlinkSync(file.filepath);

        // Delete the file record from the database
        await file.remove();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get File
exports.getFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(200).json({ file });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
