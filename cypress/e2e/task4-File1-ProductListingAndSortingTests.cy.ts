//Here in task 4, we will create 2 separate files. 1)Product Listing and sorting in this cy.ts file & 2) Checkout tests in next cy.ts file
//Add custom Cypress commands, a proper support file loaded before every tests and split tests into multiple files that share the same infrastructure
//Update `cypress/support/e2e.ts` (This file is configured in cypress.config.ts & is loaded before every tests)
//Create `cypress/support/command.ts`

import { ProductsPage } from "../page-objects/ProductsPage";
import { timeoutAfter10Seconds } from "../support/timeouts";

const productsPage = new ProductsPage;

//Track Login state
let loginSuccess = false;

//Helper to fail fast
function failIfLoginFailed(){
    if(!loginSuccess){
        throw new Error('Login Failed- skipping remaining tests');
    }
}


describe('SauceDemo Products', () => {

    before(() => {
        cy.loginAsDefaultUser(); //using the custom command instead of page object
        cy.url(timeoutAfter10Seconds).should('include','/inventory.html');
        loginSuccess = true;
    });

    //before each runs everytime before each tests. Means it will run before every 'it' block.
    beforeEach(()=>{
        failIfLoginFailed();
    })

    
    describe('Product Display',()=>{
        it('should display 6 products', () => { 
        productsPage.getProducts().should('have.length', 6); 
        });

        it('should show products name and prices', ()=> { 
            //using utility functions
            productsPage.getProducts().first().within(()=>{
                cy.get('.inventory_item_name').should('not.be.empty');
                cy.get('.inventory_item_price').should('not.be.empty');
            });
        });
    });
    

    //Suite 2-Sorting
    describe('sorting',()=>{

        it('should sort by name A-Z',()=>{
            productsPage.sortBy('az');
            //First item should come before last alphabetically
            cy.get('.inventory_item_name').first().invoke('text').then((firstName) =>{
                cy.get('.inventory_item_name').last().invoke('text').then((lastName) =>{
                    expect(firstName.localeCompare(lastName)).to.be.lessThan(0);
                });
            });
        });

        it('should sort products by price low to high', () => { 
        productsPage.sortBy('lohi'); 
        productsPage.assertPricesSortedAscending(); 
        });
    });

    describe('Cart Operations', ()=>{
        it('should add item and show badge',()=>{
            productsPage.addToCart('sauce-labs-backpack');
            cy.assertCartCount(1); //Using custom command
        });
        it('should remove item and hide badge',()=>{
            productsPage.removeFromCart('sauce-labs-backpack');
            cy.assertCartCount(0); //Using custom command
        });
    });
});    
