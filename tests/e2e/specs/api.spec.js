/// <reference types="Cypress" />

import Chance from 'chance'
const chance = new Chance()

describe('Api Database Tests', () => {
  const baseUrl = 'http://localhost:3000'

  beforeEach(() => {
    cy.request('GET', `${baseUrl}/todos`)
      .its('body')
      .each(todo => cy.request('DELETE', `${baseUrl}/todos/${todo.id}`))
  })

  context('With no todos', () => {
    it('Saves new todos', () => {
      const newTodos = [
        { content: chance.sentence({ words: 4 }), expectedLength: 1 },
        { content: chance.sentence({ words: 4 }), expectedLength: 2 },
        { content: chance.sentence({ words: 4 }), expectedLength: 3 },
        { content: chance.sentence({ words: 4 }), expectedLength: 4 },
        { content: chance.sentence({ words: 4 }), expectedLength: 5 }
      ]
      cy.visit('/')
      cy.server()
      cy.route('POST', `${baseUrl}/todos`).as('create')

      cy.wrap(newTodos).each(todo => {
        cy.get('form input')
          .type(todo.content)
          .type('{enter}')

        cy.wait('@create')

        cy.get('.todos li').should('have.length', todo.expectedLength)
      })
    })
  })

  context('With active todos', () => {
    beforeEach(() => {
      cy.fixture('todos').each(todo => {
        cy.request('POST', `${baseUrl}/todos`, todo)
      })
      cy.visit('/')
    })

    it('Loads existing data from th DB', () => {
      cy.get('.todos li').should('have.length', 5)
    })

    it.only('Deletes a todo', () => {
      cy.server()
      cy.route('DELETE', `${baseUrl}/todos/*`).as('delete')

      cy.get('button.destroy')
        .eq(1)
        .click()

      cy.wait('@delete')
      cy.get('.todos li').should('have.length', 4)
    })

    it('Updates a todo', () => {
      cy.server()
      cy.route('PUT', `${baseUrl}/todos/*`).as('update')

      cy.get('.edit-btn')
        .eq(0)
        .click()

      cy.get('input[name=update]')
        .clear()
        .type('Updated todo')
      cy.get('button.save').click()

      cy.wait('@update')
      cy.get('.todos li')
        .eq(0)
        .should('contain', 'Updated todo')
    })
  })
})
