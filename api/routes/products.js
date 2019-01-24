const express = require('express');
const route = express.Router();
const multer = require('multer');

const productControls = require('../controllers/product');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case "image/jpeg":
        case "image/png":
            {
                cb(null, true);
                break;
            }
        default:
            {
                cb(null, false);
            }
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

route.post('/', upload.single('productImage'), productControls.product_create);

route.get('/', productControls.product_get_all);

route.get('/:id', productControls.product_get_id);

route.put('/:id', productControls.product_update);

route.delete('/:id', productControls.product_delete);

module.exports = route;