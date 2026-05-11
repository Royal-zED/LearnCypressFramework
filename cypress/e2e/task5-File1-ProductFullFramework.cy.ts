//This will be a real project structure-full framework test for products
/*
LAYERS USED:
1. cypress.config.ts       -> env vars(credentials, baseUrl)
2. support/e2e.ts          -> auto-loaded before tests (imports command)
3. support/commands.ts     -> custom cypress commands (eg- cy.loginAsDefaultUser)
4. support/timeouts.ts     -> reusable timeout objects
5. page-objects/Login/     -> login page object
6. utils/e2e.ts            -> helper functions (generateRandomName, logout)
7. This File               -> The actual test orchestration for Products
*/

import { LoginPage } from '../page-objects/LoginPage';
import { ProductsPage } from '../page-objects/ProductsPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';
import { generateRandomName, getRandomProductId, logout } from '../utils/e2e'; 
import { timeoutAfter10Seconds, timeoutAfter30Seconds } from '../support/timeouts';



// Instantiate page objects at the top
const loginPage =new LoginPage();
const productsPage =new ProductsPage();
const cartPage =new CartPage();
const checkoutPage =new CheckoutPage();

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


//SUITE 1: Product Listing
describe('Product Listing',()=>{

    it('should display page title "Products"',()=>{
        productsPage.assertOnProductsPage();
    });

    it('should display 6 products', () => { 
        productsPage.getProducts().should('have.length', 6); 
    });

    it('should show product name, description and price for each item', ()=> { 
        productsPage.getProducts().each(($item)=>{
            cy.wrap($item).find('.inventory_item_name').should('not.be.empty');
            cy.wrap($item).find('.inventory_item_desc').should('not.be.empty');
            cy.wrap($item).find('.inventory_item_price').should('not.be.empty');
        });  
    });
});

//SUITE 2: Sorting and Filtering
describe('sortingAndFiltering',()=>{

    it('should sort by name A to Z', () => { 
        productsPage.sortBy('az');
        const names: string[]=[];
        
        cy.get('.inventory_item_name').each(($el)=>{
            names.push($el.text());
        }).then(()=>{
            const sorted = [...names].sort();
            expect(names).to.deep.equal(sorted);
        });
    });

    it('should sort products by price low to high', () => { 
        productsPage.sortBy('lohi'); 
        productsPage.assertPricesSortedAscending(); 
    });

    it('products should get sorted as per price high to low', ()=>{
        productsPage.sortBy('hilo');
        const prices: number []=[];

        cy.get('.inventory_item_price').each(($el)=>{
            prices.push(parseFloat($el.text().replace('$','')));
        }).then(()=>{
            for(let i=0; i < prices.length - 1;i++){
                expect(prices[i]).to.be.at.least(prices[i+1]);
            }
        });
    });
});

//SUITE 3: Cart Operations
describe('CartOperations', ()=>{

    it('should add a product to cart',()=>{
        productsPage.addToCart('sauce-labs-backpack');
        cy.assertCartCount(1);
    });

    it('should add a second product to cart',()=>{
        productsPage.addToCart('sauce-labs-bike-light');
        cy.assertCartCount(2);
    });

    it('should show items in cart page',()=>{
        productsPage.goToCart();
        cartPage.assertOnCartPage();
        cartPage.getCartItems().should('have.length',2);
    });

    it('should return to products and remove items',()=>{
        cartPage.continueShopping();
        productsPage.removeFromCart('sauce-labs-backpack');
        productsPage.removeFromCart('sauce-labs-bike-light');
        cy.assertCartCount(0);
    });

    it('should add a random product',()=>{
        getRandomProductId().then((productId)=>{
            productsPage.addToCart(productId);
            cy.assertCartCount(1);
            productsPage.removeFromCart(productId);
            cy.assertCartCount(0);
        });    
    });
});

//SUITE 4: CheckoutFlow
describe('CheckoutFlow', ()=>{
    it('should complete full checkout with generated name',()=>{

        const firstName=generateRandomName('ZedRoyal');

        productsPage.addToCart('sauce-labs-bolt-t-shirt');
        productsPage.goToCart();
        cartPage.assertOnCartPage();
        cartPage.clickCheckout();

        cy.url().should('include', '/checkout-step-one.html');
        checkoutPage.fillDetails(firstName,'Roy','11101');
        checkoutPage.clickContinue();
        checkoutPage.assertOnOverviewPage();
        checkoutPage.clickFinish();
        checkoutPage.assertOrderComplete();
        checkoutPage.backToHome();

        productsPage.assertOnProductsPage();

    });
});

//SUITE 5: Negative Tests
describe('NegativeTests',()=>{
    it('should show error for locked out user(invalid login test)',()=>{
        cy.log('Negative login tests would go in a separate file with testIsolation: true');
    });
});


//Teardown- after block will run once after all the 'it' blocks are completed
after(()=>{
    logout(); //using utility function
});
