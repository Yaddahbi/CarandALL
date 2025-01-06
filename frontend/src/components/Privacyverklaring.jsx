import "../style/Privacyverklaring.css";

const Privacyverklaring = () => {
    return (
        <div className="privacy-page-container">
            <div className="privacy-page">
                <h1>Privacyverklaring</h1>
                <p>
                    Bij CarAndAll respecteren we uw privacy en zetten we ons in om uw gegevens te beschermen.
                    In deze verklaring leggen we uit welke gegevens we verzamelen, waarom we dat doen, en hoe we ze beveiligen.
                </p>
                <h2>Welke gegevens verzamelen we?</h2>
                <ul>
                    <li>Naam, adres en contactinformatie</li>
                    <li>Rijbewijsnummer en reisdetails bij het huren van voertuigen</li>
                    <li>Betalingsinformatie voor abonnementen en reserveringen</li>
                </ul>
                <h2>Waarom verzamelen we gegevens?</h2>
                <p>
                    We gebruiken uw gegevens om:
                    <ul>
                        <li>Uw reserveringen en aanvragen te verwerken</li>
                        <li>Onze dienstverlening te verbeteren</li>
                        <li>Te voldoen aan wettelijke verplichtingen</li>
                    </ul>
                </p>
                <h2>Hoe beveiligen we uw gegevens?</h2>
                <p>
                    Uw gegevens worden opgeslagen in een beveiligde database die voldoet aan de AVG/GDPR-normen.
                    We maken gebruik van encryptie en toegangscontrole om uw gegevens te beschermen tegen ongeoorloofde toegang.
                </p>
                <h2>Uw rechten</h2>
                <p>
                    U heeft het recht om:
                    <ul>
                        <li>Uw gegevens in te zien, te corrigeren of te verwijderen</li>
                        <li>Bezwaar te maken tegen gegevensverwerking</li>
                        <li>Een klacht in te dienen bij de Autoriteit Persoonsgegevens</li>
                    </ul>
                </p>
                <p>Voor vragen kunt u contact met ons opnemen via support@carandall.nl.</p>
            </div>
        </div>
    );
};

export default Privacyverklaring;
