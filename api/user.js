const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {
        obterHash(req.body.password, hash => {
            const password = hash

            app.db('users')
                .insert({ 
                    name: req.body.name,
                    email: req.body.email.toLowerCase(),
                    password
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        })
    }

    const update = (req, res) => {
        obterHash(req.body.password, hash => {
            const password = hash

            if (!req.body.id || !req.body.email) {
                return res.status(400).send('Dados incompletos')
            }

            app.db('users')
                .where({id: req.body.id })                
                .update({                    
                    password
                })
                .then(rows => {
                    if (rows > 0) {
                        res.status(204).send()
                    } else {
                        const msg = `Não foi encontrado o id ${req.body.id} e código ${req.body.codPassword}.`
                        res.status(400).send(msg)
                    }
                })
                .catch(err => res.status(400).json(err))
        })
    }

    return { save, update }
}