// App.jsx

import VoertuigenPagina from "./components/VoertuigenPagina";

import VoertuigenLijst from "./VoertuigenLijst";
import SchadePagina from "./SchadePagina";


const App = () => {
  const isZakelijk = false ;

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
