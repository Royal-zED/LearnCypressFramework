/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Declare the type so typescript knows this exist
declare namespace Cypress {
    interface Chainable {
        //Custom command: Login with default user. Usage: cy.loginAsDefaultUser()
        loginAsDefaultUser(): Chainable<void>;

        //Custom command: Assert cart has N items. Usage: cy.assertCartCount(3)
        assertCartCount(count: number): Chainable<void>

    }
}

//Implementation

Cypress.Commands.add('loginAsDefaultUser', ()=>{
    cy.visit('/');
    cy.get('#user-name').type(Cypress.env('USERNAME'));
    cy.get('#password').type(Cypress.env('PASSWORD'));
    cy.get('#login-button').click();
    cy.url().should('include','/inventory.html')
});

Cypress.Commands.add('assertCartCount',(count: number) =>{
    if(count===0)
    {
        cy.get('.shopping_cart_badge').should('not.exist');
    }
    else{
        cy.get('.shopping_cart_badge').should('have.text',String(count));
    }
});