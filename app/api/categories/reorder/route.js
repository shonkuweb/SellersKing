import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { isAdminRequest } from '../../../../lib/admin-session.mjs';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Please log in to manage categories.' }, { status: 401 });
  }
  try {
    const data = await request.json();
    const categoryIds = Array.isArray(data.categoryIds)
      ? data.categoryIds.map(String).filter(Boolean)
      : null;
    if (!categoryIds || !categoryIds.length) {
      return NextResponse.json({ error: 'Provide a list of category IDs to reorder.' }, { status: 400 });
    }

    await prisma.$transaction(
      categoryIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true, count: categoryIds.length });
  } catch (err) {
    console.error('Failed to reorder categories:', err);
    return NextResponse.json({ error: 'Unable to update category positions.' }, { status: 500 });
  }
}

export async function POST(request) {
  return PUT(request);
}
