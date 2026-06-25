export interface Student {
  id: string;
  register_number: string;
  name: string;
  email: string;
  telegram_chat_id?: string;
  branch?: string;
  year?: string;
  section?: string;
  overall_attendance_percentage: number;
}
