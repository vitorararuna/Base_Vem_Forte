import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    content: { //conteúdo da nossa notificação
        type: String,
        required: true,
    },
    user: {
        type: Number,
        required: true,
    },
    read: { //se a notificação foi lida ou não
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true, //ou seja, quero os campos created_at e update_at por padrão em todos os registros so meu schema
});

export default mongoose.model('Notification', NotificationSchema);
