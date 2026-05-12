"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-muted/10 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Về SUI Store</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thế hệ tiếp theo của thương mại phi tập trung, được vận hành bởi mạng lưới SUI blockchain nhanh như chớp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chúng tôi tin rằng tương lai của thương mại là không biên giới, không cần cấp phép và tức thì. 
              Bằng cách tận dụng SUI blockchain, chúng tôi đang loại bỏ các cổng thanh toán truyền thống, 
              giảm thiểu phí giao dịch và cung cấp trải nghiệm mua sắm mượt mà cho người dùng trên toàn thế giới.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nền tảng của chúng tôi đảm bảo mọi giao dịch đều an toàn, minh bạch và hoàn tất chỉ trong tính bằng mili-giây.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Xử Lý Tức Thì</h3>
                  <p className="text-muted-foreground">Không cần chờ đợi xác nhận khối.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Bảo Mật Bằng Mật Mã</h3>
                  <p className="text-muted-foreground">Tiền của bạn luôn được an toàn.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ký Quỹ Minh Bạch</h3>
                  <p className="text-muted-foreground">Smart contracts xử lý quy trình hoàn tiền.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
