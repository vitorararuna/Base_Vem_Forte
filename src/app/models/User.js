import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) { //método que é chamado automaticamente
        super.init(
            {   //passei apenas os dados os quais sõ inseridos pelo usuário (sem created_at, por exemplo)
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,  //VIRTUAL: campo que nunca vai existir na base de dados
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            });

        this.addHook('beforeSave', async (user) => {    //funcionalidade do sequelize de hooks: são basicamente trechos de código que são executados de forma automática, baseado em ações que acontecem no nosso model
            if (user.password) {                       //Nesse caso, antes de um usuário ser salvo (beforeSave), tanto criado quanto editado, tal trecho de código vai ser executado
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;  //retornando model que acabou de ser inicializado
    }



    checkPassword(password){
        return bcrypt.compare(password, this.password_hash);
    }

}


export default User;
