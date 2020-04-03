import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import User from '../models/User';
import File from '../models/File';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import * as Yup from 'yup';

class NotificationController {

    async index(req, res) {
        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        })

        if (!isProvider) {
            return res.status(401).json({ error: 'Only providers can load notifications' });
        }

        const notifications = await Notification.find({ //Para o mongo, os métodos find, etc são diferentes do sql
            user: req.userId,
        })
            .sort({ createdAt: 'desc' }) //Ordenar de acordo com o campo createdAt do schema (de forma decrescente)
            .limit(20); //limite de 20


        return res.json(notifications);
    }

    //Marcar notificação como lida
    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, //id com 1° parametro
            { read: true },    //o que queremos atualizar
            { new: true }, //ou seja, depois dele atualizar, ele vai retornar a nova notificação atualizada pra gente conseguir listar ela pro usuário
        );

        return res.json(notification);
    }





}

export default new NotificationController();
