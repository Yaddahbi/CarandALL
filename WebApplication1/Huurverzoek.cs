using System;

public class Huurverzoek
{
	private int _HuurverzoekID { get; set; }
	private date _Startdatum { get; set; }
	private date _Einddatum { get; set; }
?	private int HuurderID { get; set; }
	private int VoertuigID { get; set; }
	private int HuurderID { get; set; }
	private string HuurStatus { get; set; } = "In Behandeling";

	public void VerzoekStatusUpdaten(string nieuweStatus)
	{
		HuurStatus = nieuweStatus;
	}


	public void NotificatieKlant(string bericht)
	{
		
	}
}