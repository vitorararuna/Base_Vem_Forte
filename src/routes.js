import { Router } from 'express'; // pego só o Router do express que é usado para separar a forma de roteamento do express em outro arquivo
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';


const routes = new Router(); // agora eu posso utilizar o routes para definir minhas rotas que nem anteriormente no express
const upload = multer(multerConfig);


routes.post('/users', UserController.store);
routes.post('/sessions', SessionControler.store);
routes.get('/users', UserController.index);




routes.use(authMiddleware);//-->assim ele usa o middleware em todas as rotas abaixo //

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store); //upload.single= quero fazer upload de um arquivo por vez e não vários. 'file'=nome do campo que vou enviar dentro da nossa requisição



export default routes;
