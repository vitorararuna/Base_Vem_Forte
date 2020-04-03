import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns'

class Appointment extends Model {
    static init(sequelize) {
        super.init(
            {
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
                past: {
                  type: Sequelize.VIRTUAL,
                  get(){ //função que retorna o valor desse atributo past
                     return isBefore(this.date, new Date()); 
                  },  
                },
                cancelable: {
                    type: Sequelize.VIRTUAL,
                    get() { //só pode cancelar no mínimo 2 hrs antes de acontecer o servico, lembra ?
                      return isBefore(new Date(), subHours(this.date, 2));
                    },
                },
            },
            {
                sequelize,
            });

        return this;
    }

    //Relacionamento !
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    }
}


export default Appointment;
