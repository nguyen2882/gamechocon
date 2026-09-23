# 🌟 Bé Vui Học - Trò Chơi Giáo Dục Sớm Cho Trẻ 3 Tuổi

Ứng dụng trò chơi tương tác giáo dục sớm dành cho các bé lứa tuổi mầm non (3 tuổi), tập trung vào:
- 🗣️ **Phát triển ngôn ngữ & Luyện phát âm:** Giọng đọc mẫu tiếng Việt chuẩn, to rõ ràng; tích hợp Micro nhận diện giọng nói và khen thưởng.
- 🐶 **Làm giàu vốn từ vựng:** 4 chủ đề gần gũi (Động vật, Hoa quả, Xe cộ, Màu sắc & Hình khối).
- 🧩 **Phát triển trí thông minh & tư duy:** Ghép bóng ma thuật (Shadow Match), đố vui thông minh (Smart Quiz), lật thẻ tìm cặp (Memory Match).
- 🎨 **Giao diện kẹo ngọt:** Màu sắc tươi sáng, nút bấm 3D nảy (bouncy), âm thanh vui tươi, nổ pháo hoa và bộ sưu tập huy hiệu bé ngoan.

---

## 🚀 Cách Chạy Trò Chơi

### 1. Mở trực tiếp (Offline)
Chỉ cần nhấp đúp vào file `index.html` để mở trên bất kỳ trình duyệt nào (Chrome, Edge, Safari).

### 2. Chạy qua máy chủ nội bộ (Local Server)
Nếu muốn cấp quyền Microphone tốt nhất hoặc mở trên điện thoại/iPad trong cùng mạng Wi-Fi:
```bash
node scripts/local-server.js
```
Truy cập:
- Trên máy tính: `http://localhost:3000`
- Trên điện thoại/máy tính bảng: `http://<IP-may-tinh>:3000`

---

## 📁 Cấu Trúc Dự Án
- `index.html`: Giao diện chính của trò chơi
- `game.css`: Toàn bộ phong cách thiết kế, màu sắc pastel và hoạt họa
- `data.js`: Kho từ vựng, hình ảnh emoji, câu đố và danh hiệu sticker
- `audio.js`: Bộ phát âm thanh & nhạc nền hộp nhạc tổng hợp bằng Web Audio API
- `speech.js`: Bộ xử lý giọng đọc Text-To-Speech và Micro nhận diện tiếng bé
- `game.js`: Logic điều khiển các trò chơi, tính điểm sao và pháo hoa
- `server.js`: Máy chủ Node.js siêu nhẹ
