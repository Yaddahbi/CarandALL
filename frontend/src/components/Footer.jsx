import { useNavigate } from "react-router-dom";
import "../style/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";


const Footer = () => {
    const navigate = useNavigate();

    const handlePrivacyClick = () => {
        window.scrollTo(0, 0);
        navigate("/privacy");
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>CarAndAll: Rent-IT!</p>
                    <p>Adres: Verhuurstraat 123, 2515 AA Den Haag</p>
                    <p>Telefoon: +31 70 123 4567</p>
                    <p>Email: support@carandall.nl</p>
                </div>

                <div className="footer-section">
                    <h4>Privacyverklaring</h4>
                    <p>
                        Lees meer over hoe we uw gegevens verwerken en beveiligen. Klik hieronder voor de volledige privacyverklaring.
                    </p>
                    <p onClick={handlePrivacyClick} className="privacy-button">
                        Privacyverklaring
                    </p>
                </div>
             <div className="footer-section social-media">
                    <h4>Volg ons</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="social-icon" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="social-icon" />
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="social-icon" />
                        </a>
                    </div>
                </div>
                </div>
            <div className="footer-bottom">
                <p>&copy; 2025 CarAndAll. Alle rechten voorbehouden.</p>
            </div>
        </footer>
    );
};

export default Footer;
