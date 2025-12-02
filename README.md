# ESP32 Car Controller

Ứng dụng web mobile hiện đại để điều khiển xe 3 bánh ESP32 qua Bluetooth Low Energy (BLE).

## Tính năng

- **Hai chế độ điều khiển** - Thủ công và Lập trình
- **Nút điều khiển trực tiếp** - Tiến, Lùi, Trái, Phải, Dừng
- **Lập trình khối (Block Programming)** - Tạo chuỗi lệnh tự động
- **Điều chỉnh tốc độ** - Thanh trượt và nút tăng/giảm (0-255)
- **Giao diện dark mode** - Hiện đại với hiệu ứng glassmorphism
- **PWA Support** - Cài đặt lên home screen như app thật
- **Responsive Design** - Hoạt động tốt trên mọi kích thước màn hình
- **Smooth Animations** - Chuyển động mượt mà, trải nghiệm cao cấp

## Yêu cầu hệ thống

### Trình duyệt hỗ trợ Web Bluetooth API:

**Android:**
- Chrome (phiên bản mới nhất)
- Edge (phiên bản mới nhất)

**iOS/iPadOS:**
- Safari (iOS 16.4 trở lên)
- Chrome (iOS 16.4 trở lên)
- **Lưu ý:** Cần bật tính năng Web Bluetooth trong Settings

**Desktop:**
- Chrome
- Edge
- Opera

### Phần cứng:
- ESP32 với code BLE đã upload
- Module L298N
- Xe 3 bánh với động cơ DC

##  Hướng dẫn sử dụng

### 1. Chuẩn bị

1. **Upload code lên ESP32:**
   - Mở code ESP32 trong Arduino IDE
   - Đảm bảo tên BLE device là `ESP32_CAR`
   - Chọn board ESP32 và cổng COM phù hợp
   - Upload code lên board

2. **Cấp nguồn cho xe:**
   - Bật nguồn cho ESP32 và module L298N
   - ESP32 sẽ tự động bắt đầu phát BLE với tên `ESP32_CAR`

### 2. Mở ứng dụng

**Cách 1: Mở trực tiếp từ file**
- Mở file `index.html` bằng trình duyệt hỗ trợ
- **Lưu ý:** Một số trình duyệt yêu cầu HTTPS, nên dùng cách 2

**Cách 2: Chạy web server (Khuyến nghị)**

Sử dụng Python:
```bash
cd car-control-app
python -m http.server 8000
```

Hoặc Node.js:
```bash
npx http-server -p 8000
```

Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

**Cách 3: Truy cập từ điện thoại (qua mạng LAN)**

1. Chạy web server như cách 2
2. Tìm IP address của máy tính (ví dụ: 192.168.1.100)
3. Trên điện thoại, mở trình duyệt và truy cập: `http://192.168.1.100:8000`

### 3. Kết nối và điều khiển

1. **Kết nối BLE:**
   - Nhấn nút "Kết nối BLE"
   - Chọn `ESP32_CAR` từ danh sách thiết bị
   - Đợi kết nối thành công (chấm tròn chuyển xanh)

2. **Chế độ Thủ công:**
   - Nhấn giữ nút để xe di chuyển (Tiến/Lùi/Trái/Phải)
   - Thả ra để dừng
   - Nhấn nút "Dừng" để dừng ngay lập tức

3. **Chế độ Lập trình:**
   - Chuyển sang tab "Lập trình"
   - Nhấn vào các khối lệnh để thêm vào chuỗi
   - Điều chỉnh thời gian (ms) cho mỗi khối
   - Nhấn "Chạy" để thực thi chuỗi lệnh
   - Có thể "Tạm dừng" hoặc "Dừng" trong khi chạy
   

4. **Điều chỉnh tốc độ:**
   - Kéo thanh trượt hoặc nhấn nút +/-
   - Phạm vi: 0-255
   - Mặc định: 200

### 4. Cài đặt như PWA (Tùy chọn)

**Android (Chrome):**
1. Mở menu (⋮)
2. Chọn "Add to Home screen"
3. App sẽ xuất hiện trên home screen

**iOS (Safari):**
1. Nhấn nút Share 
2. Chọn "Add to Home Screen"
3. App sẽ xuất hiện như app native

## Troubleshooting

### Không tìm thấy ESP32_CAR
- Kiểm tra ESP32 đã bật và chạy code chưa
- Kiểm tra Bluetooth điện thoại đã bật chưa
- Thử reset ESP32 và kết nối lại

### Không kết nối được
- Đảm bảo đang dùng trình duyệt hỗ trợ Web Bluetooth
- Truy cập qua HTTPS hoặc localhost
- Thử tắt/bật Bluetooth và thử lại

### iOS không hoạt động
- Cần iOS 16.4 trở lên
- Vào Settings → Safari → Advanced → Experimental Features
- Bật "Web Bluetooth"

### Xe không di chuyển
- Kiểm tra kết nối BLE (chấm tròn xanh)
- Kiểm tra nguồn cấp cho L298N
- Kiểm tra tốc độ (phải > 0)
- Kiểm tra kết nối dây giữa ESP32 và L298N

### Không chạy được chương trình khối
- Đảm bảo đã kết nối BLE
- Kiểm tra đã thêm khối lệnh vào chuỗi chưa
- Nút "Chạy" chỉ hoạt động khi đã kết nối

## Giao diện

- **Header:** Tên app và trạng thái kết nối
- **Connection:** Nút kết nối/ngắt kết nối BLE
- **Speed Control:** Điều chỉnh tốc độ động cơ
- **Mode Switcher:** Chuyển đổi giữa chế độ Thủ công và Lập trình
- **Manual Mode:** Các nút điều khiển trực tiếp
- **Programming Mode:** 
  - Block Palette - Bảng chọn khối lệnh
  - Workspace - Chuỗi lệnh đã tạo
  - Execution Controls - Nút chạy/dừng
- **Info:** Hướng dẫn sử dụng

## Công nghệ sử dụng

- **HTML5** - Cấu trúc semantic
- **CSS3** - Glassmorphism, animations, gradients
- **JavaScript (Vanilla)** - Web Bluetooth API
- **Web Bluetooth API** - Giao tiếp với ESP32
- **PWA** - Progressive Web App support

## Lưu ý

- Ứng dụng chỉ hoạt động với ESP32 có tên `ESP32_CAR`
- Cần kết nối internet lần đầu để tải Google Fonts
- Sau khi cài PWA, có thể dùng offline
- Touch events được tối ưu cho mobile
- Tự động dừng xe khi ngắt kết nối
- Chế độ lập trình yêu cầu kết nối BLE trước khi chạy

## Bảo mật

- BLE connection chỉ trong phạm vi vài mét
- Không lưu trữ dữ liệu cá nhân
- Code chạy hoàn toàn trên client-side

## License

MIT License - Tự do sử dụng và chỉnh sửa

---

**Phát triển bởi:** Antigravity AI Assistant  
**Phiên bản:** 2.0  
**Ngày cập nhật:** 2025-11-27
