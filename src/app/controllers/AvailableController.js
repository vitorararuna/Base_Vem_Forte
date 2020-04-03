import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date); //transformando a data em um nmr inteiro

    // 2019-09-18 10:49:44

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    //seria os horários que o prestador de serviço tem disponível (poderíamos configurar para cada um, mais uma tarefa para depois)
    const schedule = [ 
      '08:00', // 2019-09-18 08:00:00
      '09:00', // 2019-09-18 09:00:00
      '10:00', // 2019-09-18 10:00:00
      '11:00', // ...
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    //Vai retornar as datas disponíveis para o usuário 
    const available = schedule.map(time => { 
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        // format to: 2019-09-18T15:40:44-04:00
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) && //primeiro verifico se o horário já passou
          !appointments.find(a => format(a.date, 'HH:mm') === time), //depois verifico se já tem algum horário agendado
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();