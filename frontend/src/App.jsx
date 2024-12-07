// App.jsx
import VoertuigenPagina from "./components/VoertuigenPagina";
import SchadePagina from "./SchadePagina";

const App = () => {
  const isZakelijk = false; // hardcode

  return (
    <div>
      <header className="app-header">
        <h1>CarAndAll Voertuigen</h1>
      </header>
      <VoertuigenPagina isZakelijk={isZakelijk}/>
      <SchadePagina /> 
    </div>
  );
};

export default App;
