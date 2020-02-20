import { Router } from 'express'; // pego só o Router do express que é usado para separar a forma de roteamento do express em outro arquivo
import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';


const routes = new Router(); // agora eu posso utilizar o routes para definir minhas rotas que nem anteriormente no express

routes.post('/users', UserController.store);
routes.post('/sessions', SessionControler.store);




routes.use(authMiddleware);//-->assim que ele usa o middleware em todas as rotas abaixo deles//

routes.put('/users', UserController.update);



export default routes;
