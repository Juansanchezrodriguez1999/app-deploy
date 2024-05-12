describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    })
    it('frontpage can be opened and contains catalog card', () => {
      cy.contains('Catalog')
    })
    it('home button', () => {
      cy.contains('Home').click()
    })
    it('catalog button', () => {
      cy.contains('Login').click()
    })

})