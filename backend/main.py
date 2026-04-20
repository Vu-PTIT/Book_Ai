from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import datetime
import urllib.parse
from lunar_python import Solar, EightChar

# Sử dụng model gpt-oss qua Ollama
OLLAMA_API_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "gpt-oss:latest"

# Mapping Can-Chi sang Tiếng Việt
STEMS_VN = {
    '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
    '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý'
}
BRANCHES_VN = {
    '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
    '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi'
}

NAYIN_VN = {
    '海中金': 'Hải Trung Kim', '炉中火': 'Lư Trung Hỏa', '大林木': 'Đại Lâm Mộc',
    '路旁土': 'Lộ Bàng Thổ', '剑锋金': 'Kiếm Phong Kim', '山头火': 'Sơn Đầu Hỏa',
    '涧下水': 'Giản Hạ Thủy', '城头土': 'Thành Đầu Thổ', '白蜡金': 'Bạch Lạp Kim',
    '杨柳木': 'Dương Liễu Mộc', '泉中水': 'Tuyền Trung Thủy', '屋上土': 'Ốc Thượng Thổ',
    '霹雳火': 'Tích Lịch Hỏa', '松柏木': 'Tùng Bách Mộc', '长流水': 'Trường Lưu Thủy',
    '沙中金': 'Sa Trung Kim', '山下火': 'Sơn Hạ Hỏa', '平地木': 'Bình Địa Mộc',
    '壁上土': 'Bích Thượng Thổ', '金箔金': 'Kim Bạch Kim', '覆灯火': 'Phúc Đăng Hỏa',
    '天河水': 'Thiên Hà Thủy', '大驿土': 'Đại Dịch Thổ', '钗钏金': 'Thoa Xuyến Kim',
    '桑柘木': 'Tang Đố Mộc', '大溪水': 'Đại Khê Thủy', '沙中土': 'Sa Trung Thổ',
    '天上火': 'Thiên Thượng Hỏa', '石榴木': 'Thạch Lựu Mộc', '大海水': 'Đại Hải Thủy'
}

def translate_gan_zhi(gz_str: str) -> str:
    if not gz_str or len(gz_str) < 2:
        return gz_str
    # Normalize unicode to ensure matching works
    import unicodedata
    gz_str = unicodedata.normalize('NFC', gz_str)
    gan = STEMS_VN.get(gz_str[0], gz_str[0])
    zhi = BRANCHES_VN.get(gz_str[1], gz_str[1])
    return f"{gan} {zhi}"

def translate_nayin(nayin_str: str) -> str:
    if not nayin_str:
        return ""
    import unicodedata
    nayin_str = unicodedata.normalize('NFC', nayin_str).strip()
    return NAYIN_VN.get(nayin_str, nayin_str)

def sanitize_chinese_chars(data):
    """
    Hệ thống phòng thủ cuối cùng: Loại bỏ mọi ký tự Hán nếu AI lỡ viết ra.
    """
    if isinstance(data, dict):
        return {k: sanitize_chinese_chars(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_chinese_chars(i) for i in data]
    elif isinstance(data, str):
        import re
        # Loại bỏ các ký tự trong dải Unicode của chữ Hán
        cleaned = re.sub(r'[\u4e00-\u9fff]+', '', data)
        # Loại bỏ khoảng trắng thừa do việc xóa ký tự để lại
        return re.sub(r'\s+', ' ', cleaned).strip()
    return data

def fetch_book_cover(title: str, author: str) -> str:
    """
    Tìm kiếm ảnh bìa sách qua Google Books API.
    """
    def search(query):
        try:
            encoded_query = urllib.parse.quote(query)
            url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                if items:
                    volume_info = items[0].get("volumeInfo", {})
                    image_links = volume_info.get("imageLinks", {})
                    img_url = image_links.get("thumbnail") or image_links.get("smallThumbnail", "")
                    if img_url:
                        # Force HTTPS
                        if img_url.startswith("http://"):
                            img_url = img_url.replace("http://", "https://", 1)
                        return img_url
        except Exception as e:
            print(f"Error in search '{query}': {e}")
        return ""

    # 1. Tìm kiếm theo Title + Author (Chính xác cao)
    cover_url = search(f"intitle:{title} inauthor:{author}")
    if cover_url:
        return cover_url
    
    # 2. Tìm kiếm theo Title (Rộng hơn)
    return search(title)

app = FastAPI(title="Mệnh Thư - Backend v2")

# Phục vụ file tĩnh (ảnh bìa mặc định)
import os
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Cho phép ứng dụng Vite Frontend gọi API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DivinationRequest(BaseModel):
    dob: str # yyyy-mm-dd
    full_name: str
    tob: str = "12:00" # hh:mm (mặc định nếu không nhập)

def get_bazi_details(date_str: str, time_str: str):
    """
    Sử dụng lunar-python để lấy Tứ Trụ (Bát Tự)
    """
    try:
        y, m, d = map(int, date_str.split("-"))
        h, mn = map(int, time_str.split(":"))
        
        print(f"Calculating Bazi for: {y}-{m}-{d} {h}:{mn}")
        solar = Solar.fromYmdHms(y, m, d, h, mn, 0)
        lunar = solar.getLunar()
        eight_char = lunar.getEightChar()
        
        return {
            "year": translate_gan_zhi(eight_char.getYear()),
            "month": translate_gan_zhi(eight_char.getMonth()),
            "day": translate_gan_zhi(eight_char.getDay()),
            "hour": translate_gan_zhi(eight_char.getTime()),
            "element": translate_nayin(eight_char.getYearNaYin())
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Bazi Error Detail: {e}")
        return None

@app.post("/api/recommend")
def recommend_book(request: DivinationRequest):
    try:
        # 1. Nhân (Người): Tính Bát tự của Tín chủ
        user_bazi = get_bazi_details(request.dob, request.tob)
        
        # 2. Thiên (Thời): Tính Bát tự của thời điểm hiện tại
        now = datetime.datetime.now()
        current_bazi = get_bazi_details(now.strftime("%Y-%m-%d"), now.strftime("%H:%M"))
        
        if not user_bazi or not current_bazi:
            raise HTTPException(status_code=500, detail="Không thể tính toán Bát tự.")

        # Xây dựng Prompt cho `gpt-oss:20b` - Frame Thiên Địa Nhân
        prompt = f"""
Đóng vai một Đại Sư Huyền Học và "Thầy luận giải" uyên bác, thông thái.
Nhiệm vụ: Dựa trên hệ thống Thiên - Địa - Nhân để đưa ra lời khuyên và gợi ý sách cho tín chủ.

THÔNG TIN TÍN CHỦ (NHÂN):
- Tên: {request.full_name}
- Tứ Trụ: Năm {user_bazi['year']}, Tháng {user_bazi['month']}, Ngày {user_bazi['day']}, Giờ {user_bazi['hour']}.
- Bản Mệnh (Ngũ Hành): {user_bazi['element']}.

THỜI KHÍ HIỆN TẠI (THIÊN):
- Tứ Trụ: Năm {current_bazi['year']}, Tháng {current_bazi['month']}, Ngày {current_bazi['day']}, Giờ {current_bazi['hour']}.

YÊU CẦU:
Hãy phân tích sự tương tác giữa Bản Mệnh của Tín Chủ và Thời Khí hiện tại, sau đó chọn một cuốn sách (ĐỊA) mang năng lượng phù hợp để giúp Tín Chủ cân bằng hoặc phát huy vận thế.

ĐIỀU KIỆN QUAN TRỌNG VỀ SÁCH (ĐỊA LỢI):
1. Cuốn sách phải CHẮC CHẮN CÓ THỰC và DỄ DÀNG TÌM THẤY TẠI VIỆT NAM.
2. ƯU TIÊN TUYỆT ĐỐI các tác phẩm của TÁC GIẢ VIỆT NAM nổi tiếng (ví dụ: Nguyễn Du, Nam Cao, các nhà văn hiện đại Việt Nam...) hoặc các tác phẩm kinh điển thế giới đã có bản dịch tiếng Việt rất phổ biến (như "Nhà Giả Kim", "Đắc Nhân Tâm").
3. Tuyệt đối không gợi ý các cuốn sách không có bản dịch tiếng Việt, sách bịa đặt hoặc sách quá xa lạ không thể tìm mua.

TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON DUY NHẤT:
{{
  "thien": {{
    "title": "Thiên Thời",
    "description": "Luận giải về thời khí hiện tại tác động thế nào đến tâm thế của tín chủ (bằng tiếng Việt thuần túy)."
  }},
  "nhan": {{
    "title": "Nhân Hòa",
    "description": "Phân tích nội tại bản mệnh (bằng tiếng Việt thuần túy)."
  }},
  "dia": {{
    "title": "Địa Lợi (Sách Hiền Triết)",
    "book": {{
      "title": "Tên cuốn sách tiếng Việt",
      "author": "Tác giả",
      "energy": "Hành của sách (Mộc/Hỏa/Thổ/Kim/Thủy)",
      "reason": "Giải thích lý do chọn sách này để cân bằng năng lượng (bằng tiếng Việt thuần túy)."
    }}
  }},
  "advice": "Lời khuyên tổng quát ngắn gọn bằng tiếng Việt.",
  "mantra": "Một câu khẩu quyết tinh thần bằng tiếng Việt."
}}

Lưu ý: Ngôn ngữ 100% TIẾNG VIỆT THUẦN TÚY. Cấm tuyệt đối sử dụng bất kỳ chữ Hán nào (ví dụ: 不, 庚, 申, 丙, 午...). Toàn bộ phản hồi phải dùng hệ chữ Latinh tiếng Việt.
"""

        payload = {
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "system",
                    "content": "Bạn là một Đại Sư Huyền Học am tường cổ học. Bạn chỉ được phép trả về kết quả dưới dạng JSON duy nhất. KHÔNG sử dụng bất kỳ chữ Hán hay tiếng Trung nào trong câu trả lời."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "format": "json"
        }
        
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=90)
        
        if response.status_code == 200:
            result = response.json()
            try:
                import json
                import re
                # Ollama chat API trả về trong ['message']['content']
                raw_ai_text = result.get("message", {}).get("content", "")
                print(f"AI Raw Response: {raw_ai_text}")
                
                # Thử tìm JSON trong markdown
                json_match = re.search(r'\{.*\}', raw_ai_text, re.DOTALL)
                if json_match:
                    ai_data = json.loads(json_match.group(0))
                else:
                    ai_data = json.loads(raw_ai_text)
            except Exception as parse_err:
                print(f"Parsing error: {parse_err}")
                ai_data = {
                    "error": "AI response parsing failed", 
                    "raw_preview": raw_ai_text[:200] if 'raw_ai_text' in locals() else "No content"
                }

            # Lấy ảnh bìa sách
            book_info = ai_data.get("dia", {}).get("book", {})
            if book_info:
                title = book_info.get("title", "")
                author = book_info.get("author", "")
                cover_url = fetch_book_cover(title, author)
                
                # Fallback nếu không tìm thấy ảnh bìa thực tế
                if not cover_url:
                    # Giả sử backend chạy ở cổng 9000
                    # Trong thực tế nên lấy từ config hoặc request.base_url
                    cover_url = "/static/assets/placeholder_book.png"
                
                book_info["image_url"] = cover_url

            return {
                "user_bazi": user_bazi,
                "current_bazi": current_bazi,
                "ai_content": sanitize_chinese_chars(ai_data)
            }
        else:
            raise HTTPException(status_code=500, detail="Ollama Error")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
