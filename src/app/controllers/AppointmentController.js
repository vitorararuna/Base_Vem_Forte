import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';

import CancellationMail from '../jobs/CancellationMail'; 

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'], //ordenando esses appointments por data
      limit: 20, //listar 20 registros por vez 
      offset: (page - 1) * 20, //offset = quantos registros eu quero pular. Ex.: na página1 vou pular 0 registros, na 2 vou pular 20
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [ //incluindo os dados do prestador de serviço
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'], //sou obrigado a adicionar o path caso queira acessar a imagem
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Valiation fails',
      });
    }

    const { provider_id, date } = req.body;


    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You can not create appointments for yourself' });
    }

    //vendo se provider_id é mesmo um provedor de serviço
    const checkIsProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    const hourStart = startOfHour(parseISO(date)); //essa variável vai guardar apenas a hora e zerar os minutos e segundos

    //verificando se o hour start está antes da data atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    ///verificando se o prestador de serviço já não tem um agendamento marcado pro mesmo horário:
    const checkAvailabitity = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    //se ele encontrou, quer dizer que p horário não está vago
    if (checkAvailabitity) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    //Notificação para o prestador de serviço:
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  //cancelar agendamento
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    console.log(appointment.provider.name)

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // removo duas horas da data agendada
    //13:00 => dateWithSub = 11:00 => now = 11:25 por ex
    const dateWithSub = subHours(appointment.date, 2);
    const NOW = new Date();
    if (isBefore(dateWithSub, NOW)) { //se o dateWithSub for antes da data atual (hora), quer dizer que o horário limite pra ele cancelar já passou
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.',
      });
    }

    appointment.canceled_at = NOW;

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);

  }
}

export default new AppointmentController();