"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ProductType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  brand?: { name: string } | null;
  category?: { name: string } | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductsClient({ products, initialSearchQuery = "" }: { products: ProductType[], initialSearchQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Tất Cả Sản Phẩm</h1>
          <p className="text-muted-foreground mt-2 text-lg">Khám phá bộ sưu tập thiết bị điện tử cao cấp của chúng tôi.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Tìm theo tên, thương hiệu, hoặc danh mục..." 
            className="pl-10 h-12 rounded-full bg-muted/50 border-primary/20 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-32 bg-card/30 rounded-3xl border border-border/50"
        >
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-xl text-muted-foreground font-medium">Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} layout>
              <Link href={`/products/${product.slug}`}>
                <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-pointer group h-full flex flex-col bg-card/60 backdrop-blur-sm">
                  <div className="aspect-square relative bg-white flex items-center justify-center p-6 border-b border-border/40">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110 p-6"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary rounded flex items-center justify-center text-muted-foreground">
                        Chưa Có Ảnh
                      </div>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute top-3 right-3 shadow-sm">
                        Hết Hàng
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">{product.brand?.name}</Badge>
                      <p className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">{product.category?.name}</p>
                    </div>
                    <h3 className="font-bold line-clamp-2 text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 mt-auto flex justify-between items-center">
                    <p className="font-extrabold text-2xl">${product.price.toLocaleString()}</p>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
