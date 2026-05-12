import prisma from "@/lib/prisma";
import ProductsClient from "./products-client";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const products = await getProducts();
  const { q } = await searchParams;

  return <ProductsClient products={products} initialSearchQuery={typeof q === "string" ? q : ""} />;
}
