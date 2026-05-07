describe('Second Suite1',()=>{
    it('My Second Test',()=>{
        cy.visit('https://www.amazon.in/');
        cy.get('input[id="twotabsearchtextbox"]').type("ladle");
        cy.get('input[id=nav-search-submit-button]').click();

        //input[name="search_query"]
    })
})
