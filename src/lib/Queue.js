import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';



const jobs = [CancellationMail];

class Queue {
    constructor() { //OBS.: Cada tipo deserviço (backgroundJob) vai ter a sua própria fila, ex: o envio de cancelamento de email vai ter a sua própria fila. Logo, vamos ter uma fila para cada backgroundJob diferente da nossa app
        this.queues = {};

        this.init();
    }

    //obs.: Todos os trabaalhos que ficam dentro de filas são chamados de jobs, por isso criei uma pasta jobs para cada job
    init() {
        jobs.forEach(({ key, handle }) => { //estou basicamente pegando todos os jobs da nossa aplicação e armazenando dentro do this.queue (armazenamos a fila que possui a conexão com o redis & armazenamos tbm o método handle, que processa o nosso job)
            this.queues[key] = { //vou transformar cada informação que coloco dentro de queues em um objeto
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(queue, job) { //método para adicionar novos trabalhos dentro de cada fila. Ex.: cada vez que o email for disparado, preciso botar esse novo job dentro da fila pra ele ser processado

        //queue(qual fila quero adicionar esse novo trabalho) job(dados do job em si)

        return this.queues[queue].bee.createJob(job).save();
    }


    processQueue() { //método p/ processar as filas
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key]; //bee(fila) handle(método)

            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err){
      console.log(`Queue ${job.queue.name}: FAILED`, err)
    }
}

export default new Queue();
