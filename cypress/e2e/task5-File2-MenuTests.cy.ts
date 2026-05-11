//This part takes care of the Menu part while sharing the resources with the previous task 5 tests just like an industry standard project

import { LoginPage } from "../page-objects/LoginPage";
import { logout } from "../utils/e2e";
import { timeoutAfter10Seconds } from "../support/timeouts";

const loginPage = new LoginPage();

//Login Guard:
let loginSuccess = false; //Track Login state

    //Helper to fail fast
function failIfLoginFailed(){ 
    if(!loginSuccess){
        throw new Error('Login Failed- skipping remaining tests');
    }
}

//SETUP- Runs Once before all suites
before(() => {
    loginPage.doLoginAsDefaultUser(); //uses Cypress.env- No hard coded credentials
    cy.url(timeoutAfter10Seconds).should('include','/inventory.html');
    loginSuccess = true;
});

//before each runs everytime before each tests. Means it will run before every 'it' block.
beforeEach(()=>{
    failIfLoginFailed();
});

describe('Menu Navigation',()=>{
    
    it('should open the sidebar menu',()=>{
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu-wrap').should('be.visible');
    })

    it('should display all menu items',()=>{
        const expectedItems = ['All Items', 'About', 'Logout', 'Reset App State'];
        expectedItems.forEach((item)=>{
            cy.get('.bm-item-list').should('contain.text', item);
        });
    });

    it('should navigate to "All Items"',()=>{
        cy.get('#inventory_sidebar_link').click();
        cy.url().should('include','/inventory.html');
        cy.get('#react-burger-cross-btn').click();
    });

    it('should close menu with X button',()=>{
        cy.get('#react-burger-menu-btn').click();
        cy.get('#react-burger-cross-btn').click();
        cy.get('.bm-menu-wrap').should('not.be.visible');
    });

    it('should reset app state', ()=>{
        //Add an item first
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        cy.assertCartCount(1);

        //Open Menu and reset
        cy.get('#react-burger-menu-btn').click();
        cy.get('#reset_sidebar_link').click();

        //Badge should be gone
        cy.get('.shopping_cart_badge').should('not.exist');

        //Close Menu
        cy.get('#react-burger-cross-btn').click();

    });
});

//Teardown- after block will run once after all the 'it' blocks are completed
after(()=>{
    logout(); //using utility function
});