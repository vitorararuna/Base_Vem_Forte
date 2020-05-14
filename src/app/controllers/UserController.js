import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';


class UserController {

    async store(req, res) {

        const schema = Yup.object().shape({ //.object (estou validando um obj que é o req.body) & .shape (passo o formato que eu quero que esse objeto tenha)
            name: Yup.string().required(), //required = obrigatório
            email: Yup.string().email().required(), //email = se tem o @ e td certin
            password: Yup.string().required().min(6), //mínimo de6dígitos
        });

        if (!(await schema.isValid(req.body))) { //verificando se o nosso req.body está passando conforme esse schema
            return res.status(400).json({ error: "Validation Fails" })
        }

        const userExist = await User.findOne({ where: { email: req.body.email } });

        if (userExist) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const { id, name, email, provider } = await User.create(req.body);

        return res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async index(req, res) {
        console.log("bora carai")
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', ], //indicando as informações que quero retornar
        });

        return res.json(users);
    }

    async update(req, res) { //para o usuário fazer alteração nos dados cadatrais dele

        const schema = Yup.object().shape({
            name: Yup.string(),                               //na edição, o nome, email e oldPassword não precisam ser obrigatórios
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),               //se ele enviar a senha antiga, então a nova tem que estar presente
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>   //when = validação condicional; field = se refere ao password
                oldPassword ? field.required() : field                                 //se minha variada oldPassword estiver preenchida, o field(password) será required
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field     //se meu password estiver preenchido, o confirmPassword é obrigatório e precisa ser igual ao password
            )
        });

        if (!(await schema.isValid(req.body))) { //verificando se o nosso req.body está passando conforme esse schema
            return res.status(400).json({ error: "Validation Fails" })
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) { //se ele quiser trocar de email tbm, verificamos antes se já não existe alguém com esse já
            const userExist = await User.findOne({ where: { email } });

            if (userExist) {
                return res.status(400).json({ error: 'User already exists' });
            }
        }


        if (oldPassword && !(await user.checkPassword(oldPassword))) { //verificando se ele sabia mesmo a antiga senha, para setar a nova
            return res.status(401).json({ error: 'Password does not match' });
        }

        await user.update(req.body);

        const { id, name, avatar } = await User.findByPk(req.userId, {
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                },
            ],
        });

        return res.json({
            id,
            name,
            email,
            avatar,
        });
    }

}

export default new UserController();
