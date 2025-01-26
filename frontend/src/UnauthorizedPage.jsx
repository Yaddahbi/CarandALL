import { Link } from 'react-router-dom';
import './style/UnauthorizedPage.css';

const UnauthorizedPage = () => {
    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <div className="unauthorized-icon">🔒</div>
                <h1 className="unauthorized-heading">Toegang geweigerd</h1>
                <p className="unauthorized-message">
                    U heeft geen toestemming om deze pagina te bekijken.
                </p>
                <Link to="/" className="unauthorized-link">
                    Ga terug naar de startpagina
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
