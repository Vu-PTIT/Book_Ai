import requests
import urllib.parse

def fetch_book_cover(title: str, author: str) -> str:
    """
    Tìm kiếm ảnh bìa sách qua Google Books API.
    """
    try:
        # Search query 1: Strict
        search_query = f"intitle:{title} inauthor:{author}"
        encoded_query = urllib.parse.quote(search_query)
        url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
        
        print(f"Searching for: {search_query}")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            if items:
                volume_info = items[0].get("volumeInfo", {})
                image_links = volume_info.get("imageLinks", {})
                url = image_links.get("thumbnail") or image_links.get("smallThumbnail", "")
                if url:
                    return url
        
        # Search query 2: Broader (Title only)
        search_query = title
        encoded_query = urllib.parse.quote(search_query)
        url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
        print(f"Broad searching for: {search_query}")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            if items:
                volume_info = items[0].get("volumeInfo", {})
                image_links = volume_info.get("imageLinks", {})
                url = image_links.get("thumbnail") or image_links.get("smallThumbnail", "")
                if url:
                    return url

    except Exception as e:
        print(f"Error fetching book cover: {e}")
    return ""

if __name__ == "__main__":
    test_books = [
        ("Truyện Kiều", "Nguyễn Du"),
        ("Nhà Giả Kim", "Paulo Coelho"),
        ("Đắc Nhân Tâm", "Dale Carnegie"),
        ("Lão Hạc", "Nam Cao")
    ]
    
    for title, author in test_books:
        cover = fetch_book_cover(title, author)
        print(f"Result for {title}: {cover}\n")
