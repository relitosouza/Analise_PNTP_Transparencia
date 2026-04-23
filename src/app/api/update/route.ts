import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'relatorio_pntp_manual.json');

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

async function loadData(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { manual_updates: {} };
  }
}

async function saveData(data: Record<string, unknown>) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, status, url = '', obs = '' } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 });
  }

  try {
    const data = await loadData();
    const updates = (data.manual_updates || {}) as Record<string, unknown>;
    updates[id] = {
      status,
      url,
      obs,
      updated_at: new Date().toISOString(),
    };
    data.manual_updates = updates;
    await saveData(data);
    return NextResponse.json({ message: 'Item atualizado com sucesso', persisted: true });
  } catch {
    // On Vercel (read-only filesystem), we can't persist but still acknowledge
    return NextResponse.json({
      message: 'Item atualizado na sessão (persistência não disponível no ambiente serverless)',
      persisted: false,
    });
  }
}
