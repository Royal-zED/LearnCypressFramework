export class LoginPage{
    //selectors 
    usernameInput='#user-name';
    passwordInput='#password';
    loginButton='#login-button';
    errorMessage='[data-test="error"]';

    //Actions
    visit(){
        cy.visit('/');
    }

    enterUsername(username: string)
    {
        cy.get(this.usernameInput).clear().type(username);
    }

    enterPassword(password: string)
    {
        cy.get(this.passwordInput).clear().type(password);
    }

    clickLogin()
    {
        cy.get(this.loginButton).click();
    }

    //Combined action
    doLogin(username: string,password: string)
    {
        this.visit();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }

    //Assertion
    assertLoginError(message: string)
    {
        cy.get(this.errorMessage).should('contain.text',message);
    }

    //Added on task 3
    doLoginAsDefaultUser(){
        const username= Cypress.env('USERNAME'); //Currently its coming from cypress.config.ts, later you can pass it through github pipeline or any where
        const password= Cypress.env('PASSWORD');
        this.doLogin(username,password);
    }

}