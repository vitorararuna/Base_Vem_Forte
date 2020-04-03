//CRIANDO LOADER DE MODELS

import Sequelize from 'sequelize';
import mongoose from 'mongoose';


import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment]; //array com todos os models da aplicação

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() { //vai fzr a conexão com o nosso BD e carregar nossos models
        this.connection = new Sequelize(databaseConfig) //essa variável "connection" é esperada dentro dos nossos models, dentro do método init

        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models)); //NESSE 2 MAP EU PERCORRO NOVAMENTE OS MODELS E PRA CADA UM DELES, VOU CHAMAR O .ASSOCIATE (passando nossos models) CASO ELE EXISTA
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL, //gobarber = nome da base de dados no mongo (coloquei igual ao postgres)
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true } //objeto de cofiguração
        );
    }
}

export default new Database();
