"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";

type OrderData = {
  totalAmount: number;
  createdAt: Date;
};

export function DashboardCharts({ orderData }: { orderData: OrderData[] }) {
  // Generate the last 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return startOfDay(d);
  });

  // Group real order data by day
  const realChartData = last7Days.map(day => {
    const dayOrders = orderData.filter(order => isSameDay(new Date(order.createdAt), day));
    const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = dayOrders.length;
    
    return {
      name: format(day, "EEE"), // e.g., Mon, Tue
      fullDate: format(day, "MMM d, yyyy"),
      revenue: revenue,
      orders: orderCount
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Day</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={realChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                formatter={(value: unknown) => [value as number, "Orders"]}
                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
