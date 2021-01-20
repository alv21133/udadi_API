const Hash = use('Hash');
const { validate } = use('Validator');
const Encryption = use('Encryption');
const User = use('App/Models/User');
const Token = use('App/Models/Token');

class UserController {

    async login({ request, auth, response }) {
        const rules = {
            email: 'required|email',
            password: 'required'
        };

        const { email, password } = request.only(['email', 'password']);

        await auth.attempt(email, password)
        const validation = await validate({ email, password }, rules);
        if (!validation.fails()) {
            try {
                return await auth.withRefreshToken().attempt(email, password);
            } catch (err) {
                response.status(401).send({ error: 'Invalid email or password' });
            }
        } else {
            response.status(401).send(validation.messages());
        }
    }

    async register({ request, response }) {
        const rules = {
            email: 'required|email|unique:users,email',
            username: 'required|unique:users,username',
            password: 'required'
        };

        const { email, username, password } = request.only([
            'email',
            'username',
            'password'
        ]);

        const validation = await validate({ email, username, password }, rules);

        if (!validation.fails()) {
            try {
                const user = await User.create({ email, username, password });
                return response.send({ message: 'User has been created' });
            } catch (err) {
                response.status(401).send({ error: 'Please try again' });
            }
        } else {
            response.status(401).send(validation.messages());
        }
    }

}

module.exports = UserController
