import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ShoppingBag, ExternalLink, Package, User, Mail, ShieldCheck } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          transaction: true,
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50";
      case "SHIPPING":
      case "PROCESSING": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
      case "DELIVERED": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
      case "CANCELLED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view purchase history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-md border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Full Name</p>
                  <p className="font-semibold text-foreground">{user.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Email Address</p>
                  <p className="font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Account Role</p>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
              {user.role === "ADMIN" && (
                <div className="pt-4 mt-4 border-t border-border/50">
                  <Link href="/admin">
                    <Button className="w-full">
                      Quản Trị Hệ Thống (Admin Dashboard)
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Purchase History
              </CardTitle>
              <Badge variant="outline" className="bg-background">
                {user.orders.length} Orders
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              {user.orders.length === 0 ? (
                <div className="text-center py-16 px-4 bg-muted/10 rounded-xl border border-dashed border-border/50">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-1">No purchase history yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">You haven&apos;t placed any orders yet. Discover our premium products and make your first purchase using SUI.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div key={order.id} className="border border-border/50 rounded-xl p-5 hover:shadow-md transition-shadow bg-card">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 pb-4 mb-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight text-foreground uppercase">ORDER #{order.id.slice(-8)}</p>
                            <p className="text-xs text-muted-foreground font-medium">
                              {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <span className={`border px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="font-extrabold text-xl">${order.totalAmount.toLocaleString()}</p>
                        </div>
                        
                        {order.transaction ? (
                          <a 
                            href={`https://suiscan.xyz/testnet/tx/${order.transaction.txHash}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
                          >
                            View SUI Transaction <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground italic px-4 py-2 bg-muted rounded-lg w-full sm:w-auto text-center">
                            Transaction Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
