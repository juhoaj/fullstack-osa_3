const express = require('express')
const app = express()

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const numberTotal = Math.max(...persons.map(n => n.id))
    res.send('<p>Puhelinluettelossa ' + numberTotal + ' henkilön tiedot<br>' + Date() + '</p>')
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})