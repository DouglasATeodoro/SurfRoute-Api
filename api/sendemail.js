const nodemailer = require('nodemailer')
const { service , user, pass} = require('./../config/mail.json')

module.exports = app => {
    const send = async (req, res) => {
        if (!req.body.email) {
            return res.status(400).send('Dados incompletos!')
        }

        const transporter = nodemailer.createTransport({
            service: service,
            auth: { user, pass }
        })

        const users = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        const random = (min, max) => Math.floor(Math.random() * (max - min) + min)    

        if (users) {
            
            const codPassword = random(1000,9999)

            app.db('users')
                .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
                .update({ codPassword })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))

            const msm =  `Seu código para recuperação da sua conta é: ${codPassword}`  

            transporter.sendMail({
               from: 'noreply@surfroute.com.br',
               to: req.body.email,
               subject: "Redefinir a senha SurfRoute",
               text: msm
            }).then( info => {
                res.send(info)
            }).catch( error => {
                res.send(error)
            })

        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    

    return { send }
}