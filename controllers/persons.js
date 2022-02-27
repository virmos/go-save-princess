const Person = require('../models/person.js')
const personsRouter = require('express').Router()

personsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))``
})

personsRouter.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<div>Phonebook has ${persons.length} persons</div>
                <div>${new Date()}</div>`)
  })
})

personsRouter.get('/', (request, response, next) => {
  Person.find({}).then(person => {
    response.json(person)
  }).catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = personsRouter
