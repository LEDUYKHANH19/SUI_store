"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });

  const totalUSD = getTotal();
  // For demo on testnet: 1 USD = 0.01 SUI so users don't run out of testnet faucet SUI
  const totalSui = +(totalUSD * 0.01).toFixed(4); 
  const totalMist = Math.floor(totalSui * 1_000_000_000);

  const handlePayment = async () => {
    if (!currentAccount) {
      toast.error("Please connect your SUI wallet first");
      return;
    }
    if (!address.fullName || !address.street || !address.city) {
      toast.error("Please fill in your shipping address");
      return;
    }

    try {
      setIsLoading(true);
      
      const merchantAddress = process.env.NEXT_PUBLIC_MERCHANT_SUI_ADDRESS;
      if (!merchantAddress) {
        throw new Error("Merchant address not configured");
      }

      // 1. Build SUI Transaction
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalMist)]);
      tx.transferObjects([coin], tx.pure.address(merchantAddress));

      // 2. Sign and Execute via Wallet
      const response = await signAndExecuteTransaction({
        transaction: tx,
      });

      // 3. Send to backend to verify and create order
      const verifyRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: response.digest,
          items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
          address,
          totalAmount: totalUSD,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Payment verification failed");
      }

      toast.success("Payment successful! Order placed.");
      clearCart();
      router.push("/profile");
      
    } catch (error) {
      console.error(error);
      const e = error as Error;
      toast.error(e.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push("/products")}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment with SUI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 border-b pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>${totalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>SUI Equivalent</span>
                  <span>~{totalSui} SUI</span>
                </div>
              </div>

              {!currentAccount ? (
                <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-md text-sm text-center">
                  Please connect your wallet using the button in the top right corner to proceed.
                </div>
              ) : (
                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={handlePayment} 
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Pay ${totalSui} SUI`}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
