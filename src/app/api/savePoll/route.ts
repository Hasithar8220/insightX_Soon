import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import MySQLService from '../../services/MySQLService';

export async function POST(req: Request) {
  const db = new MySQLService();

  const getMySQLDatetime = (date: Date): string => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  try {
   
    const json = await req.json();

      // Validate the required fields
      if (!json.title || !json.description || !json.pollHash) {
       
      }

      const d = getMySQLDatetime(new Date());

      // Create the public link
      json.publiclink = `https://insightx.live/polls?id=${json.pollHash}`;

      console.log(json);

      // Store record in the database
      const sql = `
        INSERT INTO insights (title, description, hash, publiclink, jsonobj, datetime) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const results = await db.runquery(sql, [
        json.title,
        json.description,
        json.pollHash, // Ensure consistent key usage
        json.publiclink, // Ensure consistent key usage
        JSON.stringify(json),
        d,
      ]);

      return NextResponse.json({ success: true, poll: results });
  
  } catch (error: any) {
    console.error('Error saving insight:', error.message || error);
    
  }
};

