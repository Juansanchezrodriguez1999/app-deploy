describe('UserAuth', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F')
    })
    it('user can login', () => {
        cy.get('#email').type('juanito.sr.8@gmail.com')
        cy.get('#password').last().type('111111.')
        cy.get('#submit').click()
      })

})

