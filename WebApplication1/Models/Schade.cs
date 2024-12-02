namespace WebApplication1.Models
{
    public class Schade
    {
        private int _schadeID;
        private string _beschrijving;
        private DateTime _datum;
        private double _kosten;
        private string _status = "Open";

        public Schade(int voertuigId, string beschrijving, DateTime datum, double kosten)
        {
            if (string.IsNullOrWhiteSpace(beschrijving))
                throw new ArgumentException("Beschrijving mag niet leeg zijn.");

            if (kosten < 0)
                throw new ArgumentException("Kosten mogen niet negatief zijn.");

            if (datum > DateTime.Now)
                throw new ArgumentException("Datum mag niet in de toekomst liggen.");

            VoertuigId = voertuigId;
            Beschrijving = beschrijving;
            Datum = datum;
            Kosten = kosten;
        }

        public int SchadeId
        {
            get { return _schadeID; }
            set { _schadeID = value; }
        }


        public int VoertuigId { get; set; }
        public Voertuig Voertuig { get; set; }

        public string Beschrijving
        {
            get { return _beschrijving; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Beschrijving mag niet leeg zijn.");
                _beschrijving = value;
            }
        }

        public DateTime Datum
        {
            get { return _datum; }
            set
            {
                if (value > DateTime.Now)
                    throw new ArgumentException("Datum mag niet in de toekomst liggen.");
                _datum = value;
            }
        }

        public double Kosten
        {
            get { return _kosten; }
            set
            {
                if (value < 0)
                    throw new ArgumentException("Kosten mogen niet negatief zijn.");
                _kosten = value;
            }
        }

        public string Status
        {
            get { return _status; }
            set
            {
                var allowedStatuses = new[] { "Open", "In behandeling", "Afgehandeld" };
                if (!allowedStatuses.Contains(value))
                    throw new ArgumentException("Status moet 'Open', 'In behandeling' of 'Afgehandeld' zijn.");
                _status = value;
            }
        }

        public void UpdateSchade(string nieuweBeschrijving, double nieuweKosten, string nieuweStatus)
        {
            Beschrijving = nieuweBeschrijving;
            Kosten = nieuweKosten;
            Status = nieuweStatus;
        }

        public void Afhandelen()
        {
            // Controleer of de status al is afgehandeld
            if (Status == "Afgehandeld")
                throw new InvalidOperationException("De schade is al afgehandeld.");
            Status = "Afgehandeld";
        }

        public void MarkeerInBehandeling()
        {
            // Als de schade al afgehandeld is, kan hij niet meer in behandeling worden gezet
            if (Status == "Afgehandeld")
                throw new InvalidOperationException("De schade is al afgehandeld.");
            Status = "In behandeling";
        }
    }
}
