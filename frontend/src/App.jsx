// App.jsx
import VoertuigenPagina from "./components/VoertuigenPagina";

const App = () => {
  const isZakelijk = false ;

  return (
    <div>
      <h1>CarAndAll Voertuigen</h1>
      <VoertuigenPagina isZakelijk={isZakelijk}/>
    </div>
  );
};

export default App;
