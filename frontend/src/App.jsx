// App.jsx
import VoertuigenLijst from "./VoertuigenLijst";
import SchadePagina from "./SchadePagina";

const App = () => {
  return (
      <div>
          <h1>CarAndAll Voertuigen</h1>
          <h2>Voertuigen</h2>
          <VoertuigenLijst />
          <SchadePagina /> 
      </div>
  );
};

export default App;
