import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import routes from './routes';
import './database';


class App {
    constructor() {
        this.server = express();

        Sentry.init(sentryConfig);

        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json()); // enviar requisições com json na api
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')) //express.static => para servirmos arquivos de imagem, css, etc (arquivos que podem ser acessados diretamente do navegador)
        );
    }

    routes() {
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => { //quando um middleware recebe 4 parâmetros, então ele é um middleware de tratamento de exceções

            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }

            return res.staatus(500).json({ error: 'internal server error' });
        })
    }
}

export default new App().server; // só exporto o server
