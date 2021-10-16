const multer = require('multer')
const path = require('path')

module.exports = {
    upload: () => {
        let storage = multer.diskStorage({
            destination: path.join(path.resolve('public'), 'imagesProfile'),
            // localhost:2000/public/images
            
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
                // IMG-162034631.jpg
            }
        })

        return multer({ storage }).single('IMG')
    },

    uploadProd: () => {
        let storage = multer.diskStorage({
            destination: path.join(path.resolve('public'), 'products'),
            // localhost:2000/public/images
            
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
                // IMG-162034631.jpg
            }
        })

        return multer({ storage }).single("PROD")
    }
}