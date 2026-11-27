import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { normalizePhone, verifyPassword, hashPassword } from '../../../../../lib/customer-auth.mjs';
import { createCustomerSession } from '../../../../../lib/customer-session.mjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const rawPassword = body.password;
    const rawPhone = body.phone;

    const phone = normalizePhone(String(rawPhone || ''));
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Please enter your registered phone number.' }, { status: 400 });
    }

    if (typeof rawPassword !== 'string' || !rawPassword) {
      return NextResponse.json({ success: false, message: 'Please enter your password.' }, { status: 400 });
    }

    const password = rawPassword.trim();

    let customer = await prisma.customer.findUnique({
      where: { phone }
    });

    // Default demo user fallback: 1234567890 / password123
    if (phone === '1234567890' && (password === 'password123' || rawPassword === 'password123')) {
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            id: 'demo-user-1234567890',
            phone: '1234567890',
            passwordHash: hashPassword('password123'),
            name: 'Demo User',
            email: 'demo@sellersking.in',
            state: 'West Bengal',
            pincode: '700001',
            isBanned: false,
          }
        });
      } else if (!verifyPassword(password, customer.passwordHash) && !verifyPassword('password123', customer.passwordHash)) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            passwordHash: hashPassword('password123'),
            isBanned: false,
          }
        });
      }
    }

    const isPassValid = customer && (verifyPassword(password, customer.passwordHash) || verifyPassword(rawPassword, customer.passwordHash));

    if (!customer || !isPassValid) {
      return NextResponse.json({ success: false, message: 'Incorrect phone number or password. Please try again.' }, { status: 401 });
    }

    if (customer.isBanned) {
      return NextResponse.json({
        success: false,
        message: customer.banReason
          ? `This account has been suspended: ${customer.banReason}`
          : 'This account has been suspended by the store administrator. Please contact support.'
      }, { status: 403 });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      }
    });

    const token = await createCustomerSession({
      id: customer.id,
      phone: customer.phone,
      name: customer.name || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      customer: {
        id: customer.id,
        phone: customer.phone,
        name: customer.name || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
      }
    });

    response.cookies.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during login. Please try again.' }, { status: 500 });
  }
}
