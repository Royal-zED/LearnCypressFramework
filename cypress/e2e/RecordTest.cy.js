describe('Record Test', () => {
  it.skip('Record test example', () => {
    cy.visit('https://www.youtube.com/')
    
    cy.get('#center [name="search_query"]').click();
    cy.get('#center [name="search_query"]').type('javascript by testers talk playlist');
    cy.get('#center button.ytSearchboxComponentSearchButton div').click();
    cy.get('#inline-preview-player video.video-stream').click();
    cy.get('ytd-playlist-panel-video-renderer:nth-child(38) h4.style-scope').click();
    
  })
})