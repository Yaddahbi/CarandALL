namespace WebApplication1.Dto_s;

public class UitgifteInnameDto
{
    public int VoertuigId { get; set; } 
    public string MedewerkerId { get; set; } 
    public string Kilometerstand  { get; set; }
    public DateTime UitgifteDatum { get; set; } 
    public DateTime IntakeDatum { get; set; } 
    public string SchadeBeschrijving { get; set; } 
    public string Opmerkingen { get; set; } 
}