// App.jsx
import VoertuigenPagina from "./components/VoertuigenPagina";

const App = () => {
  const isZakelijk = false;

  return (
    <div>
      <header className="app-header">
        <h1>CarAndAll Voertuigen</h1>
      </header>
      <VoertuigenPagina isZakelijk={isZakelijk}/>
    </div>
  );
};

export default App;
