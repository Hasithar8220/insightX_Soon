import { NextResponse } from 'next/server';
import MySQLService from '../../services/MySQLService';

export async function POST(req: Request) {
  const db = new MySQLService();

  try {
   
    const json = await req.json();

      // Validate the required fields
      if (!json.hash) {
       return NextResponse.json({ success: true, poll: null });;
      }

     // console.log(json);

      // Store record in the database
      const sql = `
        SELECT * FROM insights WHERE hash = ?
      `;
      const results = await db.runquery(sql, [
        json.hash, // Ensure consistent key usage
      ]);

      return NextResponse.json({ success: true, poll: results });
  
  } catch (error: any) {
    console.error('Error saving insight:', error.message || error);
    
  }
};

