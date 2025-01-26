describe('Inloggen Pagina', () => {
    beforeEach(() => {
        // API endpoint intercept
        cy.intercept('POST', 'https://localhost:7040/api/User/login', (req) => {
            const { email, password } = req.body;
            if (email === 'test@example.com' && password === 'Wachtwoord123!') {
                req.reply({
                    statusCode: 200,
                    body: { message: "Inloggen succesvol.", token: "fake-jwt-token", role: "Particulier" },
                });
            } else {
                req.reply({
                    statusCode: 401,
                    body: { error: "Ongeldige inloggegevens." },
                });
            }
        }).as('loginUser');

        // Bezoek de inlogpagina
        cy.visit('http://localhost:58899/login');
    });

    it('moet een succesvol inlogproces uitvoeren', () => {
        // Vul het inlogformulier in
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('Wachtwoord123!');

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

        // Controleer de API-aanroep en navigatie
        cy.wait('@loginUser').its('response.statusCode').should('eq', 200);
    });

    it('moet een foutmelding weergeven bij ongeldige inloggegevens', () => {
        // Vul het formulier in met ongeldige gegevens
        cy.get('input[name="email"]').type('invalid@example.com');
        cy.get('input[name="password"]').type('WrongPassword');

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

        // Controleer de API-aanroep en foutmelding
        cy.wait('@loginUser').its('response.statusCode').should('eq', 401);
    });

    it('moet een foutmelding weergeven bij ontbrekende gegevens', () => {
        // Vul het formulier in zonder wachtwoord
        cy.get('input[name="email"]').type('test@example.com');

        // Verstuur het formulier
        cy.get('button[type="submit"]').click();

    });
});