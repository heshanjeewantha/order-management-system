import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';

export async function GET() {
  await dbConnect();
  const orders = await Order.find({});
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  try {
    const order = new Order(data);
    await order.save();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
