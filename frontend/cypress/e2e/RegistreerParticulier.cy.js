describe('Registreer Particulier Pagina', () => {
    beforeEach(() => {
        // API endpoint intercept
        cy.intercept('POST', 'https://localhost:7040/api/User/register', (req) => {
            const { email } = req.body;
            if (email === 'test@example.com') {
                req.reply({
                    statusCode: 200,
                    body: { message: "Account succesvol aangemaakt!" },
                });
            } else {
                req.reply({
                    statusCode: 400,
                    body: { errors: ["Ongeldige gegevens"] },
                });
            }
        }).as('registerUser');

        // Bezoek de registreerpagina
        cy.visit('http://localhost:58899/registreer-particulier');
    });

    it('moet een succesvol registratieproces uitvoeren', () => {
        // Vul het registratieformulier in
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="wachtwoord"]').type('Wachtwoord123!');
        cy.get('input[name="naam"]').type('Jan Jansen');
        cy.get('input[name="adres"]').type('Straatnaam 123');
        cy.get('input[name="telefoonnummer"]').type('0612345678');
        cy.get('input[type="checkbox"]').check();

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

        // Controleer de API-aanroep en navigatie
        cy.wait('@registerUser').its('response.statusCode').should('eq', 200);
        cy.contains('Account succesvol aangemaakt!').should('be.visible');
    });

    it('moet een foutmelding weergeven bij ontbrekende privacyverklaring', () => {
        // Vul het formulier in zonder de checkbox aan te vinken
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="wachtwoord"]').type('Wachtwoord123!');
        cy.get('input[name="naam"]').type('Jan Jansen');
        cy.get('input[name="adres"]').type('Straatnaam 123');
        cy.get('input[name="telefoonnummer"]').type('0612345678');

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

        // Controleer op foutmelding
        cy.contains('U moet akkoord gaan met de privacyverklaring om verder te gaan.').should('be.visible');
    });

    it('moet een foutmelding weergeven bij ongeldige gegevens', () => {
        // Vul het formulier in met ongeldige gegevens
        cy.get('input[name="email"]').type('invalid@example.com');
        cy.get('input[name="wachtwoord"]').type('Wachtwoord123');
        cy.get('input[name="naam"]').type('Jan Jansen');
        cy.get('input[name="adres"]').type('Straatnaam 123');
        cy.get('input[name="telefoonnummer"]').type('0612345678');
        cy.get('input[type="checkbox"]').check();

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

        // Controleer de API-aanroep en foutmelding
        cy.wait('@registerUser').its('response.statusCode').should('eq', 400);
        cy.contains('Ongeldige gegevens').should('be.visible');
    });
});
