import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, url = '', obs = '' } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios' }, { status: 400 });
    }

    // 1. Ensure the criterion exists in the database
    await prisma.criterion.upsert({
      where: { id },
      update: {}, // No changes needed if it exists
      create: { 
        id,
        description: '', // We don't have the full description here, but we can update it later
      },
    });

    // 2. Save update to database as a new audit entry
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
