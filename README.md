# 🦌🎀 Naby Coquette Wardrobe (`_naby.coquette`)

Website tủ đồ tuyển chọn, đồ pass & ký gửi thời trang mang phong cách **Vintage Fawn & Rose Lace Coquette / Shabby Chic** được thiết kế riêng cho shop `_naby.coquette`.

---

## ✨ CÁC ĐẶC ĐIỂM NỔI BẬT

1. **Phong cách Vintage Thơ Mộng**:
   - Nền vải thô dệt tự nhiên kết hợp ảnh họa tiết chú nai con thắt nơ hồng & hoa nhí cổ điển (`assets/pattern-bg.jpg`).
   - Hai dải viền ren thêu nổi (lace trim) trên và dưới trang web.
   - Logo avatar tròn viền chỉ khâu và khung huy hiệu Cameo Medallion lồng ảnh shop (`assets/avatar.jpg`).
   - Font chữ thư pháp Pháp uốn lượn *Pinyon Script* và Serif cổ điển *Cormorant Garamond*.

2. **Tủ Đồ Tuyển Chọn & Bộ Lọc**:
   - Dải chữ chạy Marquee vô tận mang thông điệp dịu dàng.
   - Các tab lọc nhanh: *Tất cả đồ xinh*, *Váy đầm*, *Áo kiểu*, *Chân váy*, *Chỉ còn hàng*.
   - Thẻ sản phẩm bưu thiếp cổ điển với ảnh sắc nét, tag trạng thái (Còn hàng / Đã pass), size, độ mới, giá tiền.

3. **Giỏ Đơn & Chốt Đơn Qua Instagram**:
   - Ngăn kéo giỏ đơn (Cart Drawer) mở êm ái khi bấm "Đơn của bạn".
   - Tính tổng tiền tự động.
   - Bấm **"🎀 Gửi đơn qua Instagram 🎀"**: Tự động tạo cú pháp tin nhắn chốt đơn chi tiết, sao chép vào bộ nhớ và mở thẳng Instagram shop `_naby.coquette`.

---

## 🚀 CÁCH XEM VÀ CHẠY THỬ NGHIỆM TRÊN MÁY TÍNH

Mở Terminal và gõ:
```bash
python3 /Users/baopham/.gemini/antigravity/scratch/naby-coquette/server.py
```
Hoặc chỉ cần nhấp đúp trực tiếp vào file `index.html` để mở trên Safari/Chrome!

---

## 🛠️ CẤU TRÚC THƯ MỤC

```text
naby-coquette/
├── assets/
│   ├── avatar.jpg           # Ảnh đại diện logo shop Naby Coquette
│   └── pattern-bg.jpg       # Ảnh họa tiết chú nai & hoa nhí vintage
├── css/
│   └── style.css            # Toàn bộ CSS phong cách Vintage Fawn & Rose Lace
├── js/
│   ├── items.js             # Dữ liệu danh mục sản phẩm (thêm/sửa đồ tại đây)
│   └── app.js               # Logic lọc đồ, giỏ hàng, chốt đơn Instagram
├── index.html               # Trang web chính
├── server.py                # Server chạy thử nghiệm nội bộ (localhost:3000)
└── README.md                # Hướng dẫn sử dụng
```

---

## 🌐 HƯỚNG DẪN ĐẨY LÊN GITHUB & VERCEL (MIỄN PHÍ VĨNH VIỄN)

### Bước 1: Khởi tạo Git & Lưu code
Mở Terminal và chạy:
```bash
cd /Users/baopham/.gemini/antigravity/scratch/naby-coquette
git init
git add .
git commit -m "Khoi tao website Naby Coquette Wardrobe"
```

### Bước 2: Tạo Repository trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên repository: `naby-coquette`.
3. Chọn chế độ **Public** và bấm **Create repository**.
4. Chạy 2 lệnh GitHub cung cấp để đẩy code lên:
```bash
git remote add origin https://github.com/<tai-khoan-cua-ban>/naby-coquette.git
git branch -M main
git push -u origin main
```

### Bước 3: Đưa lên Vercel
1. Đăng nhập [vercel.com](https://vercel.com) bằng tài khoản GitHub.
2. Bấm nút **"Add New..."** -> **"Project"**.
3. Chọn repository `naby-coquette` và bấm **"Deploy"**.
4. Sau 30 giây, website của bạn sẽ hoạt động chính thức với đường link dạng `https://naby-coquette.vercel.app`!
