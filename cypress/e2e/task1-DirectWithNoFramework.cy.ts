//Before starting this, create a minimal 'tscpnfig.json' and update 'cypress.config.ts' to include the Base Url and specify the path to support file
//Task 1- Everything in 1 file- no page objects, no utils, nothing. Easy to write, difficult to maintain.

describe('Sauce Demo- Flat tests',()=>{

    //before runs once before all tests. (like once before all the 'it' blocks)
    before(()=>{
        cy.visit('/'); //Visit the Base Url- https://www.saucedemo.com
        cy.get('#user-name').type('standard_user');
        cy.get('#password').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        //Asert Login successful and product page is reached
        cy.url().should('include','/inventory.html');
        cy.get('.title').should('have.text','Products');
    });

    //Test1-Verify product list is visible
    it('should display the product lis', () =>{
        cy.get('.inventory_list').should('be.visible');
        cy.get('.inventory_item').should('have.length',6);
    });

    //Test2-Verify product names are present
    it('should show product names', ()=>{
        cy.get('.inventory_item_name ').first().should('not.be.empty');
    })

    //Test3-Add a product to cart
    it('should add a product and badge number should be visible',()=>{
        cy.get('.btn.btn_primary.btn_small.btn_inventory ').first().click();
        cy.get('.shopping_cart_badge').should('be.visible');
        cy.get('.btn.btn_secondary.btn_small.btn_inventory ').should('have.text','Remove');
    })

    //Test4- Remove product from cart
    it('should remove the product and badge number should not be visible', () =>{
        cy.get('.btn.btn_secondary.btn_small.btn_inventory ').first().click();
        cy.get('.shopping_cart_badge').should('not.exist');
    })

    //Test5- Sort product by price(low to high)
    it('products should get sorted as per price low to high', ()=>{
        cy.get('[data-test="product-sort-container"]').select('lohi');
        //Verify prices in ascending order
        let price: number=0;
        let nextprice: number;
        cy.get('.inventory_item_price').each(($el)=>{
            nextprice= parseFloat($el.text().replace('$',''));
            expect(nextprice).to.be.at.least(price);
            price=nextprice;
        })

    })

    //Test6-Navigate to cart
    it('should navigate to cart and get back', ()=>{
    cy.get('.shopping_cart_link').click();
    cy.url().should('include','/cart.html');

    cy.get('[data-test="continue-shopping"]').click();//Navigating back to continue next tests
    cy.url().should('include','/inventory.html')
    })

    //Test7-Full checkout flow
    it('should complete a full checkout', ()=>{
        //Add to cart
        cy.get('.btn.btn_primary.btn_small.btn_inventory ').first().click();
        //Navigate to cart
        cy.get('.shopping_cart_link').click();
        //Click on checkout
        cy.get('.btn.btn_action.btn_medium.checkout_button ').click();
        cy.url().should('include','/checkout-step-one.html');
        //Fill checkout info and click on continue
        cy.get('#first-name').type('zed');
        cy.get('#last-name').type('roy');
        cy.get('#postal-code').type('11111');
        cy.get('#continue').click();
        //Overview page
        cy.url().should('include','/checkout-step-two.html');
        //Click on finish
        cy.get('#finish').click();
        cy.url().should('include','/checkout-complete.html');
        //click on back to home
        cy.get('#back-to-products').click();
        cy.url().should('include','/inventory.html');



    });


});