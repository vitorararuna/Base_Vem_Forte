//CRIANDO LOADER DE MODELS

import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User]; //array com todos os models da aplicação

class Database{
    constructor(){
        this.init();
    }

    init(){ //vai fzr a conexão com o nosso BD e carregar nossos models
        this.connection = new Sequelize(databaseConfig) //essa variável "connection" é esperada dentro dos nossos models, dentro do método init

        models.map(model => model.init(this.connection));
    }
}

export default new Database();
