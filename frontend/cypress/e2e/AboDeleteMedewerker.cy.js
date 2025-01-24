describe('AboMedewerkersLijst Component', () => {
    beforeEach(() => {
        // Mock token in localStorage
        localStorage.setItem('jwtToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU4MmIwYmFlLTBmNjItNDc3Ny1hZTczLTFiMDEzNjM1NjI2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ilpha2VsaWprZUtsYW50IiwiQWJvbm5lbWVudElkIjoiMSIsImV4cCI6MTczNjYwOTI5MCwiaXNzIjoieW91cl9pc3N1ZXIiLCJhdWQiOiJ5b3VyX2F1ZGllbmNlIn0.Rq3le_8WG5pPVknOmUcLkX7E2aHyShrm4SRXroE29i0');

        // Mock API endpoint voor medewerkers ophalen
        cy.intercept('GET', 'https://localhost:7040/api/Abonnement/medewerkers', {
            statusCode: 200,
            body: [
                { id: 1, naam: "Hansie Krik", email: "hansie@iboservices.com", rol: "Medewerker" },
                { id: 2, naam: "Pietje Puk", email: "pietje@iboservices.com", rol: "Medewerker" },
            ],
        }).as('getMedewerkers');

        // Mock API endpoint voor verwijderen van medewerker
        cy.intercept('DELETE', 'https://localhost:7040/api/Abonnement/remove-medewerker/*', (req) => {
            req.reply({
                statusCode: 200,
                body: { message: "Medewerker succesvol verwijderd." },
            });
        }).as('deleteMedewerker');

        // Bezoek de pagina
        cy.visit('http://localhost:58899/abonnementen');
    });
    it('moet medewerkers ophalen en weergeven', () => {
        // Wacht tot de API call voor medewerkers is voltooid
        cy.wait('@getMedewerkers');

        // Controleer of de medewerkerslijst correct wordt weergegeven
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length', 2);
        cy.contains('Hansie Krik').should('exist');
        cy.contains('Pietje Puk').should('exist');
    });


    it('moet de medewerker verwijderen wanneer de knop "Verwijderen" wordt aangeklikt', () => {
        // Wacht tot de medewerkers zijn opgehaald
        cy.wait('@getMedewerkers');

        // Zorg ervoor dat de eerste medewerker de juiste knop heeft en klik erop
        cy.get('tbody tr').first().find('button').should('exist').click();

        // Controleer of de API-call voor het verwijderen van de medewerker wordt uitgevoerd
        cy.wait('@deleteMedewerker').its('request.url').should('include', '/remove-medewerker/1');

        // Controleer of de succesmelding wordt getoond
        cy.contains('Medewerker succesvol verwijderd.').should('exist');
    });
});
