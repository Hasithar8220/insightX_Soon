import type { NextApiRequest, NextApiResponse } from 'next';
import MySQLService from '../../services/MySQLService';

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const db = new MySQLService();

//   // Helper function to get MySQL datetime format
//   const getMySQLDatetime = (date: Date): string => {
//     return date.toISOString().slice(0, 19).replace('T', ' ');
//   };

  // try {
  //   if (req.method === 'POST') {
  //     const json = req.body;

  //     // Validate the required fields
  //     if (!json.title || !json.description || !json.pollhash) {
  //       return res.status(400).json({ success: false, message: 'Missing required fields' });
  //     }

  //     const d = getMySQLDatetime(new Date());

  //     // Create the public link
  //     json.publiclink = `https://insightx.live/polls?id=${json.pollhash}`;

  //     // Store record in the database
  //     const sql = `
  //       INSERT INTO insights (title, description, hash, publiclink, jsonobj, datetime) 
  //       VALUES (?, ?, ?, ?, ?, ?)
  //     `;
  //     const results = await db.runquery(sql, [
  //       json.title,
  //       json.description,
  //       json.pollHash,
  //       json.publicLink,
  //       JSON.stringify(json),
  //       d,
  //     ]);

  //     res.status(200).json({ success: true, data: results });
  //   } else {
  //     res.setHeader('Allow', ['POST']);
  //     res.status(405).json({ success: false, message: 'Method Not Allowed' });
  //   }
  // } catch (error: any) {
  //   console.error('Error saving insight:', error.message || error);
  //   res.status(500).json({ success: false, message: 'Internal Server Error' });
  // }
//};

//export default handler;
