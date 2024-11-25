using System;

public class BackofficeMedewerker : Medewerker
{
	
	public void BeheerVerhuuraanvraag (Huurverzoek huurverzoek, string actie)
	{
		if (actie == "goedkueren")
		{
			huurverzoek.VerzoekStatusUpdaten("Goedgekeurd");
			huurverzoek.NotificatieKlant("");

        }
		else if(actie == "afwijzen")
		{

		}

	}
}
