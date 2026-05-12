"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Package, Search, Filter } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imageUrls, setImageUrls] = useState("");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterBrand, setFilterBrand] = useState("ALL");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch("/api/products").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
        fetch("/api/brands").then(r => r.json())
      ]);
      if (prodRes.products) setProducts(prodRes.products);
      if (catRes.categories) setCategories(catRes.categories);
      if (brandRes.brands) setBrands(brandRes.brands);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const openForm = (product: Partial<Product> = {}) => {
    setCurrentProduct(product);
    setImageUrls(product.images ? product.images.join(", ") : "");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !currentProduct.id;
      const url = isNew ? "/api/products" : `/api/products/${currentProduct.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const payload = {
        ...currentProduct,
        images: imageUrls.split(",").map(url => url.trim()).filter(url => url !== ""),
      };

      if (!payload.images || payload.images.length === 0) {
        payload.images = ["https://via.placeholder.com/300"];
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save product");
      }
      
      toast.success(`Product ${isNew ? "created" : "updated"} successfully`);
      setIsEditing(false);
      setCurrentProduct({});
      fetchData();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully");
      fetchData();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "ALL" || p.categoryId === filterCategory;
    const matchesBrand = filterBrand === "ALL" || p.brandId === filterBrand;
    return matchesSearch && matchesCat && matchesBrand;
  });

  if (isLoading) return <div className="flex items-center justify-center h-96">Loading products...</div>;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage your store&apos;s inventory and product details.</p>
        </div>
        <Button onClick={() => openForm()} size="lg" className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-5 w-5" /> Add New Product
        </Button>
      </div>

      {isEditing && (
        <Card className="shadow-lg border-primary/20 animate-in slide-in-from-top-4">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {currentProduct.id ? "Edit Product Details" : "Create New Product"}
            </CardTitle>
            <CardDescription>Fill in the required information below to publish your product.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="e.g. MacBook Pro M3"
                  value={currentProduct.name || ""}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input
                  placeholder="e.g. macbook-pro-m3"
                  value={currentProduct.slug || ""}
                  onChange={e => setCurrentProduct({...currentProduct, slug: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentProduct.price || ""}
                  onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentProduct.stock || ""}
                  onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={currentProduct.categoryId || ""}
                  onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Select a Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={currentProduct.brandId || ""}
                  onChange={e => setCurrentProduct({...currentProduct, brandId: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Select a Brand --</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Image URLs
                </label>
                <Input
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.png"
                  value={imageUrls}
                  onChange={e => setImageUrls(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate multiple image URLs with commas.</p>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Product Description</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Describe your product here..."
                  value={currentProduct.description || ""}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t">
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center bg-muted/20">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products by name..." 
              className="pl-9 bg-background w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select 
              className="flex h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={filterBrand}
              onChange={e => setFilterBrand(e.target.value)}
            >
              <option value="ALL">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Name & Details</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 w-20">
                      <div className="h-12 w-12 rounded-lg bg-muted border overflow-hidden">
                        <img 
                          src={product.images[0] || "https://via.placeholder.com/150"} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150' }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-base">{product.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                        {product.description}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-primary">${product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openForm(product)} className="hover:bg-primary/10 hover:text-primary mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
