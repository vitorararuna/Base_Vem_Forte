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


    //Fazer relacionamento do model de User com o de File
    static associate(models) { //A gente podria apenar colcoar "avatar_id" ali em super init, mas isso ia nos dar problemas de relacionamento com o model file
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); //model de usuário pertence a algum model de file, então vou ter um id de arquivo armazenado no model User. E ainda passo o nome da coluna dentro da tabela de usuários que vai armazenar a referencia pro arquivo
    }
    //AGORA É SÓ CHAMAR ESSE MÉTODO ASSOCIATE NO INDEX.JS DA DATABASE - OLHAR LÁ

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

}


export default User;
