"use client";

import Link from "next/link";
import { ShoppingCart, User, Package, Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@mysten/dapp-kit";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Đăng xuất thành công");
        window.location.href = "/login"; // Force refresh to clear middleware states
      }
    } catch {
      toast.error("Đăng xuất thất bại");
    }
  };

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.header 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <motion.div variants={itemVariants}>
          <Link href="/" className="flex items-center gap-2 mr-6 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
              SUI STORE
            </span>
          </Link>
        </motion.div>

        <motion.nav className="hidden md:flex items-center gap-8 text-sm font-medium" variants={itemVariants}>
          <Link href="/products" className="relative group transition-colors hover:text-primary text-foreground/80">
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="relative group transition-colors hover:text-primary text-foreground/80">
            About us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </motion.nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <motion.div className="w-full flex-1 md:w-auto md:flex-none" variants={itemVariants}>
            <form className="relative group" onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              if (q) router.push(`/products?q=${encodeURIComponent(q as string)}`);
            }}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                name="q"
                placeholder="Tìm kiếm sản phẩm..."
                className="flex h-9 w-full md:w-[250px] lg:w-[300px] rounded-full border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-transparent focus:w-full md:focus:w-[320px] pl-8"
              />
            </form>
          </motion.div>
          <motion.nav className="flex items-center space-x-2" variants={itemVariants}>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Đăng xuất" className="hover:bg-red-500/10 hover:text-red-500 transition-colors rounded-full">
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="sr-only">Đăng xuất</span>
            </Button>
            <div className="ml-2">
              <ThemeToggle />
            </div>
            <div className="ml-2 hidden sm:block">
              <ConnectButton />
            </div>
          </motion.nav>
        </div>
      </div>
    </motion.header>
  );
}
