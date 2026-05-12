import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Users, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { DashboardCharts } from "./dashboard-charts";

export default async function AdminDashboardPage() {
  const [totalUsers, totalProducts, totalOrders, orders, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      where: { status: "PAID" },
      select: { totalAmount: true, createdAt: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-muted-foreground font-medium">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full"><DollarSign className="h-4 w-4 text-blue-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><Activity className="h-3 w-3"/> +12% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full"><ShoppingBag className="h-4 w-4 text-emerald-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalOrders}</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><Activity className="h-3 w-3"/> +8% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-full"><Package className="h-4 w-4 text-purple-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Active items in catalog</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-full"><Users className="h-4 w-4 text-orange-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalUsers}</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><Activity className="h-3 w-3"/> +24 new this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts Component */}
      <DashboardCharts orderData={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent orders found.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalAmount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
              <span className="font-medium">Manage Products</span>
              <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/admin/orders" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
              <span className="font-medium">Manage Orders</span>
              <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
            <Link href="/admin/users" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors group">
              <span className="font-medium">Manage Users</span>
              <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
