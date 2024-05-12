describe('NavigateData', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/catalog')
    })
    it('user can login', () => {
        cy.get('#email').type('juanito.sr.8@gmail.com')
        cy.get('#password').last().type('111111.')
        cy.get('#submit').click()
        cy.contains('Data').click()
      })

})

