# Deploy to Vercel

## Lựa chọn 1: Deploy qua Vercel Dashboard (Dễ nhất)

### Bước 1: Tạo Git Repository

1. Cài Git nếu chưa có: https://git-scm.com/download/win
2. Mở Terminal trong thư mục `car-control-app`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Push lên GitHub:
   - Tạo repository mới trên GitHub (https://github.com/new)
   - Chạy lệnh:
     ```bash
     git remote add origin https://github.com/USERNAME/esp32-car-control.git
     git branch -M main
     git push -u origin main
     ```

### Bước 2: Deploy lên Vercel

1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository `esp32-car-control`
5. Click **"Deploy"**
6. Đợi vài giây → **Xong!**

Vercel sẽ tự động:
- Build và deploy app
- Cấp cho bạn URL HTTPS (ví dụ: `https://esp32-car-control.vercel.app`)
- Auto-deploy mỗi khi bạn push code mới

---

## Lựa chọn 2: Deploy qua Vercel CLI (Nhanh hơn)

### Bước 1: Cài Vercel CLI

```bash
npm install -g vercel
```

### Bước 2: Login

```bash
vercel login
```

Nhập email → Xác nhận qua email

### Bước 3: Deploy

```bash
cd c:\DOAN\car-control-app
vercel
```

Trả lời các câu hỏi:
- Set up and deploy? **Yes**
- Which scope? **Chọn account của bạn**
- Link to existing project? **No**
- Project name? **esp32-car-control** (hoặc tên khác)
- Directory? **./*** (Enter)
- Override settings? **No**

Sau vài giây, bạn sẽ nhận được:
```
✅  Deployed to production
🔗 https://esp32-car-control.vercel.app
```

---

## Sử dụng App sau khi Deploy

1. **Trên iPhone**: Mở Safari, truy cập URL Vercel của bạn
2. **Bật Web Bluetooth** trong Safari settings (iOS 16.4+)
3. **Kết nối BLE** với ESP32_CAR
4. **Điều khiển xe** từ bất kỳ đâu có internet!

---

## Lưu ý quan trọng

✅ **HTTPS tự động** - Vercel cung cấp SSL certificate miễn phí  
✅ **Global CDN** - App load nhanh từ mọi nơi  
✅ **Auto-deploy** - Push code là tự động deploy  
✅ **Free tier** - Đủ cho project này  

⚠️ **Web Bluetooth chỉ hoạt động qua HTTPS** (không phải HTTP)  
⚠️ **ESP32 phải trong tầm Bluetooth** của điện thoại  

---

## Troubleshooting

### Lỗi: Command not found - git
→ Cài Git: https://git-scm.com/download/win

### Lỗi: Command not found - vercel
→ Chạy: `npm install -g vercel`

### Lỗi: Permission denied
→ Chạy Terminal với quyền Administrator

### iPhone không kết nối BLE
1. Kiểm tra iOS >= 16.4
2. Bật Web Bluetooth trong Safari → Advanced → Experimental Features
3. Đảm bảo đang dùng Safari (không phải Chrome)
4. ESP32 phải đang chạy và trong tầm Bluetooth

---

## Update App sau này

```bash
# Sửa code...
git add .
git commit -m "Update features"
git push

# Vercel tự động deploy!
```

Hoặc với Vercel CLI:
```bash
vercel --prod
```
