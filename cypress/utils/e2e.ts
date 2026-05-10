// Generate unique name with timestamp so its really unique
export function generateRandomName(prefix: string): string{
    return `${prefix}_${Date.now()}`;
}


//Gets random product data-test-id from the product page.
export function getRandomProductId(): Cypress.Chainable<string>{
    const productIds= [
        'sauce-labs-backpack',
        'sauce-labs-bike-light',
        'sauce-labs-bolt-t-shirt',
        'sauce-labs-fleece-jacket',
        'sauce-labs-onesie',
        'test.allthethings()-t-shirt-(red)',
    ];
    const randomIndex = Math.floor(Math.random()*productIds.length);
    return cy.wrap(productIds[randomIndex]);
}

//logs out by opening the menu and logout
export function logout(){
    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').click();
    cy.url().should('eq', 'https://www.saucedemo.com/');

}

