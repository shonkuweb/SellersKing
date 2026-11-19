import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { isAdminRequest } from '../../../../../lib/admin-session.mjs';
import { normalizePhone, isValidPhone } from '../../../../../lib/customer-auth.mjs';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Customer ID is required.' }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true, phone: true, isBanned: true, banReason: true }
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    // If attempting to update ban note on an already banned account
    if (customer.isBanned && (body.banReason !== undefined || body.note !== undefined)) {
      return NextResponse.json({
        success: false,
        error: 'The ban note is permanent and cannot be edited after an account has been banned.',
      }, { status: 400 });
    }

    const data = {};

    // Phone number update with normalization and collision check
    if (typeof body.phone === 'string' && body.phone.trim()) {
      const trimmedPhone = body.phone.trim();
      if (!isValidPhone(trimmedPhone)) {
        return NextResponse.json({
          success: false,
          error: 'Please enter a valid 10-digit Indian mobile number.'
        }, { status: 400 });
      }
      const normPhone = normalizePhone(trimmedPhone);
      if (normPhone !== customer.phone) {
        const duplicate = await prisma.customer.findUnique({
          where: { phone: normPhone },
          select: { id: true }
        });
        if (duplicate && duplicate.id !== id) {
          return NextResponse.json({
            success: false,
            error: `Another customer account already exists with phone number +91 ${normPhone}.`
          }, { status: 409 });
        }
        data.phone = normPhone;
      }
    }

    if (typeof body.name === 'string') {
      data.name = body.name.trim().slice(0, 100);
    }
    if (typeof body.email === 'string') {
      const emailTrim = body.email.trim();
      if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
      }
      data.email = emailTrim ? emailTrim.slice(0, 200) : null;
    }
    if (typeof body.address === 'string') {
      data.address = body.address.trim() ? body.address.trim().slice(0, 1000) : null;
    }
    if (typeof body.state === 'string') {
      data.state = body.state.trim() ? body.state.trim().slice(0, 100) : null;
    }
    if (typeof body.pincode === 'string') {
      const pinTrim = body.pincode.trim();
      data.pincode = pinTrim ? pinTrim.slice(0, 10) : null;
    }

    const updated = await prisma.customer.update({
      where: { id },
      data,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        address: true,
        state: true,
        pincode: true,
        isBanned: true,
        banReason: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error('Customer patch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update customer.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Customer ID is required.' }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true, phone: true, name: true }
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
    }

    await prisma.customer.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `Account for ${customer.name ? customer.name + ' (+91 ' + customer.phone + ')' : '+91 ' + customer.phone} has been permanently deleted.`
    });
  } catch (error) {
    console.error('Customer delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete customer account.' }, { status: 500 });
  }
}
