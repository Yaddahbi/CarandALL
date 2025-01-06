namespace WebApplication1.Models
{
    public class Schadeclaim
    {
        private int _schadeclaimId;
        private string _beschrijving;
        private string _status;
        private string _reparatieDetails;
        private List<string> _fotoUrls;

        public Schadeclaim(int schadeId, DateTime claimDatum, string beschrijving, string status = "In behandeling")
        {
            if (string.IsNullOrWhiteSpace(beschrijving))
                throw new ArgumentException("Beschrijving mag niet leeg zijn.");

            var allowedStatuses = new HashSet<string> { "In behandeling", "Afgehandeld" };
            if (!allowedStatuses.Contains(status))
                throw new ArgumentException("Status moet 'In behandeling' of 'Afgehandeld' zijn.");

            SchadeId = schadeId;
            ClaimDatum = claimDatum;
            Beschrijving = beschrijving;
            Status = status;
            FotoUrls = new List<string>(); 
            ReparatieDetails = string.Empty;
        }

        public int SchadeclaimId
        {
            get { return _schadeclaimId; }
            set { _schadeclaimId = value; }
        }

        public int SchadeId { get; set; } 
        public Schade Schade { get; set; } 

        public DateTime ClaimDatum { get; set; }

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

        public string Status
        {
            get { return _status; }
            set
            {
                var allowedStatuses = new HashSet<string> { "In behandeling", "Afgehandeld" };
                if (!allowedStatuses.Contains(value))
                    throw new ArgumentException("Status moet 'In behandeling' of 'Afgehandeld' zijn.");
                _status = value;
            }
        }

        public List<string> FotoUrls
        {
            get { return _fotoUrls; }
            set { _fotoUrls = value ?? new List<string>(); }
        }

        public string ReparatieDetails
        {
            get { return _reparatieDetails; }
            set { _reparatieDetails = value; }
        }
        
        public void Afhandelen()
        {
            if (Status == "Afgehandeld")
                throw new InvalidOperationException("De claim is al afgehandeld.");
            Status = "Afgehandeld";
        }

        
        public void MarkeerInBehandeling()
        {
            if (Status == "Afgehandeld")
                throw new InvalidOperationException("De claim is al afgehandeld.");
            Status = "In behandeling";
        }

       
        public void VoegFotoToe(string fotoUrl)
        {
            if (!string.IsNullOrWhiteSpace(fotoUrl))
            {
                FotoUrls.Add(fotoUrl);
            }
            else
            {
                throw new ArgumentException("Foto URL mag niet leeg zijn.");
            }
        }

        
        public void VoegReparatieDetailsToe(string reparatieDetails)
        {
            if (!string.IsNullOrWhiteSpace(reparatieDetails))
            {
                ReparatieDetails = reparatieDetails;
            }
            else
            {
                throw new ArgumentException("Reparatie details mogen niet leeg zijn.");
            }
        }

      
        public void KoppelAanReparatie(string reparatieDetails)
        {
            ReparatieDetails = reparatieDetails;
        }

       
        public void UpdateClaim(string nieuweBeschrijving, string nieuweStatus, List<string> nieuweFotoUrls,
            string nieuweReparatieDetails)
        {
            Beschrijving = nieuweBeschrijving;
            Status = nieuweStatus;
            FotoUrls = nieuweFotoUrls;
            ReparatieDetails = nieuweReparatieDetails;
        }
    }
}