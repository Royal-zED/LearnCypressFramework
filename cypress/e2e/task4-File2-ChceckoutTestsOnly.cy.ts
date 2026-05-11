//This shares the same page objects,utils and custom commands as task4-File1 and separated for checkout page

import { ProductsPage } from '../page-objects/ProductsPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';
import { generateRandomName, logout } from '../utils/e2e'; 
import { timeoutAfter10Seconds } from '../support/timeouts';



// Instantiate page objects at the top

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

describe('SauceDemo Checkout', () => {

    before(() => {
        cy.loginAsDefaultUser(); //uses Cypress command
        cy.url(timeoutAfter10Seconds).should('include','/inventory.html');
        loginSuccess = true;
    });

    //before each runs everytime before each tests. Means it will run before every 'it' block.
    beforeEach(()=>{
        failIfLoginFailed();
    })

    describe('Cart Page',()=>{
        it('should navigate to cart', () => { 
        productsPage.goToCart();
        cartPage.assertOnCartPage();
        cartPage.continueShopping();
        });
    });


    describe('Full Checkout Flow', ()=> { 
        it('should complete checkout with random user',()=>{
            const firstName= generateRandomName('Tester');

            productsPage.addToCart('sauce-labs-bike-light'); 
            productsPage.goToCart();
            cartPage.clickCheckout();

            checkoutPage.fillDetails(firstName,'Roy','11111');
            checkoutPage.clickContinue();
            checkoutPage.assertOnOverviewPage();
            checkoutPage.clickFinish();
            checkoutPage.assertOrderComplete();
            checkoutPage.backToHome();

        });
    });

    //Teardown- after block will run once after all the 'it' blocks are completed
    after(()=>{
        logout(); //using utility function
    });
});
