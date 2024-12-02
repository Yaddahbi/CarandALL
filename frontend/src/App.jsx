// App.jsx
import VoertuigenPagina from "./components/VoertuigenPagina";

const App = () => {
  const isZakelijk = true ;

  return (
    <div>
      <h1>CarAndAll Voertuigen</h1>
      <VoertuigenPagina />
    </div>
  );
};

export default App;
