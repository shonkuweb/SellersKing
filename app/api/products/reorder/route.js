import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { isAdminRequest } from '../../../../lib/admin-session.mjs';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Please log in to manage products.' }, { status: 401 });
  }
  try {
    const data = await request.json();
    const productIds = Array.isArray(data.productIds)
      ? data.productIds.map(String).filter(Boolean)
      : null;
    if (!productIds || !productIds.length) {
      return NextResponse.json({ error: 'Provide a list of product IDs to reorder.' }, { status: 400 });
    }

    await prisma.$transaction(
      productIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true, count: productIds.length });
  } catch (err) {
    console.error('Failed to reorder products:', err);
    return NextResponse.json({ error: 'Unable to update product positions.' }, { status: 500 });
  }
}

export async function POST(request) {
  return PUT(request);
}
