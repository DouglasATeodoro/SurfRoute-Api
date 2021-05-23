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
            const msm =  `Seu código para recuperação da sua conta é: ${codPassword}`
            
            app.db('users')
                .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
                .update({ codPassword })
                .then(                      
                    transporter.sendMail({
                        from: 'noreply@surfroute.com.br',
                        to: req.body.email,
                        subject: "Redefinir a senha SurfRoute",
                        text: msm
                     }).then( 
                         res.json({
                             email: req.body.email, 
                             id: users.id
                            })
                     ).catch( err => res.status(400).json(err))
                    )
                .catch(err => res.status(400).json(err))

           

        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    const codPassword = async (req, res) => {
        
        if (!req.body.id || !req.body.codPassword) {
            return res.status(400).send('Dados incompletos')
        }

        const user = await app.db('users')           
            .where({id: req.body.id ,codPassword: req.body.codPassword})
            .first()

        if (user){
            res.json({
                name: user.name,
                email: user.email,
                id: user.id               
            })

        }else {
            res.status(400).send('Código inválido!')
        }

    }

    return { send, codPassword }
}