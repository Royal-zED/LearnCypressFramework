describe('Test Suite1',()=>{
    it('My First Test',()=>{
        cy.visit('https://www.youtube.com/');
        cy.get('input[name="search_query"]').type("Habul");
        cy.get('button[title="Search"]>span>span>div').click();
    })
})