import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail'; //dessa forma, pois quando importar esse arquivo em qqr lugar, ao fazer um CancellationMail.key eu ja consigo pegar essa propriedade 

    }

    async handle({ data }) { //tarefa que vai executar quando esse processo for executado. O handle vai ser chamado para o envio de cada email => AGORA NOSSO JOB DE ENVIO DE EMAIL ESTÁ PRONTO
        const { appointment } = data;

        console.log('A fila Executou');

        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(parseISO(appointment.date),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new CancellationMail();

