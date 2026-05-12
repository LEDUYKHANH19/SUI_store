"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  stock: number;
}

export function AddToCartButton({ product, stock }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Button
      size="lg"
      className="w-full md:w-auto h-12 px-8"
      onClick={handleAddToCart}
      disabled={stock === 0}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {stock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
