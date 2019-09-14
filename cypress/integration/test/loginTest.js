/*describe('loginTest', () => {
	beforeEach(() => {
		cy.visit('/');
	});
 	it('login', () => {
 		cy.login();
 	});
 	it('play', () => {
 		cy.contains('Play game').click();
 	});
});
describe('TagLoadTest', () => {
	it('tag', () => {
		cy.get('#tags')
			.type('bird,watEr, doG')
			.should('have.value', 'bird,watEr, doG');
	});
	it('submit', () => {
		cy.get('#submitButton').click();
	});	
	it('addTag', () => {
    cy.callFirestore('get', `testCollection/${Cypress.env('TEST_UID')}`, {
      name: 'axa',
      age: 8,
    });
     cy.logout();
  });
})*/
describe('test', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it("set", () => {
     cy.callFirestore('set', `testCollection/3`, {
      tags: 1290
    });
  });
});
/*describe('Test firestore', () => {
  const TEST_UID = Cypress.env('TEST_UID');
  const mockAge = 8;

  beforeEach(() => {
    cy.visit('/');
  });

  it('read/write test', () => {
    cy.log('Starting test');

    cy.callFirestore('set', `testCollection/${TEST_UID}`, {
      name: 'axa',
      age: 8,
    });
    cy.callFirestore('get', `testCollection/${TEST_UID}`).then(r => {
      cy.wrap(r[0])
        .its('id')
        .should('equal', TEST_UID);
      cy.wrap(r[0])
        .its('data.age')
        .should('equal', mockAge);
    });
    cy.log('Ended test');
  });
});*/