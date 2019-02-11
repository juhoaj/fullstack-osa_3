if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))


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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



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
    })

})

app.get('/api/persons/:id', (request, response, next) => {
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
                response.status(204).end()
                console.log('queried and created failed to create a person for response')
            }
        })
        /*
        .catch(error => {
            console.log('unsuccesfully queried person, malformatted id')
            console.log(error);
            response.status(400).send({ error: 'malformatted id' })

        })
        */
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id);
    // persons = persons.filter(person => person.id !== id);
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
            console.log('person deleted')
        })
        .catch(error => next(error))
});



app.post('/api/persons', (request, response, next) => {

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

    /*
    Person.count({name: person.name})
        .then(maara=> {
            if (maara > 0) {
                console.log('löyty')
                return response.status(400).json({ 
                    error: 'name must be unique' 
                })
            }
        })
    */
    // persons = persons.concat(person)

    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})



//  kyselee kummia eli olemattomien osoitteiden käsittely

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// virheellisten pyyntöjen käsittely

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)