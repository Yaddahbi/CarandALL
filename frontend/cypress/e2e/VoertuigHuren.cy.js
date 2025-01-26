describe('VoertuigenPagina', () => {
    beforeEach(() => {
        sessionStorage.setItem('jwtToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU0MzMwYjkzLWZlZWUtNDA0Zi04Nzc3LTJjYjNlMjcxYzU2YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlBhcnRpY3VsaWVyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiaWJyb0B2b29yYmVlbGQuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6Iklicm9vIHRlc3QiLCJBYm9ubmVtZW50SWQiOiIiLCJleHAiOjE3Mzc1OTk4OTYsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.D7k3wOj0cbCrm3q4e-16uMw1wLD5NkjsokULzIG3AyE');
        cy.visit('http://localhost:58899/voertuigen');
    });

    it('voert een start- en einddatum in, klikt op huur voertuig en bevestigt de reservering', () => {
        // Voer de startdatum in
        cy.get('input[name="startDatum"]').type('2025-01-01');

        // Voer de einddatum in
        cy.get('input[name="eindDatum"]').type('2025-01-10');

        // Controleer of de waarschuwing voor ontbrekende datums niet meer zichtbaar is
        cy.get('.datum-waarschuwing1').should('not.exist');

        // Controleer of de voertuigenweergave zichtbaar is
        cy.get('.voertuigen-pagina').should('contain', 'Voertuigen');

        // Controleer of er voertuigen worden weergegeven
        cy.get('.voertuigen-kaart').should('have.length.greaterThan', 0);

        // Klik op de "Huur voertuig" knop van het eerste voertuig
        cy.get('.voertuigen-kaart').first().find('.huur-button').click();

        // Controleer of het formulier voor het huren van een voertuig zichtbaar is
        cy.get('.form-container').should('be.visible');

        // Klik op de "Bevestig reservering" knop
        cy.get('.form-container').find('button[type="submit"]').click();

        // Controleer of de toast melding voor succesvolle reservering zichtbaar is
        cy.contains('Huurverzoek succesvol aangemaakt!').should('be.visible');
    });
});