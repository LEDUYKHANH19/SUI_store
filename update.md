# Prompt Cap Nhat Du An SUI E-Commerce

Ban la senior full-stack engineer kiem security reviewer. Hay doc va sua truc tiep du an Next.js/Prisma/SUI ecommerce tai:

```text
D:/SUI/DuAn_Web_SUI/sui-ecommerce
```

Muc tieu: dua du an tu muc demo len gan production-ready, sua cac loi da phat hien va bo sung chuc nang thuc te. Truoc khi sua, hay doc cau truc du an, `package.json`, Prisma schema, auth, checkout, admin, cart, product pages. Khong reset git, khong xoa thay doi san co, khong commit tru khi duoc yeu cau.

## 1. Uu Tien Sua Loi P0

### 1.1. Sua production build/typecheck

Chay cac lenh:

```bash
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd prisma validate
```

Sua toan bo loi TypeScript hien co, gom:

- Recharts Tooltip formatter trong `src/app/admin/dashboard-charts.tsx`
- SUI client config trong `src/components/providers.tsx`
- SUI JsonRpc client trong `src/app/api/checkout/route.ts`
- Framer Motion variants bi loi type `ease`
- Cac loi `no-explicit-any` quan trong
- Cac loi unescaped JSX text

Tieu chi nghiem thu: `lint`, `typecheck`, `build`, `prisma validate` phai pass.

### 1.2. Sua checkout/payment cho an toan hon

Khong tin du lieu gia, `totalAmount`, `item.price` tu client.

Backend phai:

- Lay product tu DB theo `productId`
- Kiem tra product ton tai va con du ton kho
- Tinh lai subtotal/total tu DB
- Verify SUI transaction that:
  - transaction status la `success`
  - merchant address dung voi `NEXT_PUBLIC_MERCHANT_SUI_ADDRESS`
  - so tien merchant nhan dung voi `amountMist` can thanh toan
  - sender dung wallet nguoi dung neu co the xac dinh
  - `txHash` chua tung duoc dung
- Tao order, transaction va tru stock trong mot Prisma transaction
- Them idempotency/chong replay co ban
- Tra loi ro rang, khong leak stack trace

### 1.3. Sua loi cart link 404

Product detail dung slug, nhung cart dang link `/products/{id}`. Hay sua bang mot trong hai cach:

- Them `slug` vao `CartItem` va truyen slug khi add to cart
- Hoac doi logic route/link de cart tro dung den `/products/{slug}`

Dam bao bam ten san pham trong gio hang khong con 404.

## 2. Validation Va Security

### 2.1. Them validation cho API

Dung `zod` cho:

- Login
- Register
- Products create/update
- Checkout
- Category/brand create
- Order status update
- User role update

Can validate:

- Email dung dinh dang
- Password co do dai toi thieu
- Quantity la so nguyen duong
- Price/stock hop le
- Slug hop le
- Address day du
- Item quantity hop le

Tra status `400` voi message ro khi input sai.

### 2.2. Cai thien auth/security

- Cookie JWT can co `httpOnly`, `sameSite`, `secure` khi production, `path`, `maxAge`
- Them rate limit co ban cho login/register
- Chuan hoa JWT secret check
- Khong de user thuong truy cap admin APIs
- Bo sung password policy toi thieu
- Can nhac CSRF cho cac API mutate dung cookie auth

### 2.3. Cai thien tien te/database

- Khong nen dung `Float` cho tien. Chuyen sang `Decimal` hoac luu cents/MIST bang integer neu hop ly.
- Neu thay schema, tao migration hop ly va cap nhat code lien quan.
- Dam bao `npx.cmd prisma validate` pass.

## 3. UX Va Routing

### 3.1. Sua `/about`

`/about` dang 404 nhung navbar va homepage co link toi `/about`. Hay tao trang About/How it works chuyen nghiep hoac bo link neu khong can.

### 3.2. Lam navbar search that

Navbar search hien chi la input tinh. Hay lam:

- Nguoi dung nhap tu khoa va bam Enter thi di toi `/products?q=...`
- Products page doc query `q`, `category`, `brand` neu co
- Co empty state, loading state, error state hop ly

### 3.3. Cai thien products page

Bo sung hoac hoan thien:

- Search
- Filter category
- Filter brand
- Price range neu hop ly
- Stock status
- Sort theo gia/ngay tao

## 4. Admin

Admin products/orders/users hien fetch client-side va co lint issues. Hay:

- Sua sach type
- Giam `any`
- Them pagination hoac limit co ban cho danh sach lon
- Admin product form validate input
- Auto-generate slug tu ten neu slug trong
- Order status update co confirm/feedback ro rang
- Low-stock indicators trong admin products/dashboard

## 5. Chuc Nang Nen Them De Chuyen Nghiep Hon

Hay bo sung cac chuc nang sau neu phu hop voi cau truc hien co:

- Trang order detail cho user: `/profile/orders/[id]` hoac `/orders/[id]`
- Quan ly dia chi giao hang trong profile
- Luu `walletAddress` vao user profile khi checkout hoac co nut lien ket vi
- Wishlist/favorites co ban
- Product reviews/rating co ban neu schema `Review` da co
- Email notification mock hoac abstraction de sau nay tich hop Resend/SMTP
- Trang chinh sach: shipping, returns, privacy hoac gom trong About

## 6. Test

Them test setup phu hop voi stack hien tai. Uu tien:

- Vitest cho unit/API helper
- Playwright cho e2e neu hop ly

Toi thieu can test:

- Register/login validation
- Protected API unauthorized
- Product listing
- Cart item slug/link logic
- Checkout tinh total tu DB, khong tin client price
- Admin permission

Them scripts trong `package.json`:

```json
{
  "test": "...",
  "typecheck": "tsc --noEmit",
  "test:e2e": "..."
}
```

Neu khong them duoc e2e vi gioi han moi truong, hay giai thich ro va van them unit/integration tests co the chay duoc.

## 7. Dependency Va Audit

Chay:

```bash
npm.cmd audit --omit=dev
```

Khong chay `npm audit fix --force` mu. Neu co ban va an toan thi cap nhat co kiem soat. Ghi lai phan chua the xu ly neu dependency upstream chua co fix on dinh.

## 8. Cap Nhat Docs

README dang noi Next.js 15 nhung `package.json` dung Next `16.2.6`. Hay sua README va bo sung:

- Setup local
- Env variables
- Prisma migrate/generate/seed
- Test
- Build
- Production notes
- Checklist bao mat/payment cho SUI testnet/mainnet

## 9. Yeu Cau Chat Luong

- Giu style hien co, khong refactor lan man
- Khong them dependency nang neu khong can
- Khong dung `any` tru khi co ly do ro va duoc isolate
- Khong mo image remote wildcard trong production; gioi han domain hop ly hoac giai thich cau hinh
- Khong reset git, khong revert thay doi khong phai cua minh
- Moi thay doi can co ly do ky thuat ro rang

## 10. Lenh Kiem Tra Cuoi

Sau khi sua xong, chay:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd test
npx.cmd prisma validate
```

Neu co them e2e:

```bash
npm.cmd run test:e2e
```

## 11. Bao Cao Cuoi Cung

Bao cao bang tieng Viet, ngan gon nhung du thong tin:

- File da sua
- Loi da sua
- Chuc nang da them
- Lenh kiem tra da chay va ket qua
- Phan con rui ro/chua lam duoc
- Huong dan tiep theo neu can migrate DB hoac set env
