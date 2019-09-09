describe('loginTest', () => {
	it('visitWeb', () => {
		cy.visit('http://localhost:3000');
	});
 	it('login', () => {
 		cy.login();
 	});
})