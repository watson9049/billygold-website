import sqlite3
from datetime import datetime
import json

def insert_default_articles(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    articles = [
        {
            "id": "blog_001",
            "title": "黃金投資入門指南：新手必讀的完整攻略",
            "content": """
# 黃金投資入門指南：新手必讀的完整攻略
\n## 為什麼要投資黃金？\n黃金自古以來就是人類最珍貴的貴金屬之一，具有避險、保值、全球流通等特性。\n\n## 黃金投資方式比較\n- 實體黃金：安全、保值，但流動性較低\n- 黃金存摺：方便、門檻低，但無法提領實體\n- 黃金ETF：流動性高，適合投資組合配置\n\n## 投資建議\n- 從小額開始，分散風險\n- 長期持有，避免短線波動\n- 定期檢視投資組合\n\n## 結語\n黃金投資是一個需要耐心和知識的過程，建議多學習專業知識，理性規劃。\n""",
            "summary": "想要開始黃金投資卻不知道從何下手？本文將為您詳細介紹黃金投資的基本概念、投資方式、風險評估以及實用建議，讓您輕鬆踏入黃金投資的世界。",
            "category": "投資策略",
            "tags": ["黃金投資", "入門指南", "投資策略", "避險資產"],
            "author": "AI 黃金分析師",
            "status": "published",
            "publish_date": now,
            "created_at": now,
            "updated_at": now,
            "read_time": 8,
            "views": 1250,
            "seo_keywords": ["黃金投資", "投資入門", "避險資產", "投資策略"],
            "featured_image": "/images/gold-investment-guide.jpg"
        },
        {
            "id": "blog_002",
            "title": "2025年黃金價格走勢分析：技術面與基本面深度解析",
            "content": """
# 2025年黃金價格走勢分析：技術面與基本面深度解析\n\n## 市場現況概述\n2025年以來，黃金價格呈現穩健上漲趨勢，主要受到全球經濟、通膨、地緣政治等因素影響。\n\n## 技術面分析\n- 支撐位：$2,300/盎司\n- 阻力位：$2,500/盎司\n- RSI顯示超買，需注意回調\n\n## 基本面分析\n- 聯準會政策寬鬆，有利黃金避險需求\n- CPI數據高於預期，增強抗通膨吸引力\n- 國際局勢緊張，推動避險資金流入\n\n## 投資建議\n- 逢低分批買入，設置止損\n- 長期持有，關注基本面變化\n\n## 風險提示\n- 市場波動、政策變化、匯率風險\n""",
            "summary": "深入分析2025年黃金市場的技術指標和基本面因素，包括聯準會政策、通膨數據、地緣政治風險等，為投資者提供專業的市場洞察。",
            "category": "市場分析",
            "tags": ["黃金價格", "技術分析", "基本面分析", "2025年預測"],
            "author": "AI 黃金分析師",
            "status": "published",
            "publish_date": now,
            "created_at": now,
            "updated_at": now,
            "read_time": 12,
            "views": 2100,
            "seo_keywords": ["黃金價格", "技術分析", "基本面分析", "投資預測"],
            "featured_image": "/images/gold-price-analysis.jpg"
        }
    ]
    for art in articles:
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO blog_posts (
                    id, title, content, summary, category, tags, author, status, publish_date, created_at, updated_at, read_time, views, seo_keywords, featured_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                art["id"], art["title"], art["content"], art["summary"], art["category"], json.dumps(art["tags"]), art["author"], art["status"], art["publish_date"], art["created_at"], art["updated_at"], art["read_time"], art["views"], json.dumps(art["seo_keywords"]), art["featured_image"]
            ))
            print(f"已補上文章: {art['title']}")
        except Exception as e:
            print(f"補資料失敗: {e}")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_default_articles("./data/blog.db") 