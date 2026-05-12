import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
      },
    });
    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const specs = product.specs ? (product.specs as Record<string, string>) : {};

  return (
    <div className="bg-muted/10 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-background rounded-3xl shadow-sm border border-border/50 p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images Gallery */}
            <div className="space-y-6">
              <div className="aspect-square relative bg-white rounded-2xl overflow-hidden border border-border/40 flex items-center justify-center p-12 group">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-12 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <div className="h-16 w-16 bg-muted rounded-full" />
                    <span>No Image Available</span>
                  </div>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="absolute top-6 right-6 text-sm px-4 py-1.5 shadow-md">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Gallery (Placeholder for multi-image) */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="h-24 w-24 flex-shrink-0 relative bg-white border border-border/40 rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
                      <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 px-3 py-1">
                  {product.brand?.name}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {product.category?.name}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">{product.name}</h1>
              <div className="flex items-end gap-4 mb-8">
                <p className="text-4xl md:text-5xl font-black text-foreground">${product.price.toLocaleString()}</p>
                <p className="text-muted-foreground mb-1">Paid securely in SUI</p>
              </div>

              <div className="prose prose-sm sm:prose-base dark:prose-invert mb-10 text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">
                  Experience top-tier performance with this premium electronic device. 
                  Designed for professionals and enthusiasts alike, it delivers uncompromising quality and reliability.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 mb-8">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || "",
                    slug: product.slug,
                  }}
                  stock={product.stock}
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span>Free Global Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span>Instant SUI Settlement</span>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Specifications */}
              {Object.keys(specs).length > 0 ? (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-border/50 pb-3">
                        <span className="text-sm text-muted-foreground mb-1">{key}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Features & Details</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0"/> <span className="text-muted-foreground">Premium build quality and materials.</span></li>
                    <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0"/> <span className="text-muted-foreground">Optimized for maximum efficiency and power.</span></li>
                    <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary flex-shrink-0"/> <span className="text-muted-foreground">Compatible with the latest software standards.</span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
