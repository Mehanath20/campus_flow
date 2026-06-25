import axios from 'axios';

export const triggerN8nAttendanceWebhook = async (payload: any) => {
  const webhookUrl = process.env.N8N_ATTENDANCE_WEBHOOK || 'https://sree-2026.app.n8n.cloud/webhook/attendance-submitted';
  if (!webhookUrl) {
    console.warn('N8N_ATTENDANCE_WEBHOOK is not set in environment variables');
    return;
  }

  try {
    await axios.post(webhookUrl, payload);
    console.log('Successfully triggered n8n attendance webhook');
  } catch (error) {
    console.error('Failed to trigger n8n webhook:', error);
    // We don't throw here to avoid failing the attendance submission if n8n is down
  }
};
