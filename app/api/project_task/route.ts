import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.project_task.findMany();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const item = await prisma.project_task.create({ data });
  return NextResponse.json(item, { status: 201 });
}
