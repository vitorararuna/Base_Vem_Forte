import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize) { //método que é chamado automaticamente
        super.init(
            {   //passei apenas os dados os quais sõ inseridos pelo usuário (sem created_at, por exemplo)
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get(){  //como quero formatar esse valor (url)
                        return `http://localhost:3131/${this.path}`; //rota p usuário acessar um arquivo. Não conseguimos acessar, então eu vou no app.js e usar o express.static
                    }
                }
            },
            {
                sequelize,
            });

        return this;  //retornando model que acabou de ser inicializado
    }

}


export default File;
