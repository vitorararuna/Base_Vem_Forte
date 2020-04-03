//TODA A NOSSA CONFIGUÇÃO DA PARTE DE UPLOAD DE ARQUIVOS

import multer from 'multer';
import crypto from 'crypto'; //gera caracteres aleatórios
import { extname, resolve } from 'path'; //extname: retorna qual a extensão de um arquivo & resolve: percorrer um caminho dentro da minha aplicação

export default {
    storage: multer.diskStorage({   //storage: como o multer vai guardar os nossos arquivos de imagem, podemos guardar no CDN, por exemplo (servidores online feitos para armazenamento de arquivos físicos), mas nós vamos guardar as imagnes dentro dos arquivos da aplicação, na pasta tmp
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), //destino dos nossos arquivos
        filename: (req, file, cb) => { //filename aceita uma função (cb = callback) ... vou adicionar um código único antes de cada nome da imagem
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err); //se der erro, vou chamar o meu callback com o erro. O CALLBACK é a função que a gente precisa executar com o erro ou com o nome do arquivo

                return cb(null, res.toString('hex') + extname(file.originalname)); //passo o null p/ o caso de não ter dado erro.. 'hex'=estou transformando aqueles 16bytes de conteúdo aleatório em uma string hexadecimal
                //wuf29387feqe.png
            })
        },
    }),
};
