'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  product: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  async function deleteOrder(id: string) {
    if (!confirm('Are you sure to delete this order?')) return;
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    setOrders(orders.filter((o) => o._id !== id));
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Link href="/api/orders/new">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Order
        </button>
      </Link>

      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Product</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border border-gray-300 px-4 py-2">{order.product}</td>
              <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
              <td className="border border-gray-300 px-4 py-2">${order.price.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <Link href={`/api/orders/edit/${order._id}`}>
                  <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                </Link>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
