import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log('Connecting to database...');
  await dbConnect();
  const { id } = await params;
  console.log(`Fetching order with id: ${id}`);
  const order = await Order.findById(id);
  if (!order) {
    console.log('Order not found');
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  console.log('Order found:', order);
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  console.log('Connecting to database...');
  await dbConnect();
  const { id } = await params;
  const data = await request.json();
  console.log('Updating order with id:', id);
  try {
    const order = await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!order) {
      console.log('Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    console.log('Order updated:', order);
    return NextResponse.json(order);
  } catch (error) {
    console.log('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = await params;
  const order = await Order.findByIdAndDelete(id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return new Response(null, { status: 204 });
}
