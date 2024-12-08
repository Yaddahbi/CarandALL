[ApiController]
[Route("api/[controller]")]
public class HuurverzoekenController : ControllerBase
{
    private static List<Huurverzoek> _huurverzoeken = new List<Huurverzoek>
    {
        new Huurverzoek
        {
            HuurverzoekID = 1,
            Startdatum = DateTime.Now.AddDays(2),
            Einddatum = DateTime.Now.AddDays(5),
            HuurderID = 101,
            VoertuigID = 201,
            HuurStatus = "In Behandeling"
        }
    };

    [HttpGet]
    public IActionResult GetHuurverzoeken()
    {
        return Ok(_huurverzoeken);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateHuurverzoekStatus(int id, [FromBody] Huurverzoek bijgewerktVerzoek)
    {
        var huurverzoek = _huurverzoeken.FirstOrDefault(h => h.HuurverzoekID == id);
        if (huurverzoek == null)
            return NotFound();

        huurverzoek.HuurStatus = bijgewerktVerzoek.HuurStatus;
        huurverzoek.Afwijzingsreden = bijgewerktVerzoek.Afwijzingsreden;

        return Ok(huurverzoek);
    }
}
