using MailKit.Net.Smtp;
using MimeKit;

public class EmailService
{
    public void SendNotification(string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("CarAndAll", "noreply@carandall.com"));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = subject;

        message.Body = new TextPart("plain")
        {
            Text = body
        };

        using (var client = new SmtpClient())
        {
            client.Connect("smtp.example.com", 587, false);
            client.Authenticate("your_email@example.com", "your_password");
            client.Send(message);
            client.Disconnect(true);
        }
    }
}
if (updatedRequest.HuurStatus == "Approved")
{
    emailService.SendNotification(userEmail, "Request Approved", "Your rental request has been approved.");
}
else if (updatedRequest.HuurStatus == "Rejected")
{
    emailService.SendNotification(userEmail, "Request Rejected", $"Your request was rejected. Reason: {updatedRequest.Afwijzingsreden}");
}
