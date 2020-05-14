import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'; //operador do sequelize

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {

    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true, }
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not provider' });
        }

        const { date } = req.query;
        const parsedDate = parseISO(date);

        //EX.: verificando agendamentos entre esses valores (de um mesmo dia)
        // 2020-07-01 00:00:00
        // 2020-07-01 23:59:59

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate),] //informando os valores entre o começo e o final do dia que recebemos como parametro:
                },
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
            order: ['date'], //ordenando por data
        });

        return res.json(appointments);
    }


}

export default new ScheduleController();
