import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const item = await prisma.project_task.findUnique({ where: { id: params.id } });
  if (!item) {
    return NextResponse.json({ message: 'project_task not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const data = await request.json();
  const item = await prisma.project_task.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  await prisma.project_task.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
