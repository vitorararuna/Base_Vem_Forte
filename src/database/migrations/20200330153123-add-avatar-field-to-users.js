'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(  //essa migration é diferenciada hein
            'users',      //indicando qual tabela quero adicionar uma coluna
            'avatar_id', //indicando o nome dessa coluna
            {           //passando algumas informações pra ela
                type: Sequelize.INTEGER, //vou referenciar o id da imagem e não a imagem em si
                references: { model: 'files', key: 'id' }, //criando uma referencia (chave estrangeira). onde passo um obj onde indico algumas info ex: quero que esse campo referencie o model files e a chave que vou referenciar desse model. Logo, todo avatar_id tbm vai ser um id da tabela files
                onUpdate: 'CASCADE', //oqq vai acontecer com o usuário que tiver um avatar_id, caso esse mesmo id em files seja atualizado/deletado
                onDelete: 'SET NULL',
                allowNull: true,
            }
        )
    },

    down: queryInterface => {
        return queryInterface.removeColumn('users', 'avatar_id');
    },
};
