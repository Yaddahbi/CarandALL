export default function checkDatum(startDatum, eindDatum) {
    const startDate = new Date(startDatum);
    const endDate = new Date(eindDatum);
  
    if (startDate > endDate) {
      return "Einddatum kan niet vóór startdatum zijn.";
    }
    return ""; 
  }
  