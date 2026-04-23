import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'relatorio_pntp_manual.json');

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ manual_updates: {} });
  }
}
