require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
/*
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    },
    {
        "name": "Make",
        "number": "118",
        "id": 5
    },
    {
        "name": "Pera",
        "number": "112",
        "id": 6
    },
    {
        "name": "Mä",
        "number": "007",
        "id": 7
    }
]
*/
app.get('/', (req, res) => {
    res.send('<h1>Hello from backend!</h1>')
})

/*
app.get('/info', (req, res) => {
    res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot<br>' + Date() + '</p>')
})
*/

app.get('/api/persons', (request, response) => {
    // response.json(persons)

    Person.find().then(result => {
        response.json(result)
    }
    )
})

app.get('/api/persons/:id', (request, response) => {
    /*
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
 
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    */

    Person.findById(request.params.id)
        .then(person => {
            
            
            if (person) {
                response.json(person.toJSON())
                console.log('queried and created a person for response')
            } else {
                response.status(404).end()
                console.log('queried and created failed to create a person for response')
            }
        })
        .catch(error => {
            console.log('unsuccesfully queried person, malformatted id')
            console.log(error);
            response.status(400).send({ error: 'malformatted id' })

        })
})


app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id);
    // persons = persons.filter(person => person.id !== id);
    Person.deleteOne({ _id: request.params.id }, function (error) {
        if (error) console.log("error on delete query");
    });
    response.status(204).end();
});



app.post('/api/persons', (request, response) => {

    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: 'undefined content'
        })
    }

    /*
    if ( persons.filter(e => e.name.toUpperCase().includes(body.name.toUpperCase())).length > 0 ) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    
 
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: getRandomInt(1000000),
    })

    // persons = persons.concat(person)

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})
