import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth'; //para descryptografar o token e ver se ele está válido!
import { promisify } from 'util'; //esse carinha pega uma função de callback e transforma ela em uma função que eu possa utilizar o async/await


export default async (req, res, next) => {
    const authHeader = req.headers.authorization; // "authorization" = nome do header que estou enviando lá pelo insomnia

    if (!authHeader) {
        return res.status(401).json({ error: "Token not provided" });
    }

    const [bearer, token] = authHeader.split(' '); //retorna um array com as palavras que o authHeader contém [Bearer, 01289my3cr897 2397rcnt39r]

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);   //valor retornado pelo JWT.VERIFY .... dentro do promisify eu coloco a função callback que seria utilizada
        //dentro do decoded vão estar as informações que a gente usou na hora de gerar o token (id, email, etc)

        req.userId = decoded.id; //incluindo esse Id do usuário dentro do nosso req, assim fica mais fácil de pegar essa informação

        return next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválid" });
    }


};

