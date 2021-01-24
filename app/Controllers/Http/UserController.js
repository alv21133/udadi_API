const Hash = use('Hash');
const { validate } = use('Validator');
const Encryption = use('Encryption');
const User = use('App/Models/User');
const Token = use('App/Models/Token');
const Database = use('Database')

class UserController {

    async login({ request, auth, response }) {
        const rules = {
            email: 'required|email',
            password: 'required'
        };
        const { email, password, pageFrom } = request.only(['email', 'password', 'pageFrom']);

        // validation redirection
        const users = await Database.from('users').where({ email: email })
        const databaseStatus = users[0] !== undefined ? users[0].status : false;

        if (pageFrom === databaseStatus) {
            await auth.attempt(email, password)
            const validation = await validate({ email, password }, rules);
            if (!validation.fails()) {
                try {
                    return await auth.attempt(email, password)

                } catch (err) {
                    response.status(401).send({ error: 'Email dan password tidak valid' });
                }
            } else {
                response.status(401).send(validation.messages());
            }
        } else {
            console.log('Page Not valid');
            response.status(401).send({ error: 'status tidak cocok' })
        }
    }

    async register({ request, response }) {
        const rules = {
            email: 'required|email|unique:users,email',
            username: 'required|unique:users,username',
            password: 'required',
            company: 'required',
            phone: 'required',
        };

        const { email, username, password, company, phone, status } = request.only([
            'email',
            'username',
            'password',
            'company',
            'phone',
            'status'
        ]);

        const validation = await validate({
            email, username, password,
            company, phone, status
        }, rules);

        if (!validation.fails()) {
            try {
                const user = await User.create({
                    email, username, password,
                    company, phone, status
                });

                //create History
                this.createActionHistory(email, 'R')

                // send response
                return response.send({ message: 'Pendaftaran Berhasil' });
            } catch (err) {
                response.status(401).send({ error: 'Mohon periksa lagi data anda', Message: err.code });
            }
        } else {
            response.status(401).send(validation.messages());
        }
    }

    async logout({ auth, response }) {
        const user = await auth.getUser()
        await auth
            .authenticator('jwt')
            .revokeTokensForUser(user)
        await auth.logout()

        response.send('Your not login')
    }



    async checkUser({ auth, response }) {
        const isTokenValid = await auth.check()
        const user = await auth.getUser()
        if (isTokenValid) {
            try {
                return response.send({
                    status: 'Token verified', id: user.id,
                    name: use, email: user.email,
                    phone: user.phone, company: user.company,
                    userType: user.status
                })

            } catch (error) {
                response.send('You are not logged in')
            }
        } else {
            response.status(401).send({ error: 'Token Expired' });
        }
    }

    async loginReport({ auth, response }) {

        const isTokenValid = await auth.check()
        if (isTokenValid) {

            const user = await auth.getUser()
            this.createActionHistory(user.id, 'L');
        } else {
            response, send({ error: 'Token not Valid' })
        }


    }

    async createActionHistory(id, action) {

        if (id.length > 1) {
            const users = await Database.from('users').where({ email: id })
            const userId = await Database
                .table('action_histories')
                .insert({
                    user_id: users[0].id, type: action, created_at: Database.fn.now(),
                    updated_at: Database.fn.now()
                })
        } else {

            const userId = await Database
                .table('action_histories')
                .insert({
                    user_id: id, type: action, created_at: Database.fn.now(),
                    updated_at: Database.fn.now()
                })
        }
    }

}

module.exports = UserController
