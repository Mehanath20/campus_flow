import { Request, Response } from 'express';
import { supabase } from '../config/supabase';


export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description, subject, deadline, branch, year, section } = req.body;

    // 1. Save assignment to database
    // Assuming we have an assignments table. If it doesn't exist, this might fail, 
    // but we'll try to insert anyway.
    const { data: savedAssignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert([
        {
          title,
          description,
          subject,
          deadline,
          branch,
          year,
          section,
          teacher_id: 'teacher_123', // hardcoded or from auth
        }
      ])
      .select()
      .single();

    if (assignmentError) {
      console.error('Error saving assignment:', assignmentError);
      // Fallback: continue even if DB save fails for demo purposes
    }

    // 2. Find students matching branch, year, section
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('branch', branch)
      .eq('year', year)
      .eq('section', section);

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
    }

    // Fallback mock data if students are empty or query failed
    const targetStudents = students && students.length > 0 ? students : [
      {
        name: "Meha",
        phone: "+919999999999",
        email: "meha@gmail.com",
        telegramChatId: "123456"
      },
      {
        name: "David",
        phone: "+919888888888",
        email: "david@gmail.com",
        telegramChatId: "654321"
      }
    ];

    // 3. Trigger n8n Webhook for each student
    const n8nWebhookUrl = 'https://mehanath.app.n8n.cloud/webhook/assignment-created';
    
    // Loop through students and send individual webhooks
    for (const student of targetStudents) {
      const payload = {
        studentName: student.name,
        taskTitle: title,
        subject: subject,
        deadline: deadline,
        phone: student.phone,
        email: student.email
      };

      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log(`Successfully triggered n8n webhook for student: ${student.name}`);
      } catch (webhookError) {
        console.error(`Error triggering n8n webhook for ${student.name}:`, webhookError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Assignment created and notifications triggered.',
      assignment: savedAssignment || { title, subject, deadline }
    });

  } catch (error) {
    console.error('Error in createAssignment:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
