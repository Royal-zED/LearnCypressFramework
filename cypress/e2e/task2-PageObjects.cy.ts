//Here we will follow Page Object Model(POM)
//We will move selectors and actions into classes per page. Our tests will just call those actions when needed
//Advantage- Easy to maintain, in future if we want to change any locator, can do in one file only and will be effective everywhere

//Create folder: cypress/page-objects , file: cypress/page-objects/LoginPage.ts, cypress/page-objects/ProductsPage.ts, cypress/page-objects/CartPage.ts, cypress/page-objects/CheckoutPage.ts




import { LoginPage } from '../page-objects/LoginPage';
import { ProductsPage } from '../page-objects/ProductsPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';



// Instantiate page objects at the top

const loginPage =new LoginPage();
const productsPage =new ProductsPage();
const cartPage =new CartPage();
const checkoutPage =new CheckoutPage();


describe('SauceDemo With Page Objects', () => {

    before(() => {
        loginPage.doLogin('standard_user', 'secret_sauce');
        productsPage.assertOnProductsPage();
    });

    it('should display 6 products', () => { 
        productsPage.getProducts().should('have.length', 6); 
    });

    it('should add and remove product from cart', ()=> { 
        productsPage.addToCart('sauce-labs-backpack'); 
        productsPage.assertCartBadge('1');
        productsPage.removeFromCart('sauce-labs-backpack'); 
        productsPage.assertCartEmpty();
    }); 

    it('should sort products by price ascending', () => { 
        productsPage.sortBy('lohi'); 
        productsPage.assertPricesSortedAscending(); 
    });

    it('should navigate to cart and back', () => { 
        productsPage.goToCart(); 
        cartPage.assertOnCartPage(); 
        cartPage.continueShopping(); 
        productsPage.assertOnProductsPage();
    }); 

    it('should complete full checkout', () => { 
        productsPage.addToCart('sauce-labs-backpack'); 
        productsPage.goToCart();
        cartPage.clickCheckout();
        checkoutPage.fillDetails('zed', 'royal', '12321');
        checkoutPage.clickContinue(); 
        checkoutPage.assertOnOverviewPage(); 
        checkoutPage.clickFinish(); 
        checkoutPage.assertOrderComplete(); 
        checkoutPage.backToHome();
    });

});