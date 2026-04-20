# 📜 Mệnh Thư - Thiên Thời Độc Thư

**Mệnh Thư** là một ứng dụng huyền học hiện đại, kết hợp giữa tri thức cổ xưa (Tử vi, Ngũ hành) và trí tuệ nhân tạo (LLM - Large Language Model) để đưa ra những lời khuyên và gợi ý sách phù hợp với năng lượng cá nhân của người dùng tại thời điểm thực tế.

---

## 🌟 Tính năng chính

- **Luận giải Ngũ hành:** Tự động tính toán Can Chi và Bản mệnh dựa trên ngày sinh.
- **Thiên độ thời gian:** Phân tích năng lượng của giờ hiện tại (Giờ Hoàng Đạo) để kết hợp luận giải.
- **Gợi ý sách thông minh:** Sử dụng AI (Ollama - gpt-oss) để đóng vai "Thầy luận giải", đưa ra tên sách và lời khuyên sắc bén.
- **Giao diện huyền bí:** Hiệu ứng hạt (particles), chuyển cảnh tâm linh và phong cách Glassmorphism sang trọng.

---

## 🏗️ Kiến trúc hệ thống

Dự án gồm 2 phần chính:
1.  **Backend (FastAPI):** Xử lý logic tính toán Can Chi, kết nối với Ollama Local API để sinh lời giải.
2.  **Frontend (React + Vite):** Giao diện người dùng tương tác, hiệu ứng chuyển động và hiển thị kết quả.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### 1. Yêu cầu hệ thống
- **Node.js** (v18+)
- **Python** (3.9+)
- **Ollama** (Đã cài đặt model `gpt-oss:20b` hoặc tương đương)

### 2. Khởi chạy Backend
Mở terminal và di chuyển vào thư mục `backend`:
```bash
cd backend
# Tạo môi trường ảo (khuyên dùng)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# Hoặc: venv\Scripts\activate  # Windows

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy server
python main.py
```
*Server sẽ chạy tại: `http://localhost:9000`*

### 3. Khởi chạy Frontend
Mở một terminal mới và di chuyển vào thư mục `frontend`:
```bash
cd frontend
# Cài đặt dependencies
npm install

# Chạy chế độ phát triển
npm run dev
```
*Truy cập ứng dụng tại: `http://localhost:5173`*

### 4. Thiết lập AI (Ollama)
Đảm bảo bạn đã cài đặt model AI trong Ollama. Nếu dùng model khác, hãy chỉnh sửa biến `MODEL_NAME` trong `backend/main.py`.
```bash
ollama run gpt-oss:20b
```

---

## 📖 Hướng dẫn sử dụng

1.  **Nhập thông tin:** Điền Họ tên và Ngày tháng năm sinh của bạn vào form chính.
2.  **Khai mở vận mệnh:** Nhấn nút "Khai Mở Vận Mệnh".
3.  **Chờ đợi linh khí:** Hệ thống sẽ thực hiện một nghi thức "Gieo quẻ" ảo với hiệu ứng hoạt họa huyền bí.
4.  **Đón nhận kết quả:** 
    - Xem bản mệnh Can Chi của bạn.
    - Đọc lời luận giải về năng lượng hiện tại từ "Thầy luận giải AI".
    - Nhận tên cuốn sách được đề xuất dành riêng cho bạn.
    - Luận giải ý nghĩa lời khuyên và khẩu quyết.

---

## 🎨 Công nghệ sử dụng

- **Frontend:** React, TypeScript, Vite, CSS Animations, Lucide React.
- **Backend:** FastAPI (Python), Pydantic, Requests.
- **AI:** Ollama Local LLM.

---

## 👨‍💻 Tác giả
Dự án được phát triển bởi **Antigravity** dựa trên ý tưởng của người dùng.
