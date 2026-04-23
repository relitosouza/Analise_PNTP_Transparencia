import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, url = '', obs = '' } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    // Save update to database
    // Note: We create a new audit entry to keep history, 
    // or we could update the latest one. Let's create a new one.
    await prisma.audit.create({
      data: {
        criterionId: id,
        status,
        url: url || null,
        observation: obs || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Item atualizado com sucesso no banco de dados', 
      persisted: true 
    });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({
      message: 'Erro ao salvar no banco de dados',
      persisted: false,
      error: String(error)
    }, { status: 500 });
  }
}
