"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe, Cpu, Laptop, Headphones, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center bg-background relative overflow-hidden py-12 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-0"
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-0"
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
          <motion.div 
            className="flex flex-col items-center space-y-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4 max-w-4xl" variants={itemVariants}>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                The Future of E-commerce
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                Trải nghiệm thanh toán liền mạch, an toàn và tức thì được hỗ trợ bởi SUI Blockchain. Khám phá các thiết bị điện tử cao cấp mang thiết kế của tương lai, giao hàng tận nơi ngay hôm nay.
              </p>
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto" variants={itemVariants}>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all hover:scale-105">
                  SUI STORE <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg border-2 hover:bg-muted transition-colors">
                  ABOUT US
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-8 flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Instant SUI Payment</span>
              <span className="hidden sm:flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Global Shipping</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> 100% Security</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Highlight Section */}
      <section className="w-full py-16 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-16 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-xl font-semibold hover:text-primary transition-colors cursor-pointer"><Laptop className="h-6 w-6" /> Laptop Cao Cấp</div>
            <div className="flex items-center gap-2 text-xl font-semibold hover:text-primary transition-colors cursor-pointer"><Cpu className="h-6 w-6" /> Linh Kiện PC</div>
            <div className="flex items-center gap-2 text-xl font-semibold hover:text-primary transition-colors cursor-pointer"><Headphones className="h-6 w-6" /> Thiết Bị Ngoại Vi</div>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Tại Sao Chọn SUI Store?</h2>
            <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">Chúng tôi kết hợp công nghệ blockchain tiên tiến với hệ thống bán lẻ thiết bị điện tử cao cấp nhằm mang lại cho bạn trải nghiệm mua sắm tuyệt vời nhất.</p>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="group">
              <Card className="bg-card hover:bg-muted/50 border-border shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300">
                    <Zap className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Nhanh Như Chớp</h3>
                  <p className="text-muted-foreground leading-relaxed">Giao dịch được xử lý chưa tới một giây nhờ kiến trúc mạng SUI cực kỳ linh hoạt. Nói lời tạm biệt với việc chờ đợi ngân hàng chuyển khoản.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <Card className="bg-card hover:bg-muted/50 border-border shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300">
                    <Shield className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Bảo Mật Cốt Lõi</h3>
                  <p className="text-muted-foreground leading-relaxed">Các khoản thanh toán được xác minh bằng blockchain đảm bảo tính bảo mật, minh bạch và an toàn tuyệt đối cho mỗi đơn hàng. Không sợ lừa đảo hay bùng tiền.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="group">
              <Card className="bg-card hover:bg-muted/50 border-border shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300">
                    <Globe className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Truy Cập Toàn Cầu</h3>
                  <p className="text-muted-foreground leading-relaxed">Mua sắm thiết bị điện tử cao cấp từ mọi nơi trên thế giới bằng ví tiền điện tử yêu thích của bạn ngay tức thì. Không biên giới, không giới hạn.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full py-20 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Được tin dùng bởi hàng ngàn tín đồ công nghệ</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-xl font-medium max-w-2xl mx-auto">&quot;Quá trình thanh toán cực kỳ mượt mà. Tôi đã thanh toán bằng SUI và đơn hàng được xác nhận chỉ trong vỏn vẹn 2 giây. Chiếc Macbook được giao đến 2 ngày sau đó.&quot;</p>
          <p className="mt-6 text-muted-foreground font-semibold">— Alex Chen, Nhà phát triển Web3</p>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
