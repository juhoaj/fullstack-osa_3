const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan('tiny'))


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})


app.get('/info', (req, res) => {
    res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot<br>' + Date() + '</p>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});



const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {

    const body = request.body
    
    if (body.name === undefined || body.number === undefined ) {
      return response.status(400).json({ 
        error: 'undefined content' 
      })
    }

    if ( persons.filter(e => e.name.toUpperCase().includes(body.name.toUpperCase())).length > 0 ) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(1000000),
    }

    persons = persons.concat(person)

    response.json(person)
})