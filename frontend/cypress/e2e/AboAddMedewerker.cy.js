describe('AboAddMedewerker Component', () => {
    beforeEach(() => {
        // Mock token in localStorage
        localStorage.setItem('jwtToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU4MmIwYmFlLTBmNjItNDc3Ny1hZTczLTFiMDEzNjM1NjI2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ilpha2VsaWprZUtsYW50IiwiQWJvbm5lbWVudElkIjoiMSIsImV4cCI6MTczNjYwOTI5MCwiaXNzIjoieW91cl9pc3N1ZXIiLCJhdWQiOiJ5b3VyX2F1ZGllbmNlIn0.Rq3le_8WG5pPVknOmUcLkX7E2aHyShrm4SRXroE29i0');

        // API endpoint
        cy.intercept('POST', 'https://localhost:7040/api/Abonnement/add-medewerker', (req) => {
            const { email } = req.body;
            if (email === 'hansiekrik@iboservices.com') {
                req.reply({
                    statusCode: 200,
                    body: { message: "Medewerker succesvol toegevoegd!" },
                });
            } else {
                req.reply({
                    statusCode: 400,
                    body: { message: "Ongeldig e-mailadres." },
                });
            }
        }).as('addMedewerker');

        cy.visit('http://localhost:58899/abonnementen');
    });

    it('moet succesvol een medewerker toevoegen wanneer een geldig e-mailadres wordt ingevoerd', () => {
        cy.get('input#email').type('hansiekrik@iboservices.com');
        cy.get('button[type="submit"]').click();

        cy.wait('@addMedewerker').its('request.body').should('deep.equal', {
            email: 'hansiekrik@iboservices.com',
        });

        cy.contains('Medewerker succesvol toegevoegd!').should('exist');

        cy.get('input#email').should('have.value', '');
    });

    it('moet een foutmelding weergeven wanneer een ongeldig e-mailadres wordt ingevoerd', () => {
        cy.get('input#email').type('invalid-email@company');
        cy.get('button[type="submit"]').click();

        cy.wait('@addMedewerker').its('response.statusCode').should('equal', 400);
        cy.contains('Ongeldig e-mailadres.').should('exist');
    });

    it('moet de knop uitschakelen terwijl er geladen wordt', () => {
        cy.get('input#email').type('hansiekrik@iboservices.com');

        cy.intercept('POST', 'https://localhost:7040/api/Abonnement/add-medewerker', {
            delay: 1000,
            statusCode: 200,
            body: { message: "Medewerker succesvol toegevoegd!" },
        }).as('slowAddMedewerker');

        cy.get('button[type="submit"]').click();

        // Controleer of de knop uitgeschakeld is tijdens het laden
        cy.get('button[type="submit"]').should('be.disabled');

        cy.wait('@slowAddMedewerker');

        // Controleer of de knop weer ingeschakeld is
        cy.get('button[type="submit"]').should('not.be.disabled');
    });
});
