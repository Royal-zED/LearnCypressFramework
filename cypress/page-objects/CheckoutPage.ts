export class CheckoutPage {

    //Selector
    firstNameInput ='[data-test="firstName"]';
    lastNameInput ='[data-test="lastName"]';
    postalCodeInput ='[data-test="postalCode"]';
    continueButton= '[data-test="continue"]';
    finishButton ='[data-test="finish"]';
    backToProducts ='[data-test="back-to-products"]';
    completeHeader ='.complete-header';
    summaryTotal ='.summary_total_label';

    //Actions
    fillDetails(firstName: string, lastName: string, postalCode: string) {
        cy.get(this.firstNameInput).type(firstName);
        cy.get(this.lastNameInput).type(lastName);
        cy.get(this.postalCodeInput).type(postalCode);
    }

    clickContinue() {
        cy.get(this.continueButton).click();
    }

    assertOnOverviewPage() {
        cy.url().should('include', '/checkout-step-two.html');
        cy.get(this.summaryTotal).should('be.visible');
    }

    clickFinish() {
        cy.get(this.finishButton).click();
    }

    assertOrderComplete() {
        cy.url().should('include', '/checkout-complete.html');
        cy.get(this.completeHeader).should('have.text', 'Thank you for your order!');
    }

    backToHome() {
        cy.get(this.backToProducts).click();
    }

}
