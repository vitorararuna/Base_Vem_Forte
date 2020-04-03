import File from '../models/File';


class FileController {

    async store(req, res) {
       const {originalname: name, filename: path} = req.file; //desestruturação para pegar alguns dados daquele variável req.file que o multer nos traz

       const file = await File.create({
           name,
           path,
       });

       return res.json(file);
    }
}

export default new FileController();
