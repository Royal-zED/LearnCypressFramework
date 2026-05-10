export class CartPage{

    //Selector
    pageTitle= '.title';
    checkoutButton ='[data-test="checkout"]';
    continueShoppingButton ='[data-test="continue-shopping"]';
    cartItem ='.cart_item';

    //Actions
    assertOnCartPage() {
        cy.url().should('include', '/cart.html');
        cy.get(this.pageTitle).should('have.text', 'Your Cart');
    }

    clickCheckout() {
        cy.get(this.checkoutButton).click();
    }

    continueShopping() {
        cy.get(this.continueShoppingButton).click();
    }

    getCartItems() {
        return cy.get(this.cartItem);
    }
}
