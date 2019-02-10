const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const url =
    `mongodb+srv://fsosa3:${password}@clusteri0-ieqku.mongodb.net/person-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

if (name === undefined || number === undefined) {
    console.log('puhelinluettelo:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })

} else {



    person.save().then(response => {
        console.log('lisätään', name, 'numero', number, 'luetteloon');
        mongoose.connection.close();
    })
}