describe('VoertuigenPagina', () => {
    beforeEach(() => {
        // Bezoek de pagina VoertuigenPagina
        cy.visit('http://localhost:58899/voertuigen');
    });

    it('voert een start- en einddatum in, klikt op huur voertuig en bevestigt de reservering', () => {
        // Voer de startdatum in
        cy.get('input[name="startDatum"]').type('2025-01-01');

        // Voer de einddatum in
        cy.get('input[name="eindDatum"]').type('2025-01-10');

        // Klik op de filterknop om de voertuigen te laden
        cy.get('button[type="submit"]').click();

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