const bcrypt = require('bcryptjs')
const chats = []

module.exports = {
    createMessage: (req, res) =>{
        console.log(req.body)
        // destructure pin and message from our request body object
        const {pin, message} = req.body

        for(let i = 0; i < chats.length; i++){
            const existingPin = bcrypt.compareSync(pin, chats[i].pinHash)

            if(existingPin){
                chats[i].messages.push(message)

                let existingSecureMessage = {...chats[i]}
                delete existingSecureMessage.pinHash

                return res.status(200).send(existingSecureMessage)
            }
        }

        // show how many salt cycles we want to run
        const salt = bcrypt.genSaltSync(5) 

        // Take pin and add salt to it
        const pinHash = bcrypt.hashSync(pin, salt)

        // console.log('pin ' + pin)
        // console.log('salt ' + salt)
        // console.log('pinhash ' + pinHash)

        // set up message object

        const msgObj = {
            pinHash,
            messages: [message]
        }

        chats.push(msgObj)

        let securedMessage = {...msgObj}

        delete securedMessage.pinHash

        res.status(200).send(securedMessage)

    }
}