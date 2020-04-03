import User from '../models/User';
import File from '../models/File';


class ProviderController {
    async index(req, res) {
        const providers = await User.findAll({
            where: { provider: true },
            attributes: ['id', 'name', 'email', 'avatar_id'], //indicando as informações que quero retornar
            include: [//retornar não só o avatar_id, mas os dados dele
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(providers);
    }
}

export default new ProviderController();
