import twilio from 'twilio';
import { google } from 'googleapis';

export class AutomationService {
  private static twilioClient = process.env.TWILIO_ACCOUNT_SID 
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

  // 4.3 WhatsApp Integration
  static async sendWhatsAppMessage(to: string, message: string) {
    if (!this.twilioClient) {
      console.log(`[Twilio Mock] Sending WhatsApp to ${to}: ${message}`);
      return { status: 'mocked', message: 'Twilio not configured. Message mocked.' };
    }

    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
        to: `whatsapp:${to}`
      });
      return { status: 'success', sid: response.sid };
    } catch (error: any) {
      throw new Error(`WhatsApp sending failed: ${error.message}`);
    }
  }

  // 4.2 Google Calendar Integration
  static async createCalendarEvent(userTokens: any, eventDetails: any) {
    console.log(`[Calendar Mock] Creating event: ${eventDetails.summary}`);
    
    // In a real scenario, we'd initialize OAuth2 client with user tokens:
    /*
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials(userTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: { dateTime: eventDetails.startTime },
        end: { dateTime: eventDetails.endTime },
      },
    });
    return res.data;
    */

    return { 
      status: 'mocked', 
      event: { 
        id: `mock-id-${Date.now()}`,
        summary: eventDetails.summary,
        link: 'https://calendar.google.com/calendar/event?eid=mock'
      } 
    };
  }

  // 4.1 n8n Automation Webhooks - Handler logic
  static async handleDeadlineWebhook(data: any) {
    // Expected to be called by n8n or trigger n8n
    const { taskTitle, userPhone, deadline } = data;
    
    // 1. Send initial confirmation WhatsApp
    await this.sendWhatsAppMessage(
      userPhone, 
      `🗓️ New Deadline Registered: *${taskTitle}*\nDue: ${deadline}\nI will remind you 24 hours and 1 hour before.`
    );

    // 2. Schedule Calendar Event
    await this.createCalendarEvent({}, {
      summary: `Deadline: ${taskTitle}`,
      description: "Auto-synced from Campus Flow",
      startTime: deadline, // should be ISO string
      endTime: new Date(new Date(deadline).getTime() + 3600000).toISOString()
    });

    return { success: true, workflow: "Deadline Automation Triggered" };
  }

  static async handleAttendanceWarning(data: any) {
    const { userPhone, percentage, requiredClasses } = data;
    
    const msg = `⚠️ *Attendance Alert*\nYour attendance has dropped to ${percentage}%. You must attend the next ${requiredClasses} classes consecutively to maintain the required 75%. Don't miss out!`;
    
    await this.sendWhatsAppMessage(userPhone, msg);
    
    return { success: true, workflow: "Attendance Warning Sent" };
  }
}
