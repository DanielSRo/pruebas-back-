const mongoose = require('mongoose')

// *** *** *** *** *** *** *** *** *** *** *** 
//
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

// *** *** *** *** *** *** *** *** *** *** *** 
//los parametros para realizar la conexion a la base de datos
const password = process.argv[2]

const url =
    `mongodb+srv://Daniel:${password}@cluster0.dhqoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
//valida los datos del esquema de acuerdo al modelo, (true: validacion extricta tiene que esta igual al modelo, 
// false: puede parecerse y los valores que no pernesescan al modelo seran omitidos.)

mongoose.connect(url)

// *** *** *** *** *** *** *** *** *** *** *** 
//Modelo del objeto

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// *** *** *** *** *** *** *** *** *** *** *** 
//Ruta de envio a la base de datos, junto con el objeto enviado

const Note = mongoose.model('note', noteSchema)

// *** *** *** *** *** *** *** *** *** *** *** 
// POST a la base de datos

// const note = new Note({
//   content: 'GET and POST are the most important methods of HTTP protocol',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// *** *** *** *** *** *** *** *** *** *** *** 
// GET a la base de datos

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})