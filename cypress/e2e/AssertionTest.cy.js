describe('Assertion',()=>{
    it('Assertion Test .to.equal',()=>{

        //visiting youtube, searching with something & click search
        
        cy.visit('https://www.youtube.com/');
        cy.get('input[name="search_query"]').type("Habul");
        cy.get('button[title="Search"]>span>span>div').click();

        cy.wait(5000);
        
        //Assert the value which I searched with is there or not
        cy.get('input[name="search_query"]')
          .should('have.value','Habul')

        
        
    })
})
