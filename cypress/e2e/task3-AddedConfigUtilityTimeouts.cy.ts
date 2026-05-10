//Here on top of POM, we will add config to store credentials,utils to have some helper functions like reusable timeouts
//Update `cypress.config.ts`
//Create cypress/support/timeouts.ts, cypress/utils/e2e.ts
//Update cypress/page-objects/LoginPage.ts to add action- doLoginAsDefaultUser which will use cypress.config.ts to fetch credentials from env-No hardcoded value
//Mostly test is same as previous task, but added/used another layer of config and utils to enhance our framework

import { LoginPage } from '../page-objects/LoginPage';
import { ProductsPage } from '../page-objects/ProductsPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';
import { generateRandomName, getRandomProductId, logout } from '../utils/e2e'; 
import { timeoutAfter10Seconds } from '../support/timeouts';



// Instantiate page objects at the top

const loginPage =new LoginPage();
const productsPage =new ProductsPage();
const cartPage =new CartPage();
const checkoutPage =new CheckoutPage();

//Track Login state
let loginSuccess = false;

//Helper to fail fast
function failIfLoginFailed(){
    if(!loginSuccess){
        throw new Error('Login Failed- skipping remaining tests');
    }
}

describe('SauceDemo With Page Objects, Config & utils', () => {

    before(() => {
        loginPage.doLoginAsDefaultUser(); //uses Cypress.env- No hard coded credentials
        cy.url(timeoutAfter10Seconds).should('include','/inventory.html');
        loginSuccess = true;
    });

    //before each runs everytime before each tests. Means it will run before every 'it' block.
    beforeEach(()=>{
        failIfLoginFailed();
    })

    //Suite 1-Product listing
    describe('Product Listing',()=>{
        it('should display 6 products', () => { 
        productsPage.getProducts().should('have.length', 6); 
        });

        it('should add arandom product to cart', ()=> { 
            //using utility functions
            getRandomProductId().then((productId)=>{
                productsPage.addToCart(productId); 
                productsPage.assertCartBadge('1');
                productsPage.removeFromCart(productId); 
                productsPage.assertCartEmpty();
            })
        });
    });

    //Suite 2-Sorting
    describe('sorting',()=>{
        it('should sort products by price ascending', () => { 
        productsPage.sortBy('lohi'); 
        productsPage.assertPricesSortedAscending(); 
        });
    })
     
    //Suite 3-Checkout
    describe('Checkout',()=>{
        it('should complete a checkout with generated name', () => { 
            //Generate Random NAme
            const firstName= generateRandomName('zed'); //firstName will be something like zed_12131456000000

            productsPage.addToCart('sauce-labs-backpack');
            productsPage.goToCart(); 
            cartPage.clickCheckout();
            checkoutPage.fillDetails(firstName, 'royal', '12321');
            checkoutPage.clickContinue(); 
            checkoutPage.assertOnOverviewPage(); 
            checkoutPage.clickFinish(); 
            checkoutPage.assertOrderComplete(); 
            checkoutPage.backToHome();

        }); 

        //Teardown- after block will run once after all the 'it' blocks are completed
        after(()=>{
            logout(); //using utility function
        });
    });
});