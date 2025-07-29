#!/usr/bin/env python3
"""
AI 半自動黃金知識部落格生成系統
結合爬蟲資料、AI 生成和人工編輯，每天自動產生高品質的黃金投資知識文章
"""

import json
import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
import openai
from pathlib import Path
import re
import random

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class BlogArticle:
    """部落格文章資料結構"""
    id: str  # 文章唯一 ID
    title: str  # 文章標題
    content: str  # 文章內容
    summary: str  # 文章摘要
    category: str  # 分類
    tags: List[str]  # 標籤
    author: str = "AI 黃金分析師"  # 作者
    publish_date: str = None  # 發布日期
    status: str = "draft"  # 狀態：draft, published, archived
    seo_keywords: List[str] = None  # SEO 關鍵字
    featured_image: str = None  # 特色圖片
    read_time: int = None  # 閱讀時間（分鐘）
    created_at: str = None  # 創建時間
    updated_at: str = None  # 更新時間

class BlogGenerator:
    """AI 部落格文章生成器"""
    
    def __init__(self, openai_api_key: str):
        """
        初始化部落格生成器
        
        Args:
            openai_api_key: OpenAI API 金鑰
        """
        self.openai_api_key = openai_api_key
        openai.api_key = openai_api_key
        
        # 文章分類和主題
        self.categories = {
            "投資策略": [
                "黃金投資入門指南",
                "如何選擇黃金投資方式",
                "黃金投資組合配置",
                "黃金定投策略",
                "黃金 vs 其他避險資產"
            ],
            "市場分析": [
                "黃金價格走勢分析",
                "影響黃金價格的因素",
                "技術分析在黃金投資中的應用",
                "基本面分析：供需關係",
                "全球經濟對黃金的影響"
            ],
            "實用知識": [
                "如何鑑定黃金真偽",
                "黃金購買注意事項",
                "黃金儲存與保管",
                "黃金回收流程",
                "黃金投資稅務知識"
            ],
            "歷史文化": [
                "黃金的歷史價值",
                "各國黃金儲備",
                "黃金在貨幣體系中的作用",
                "黃金的文化意義",
                "著名黃金投資案例"
            ],
            "時事評論": [
                "今日黃金市場動態",
                "重要經濟事件對黃金的影響",
                "央行政策與黃金價格",
                "地緣政治與黃金避險",
                "通膨與黃金投資"
            ]
        }
        
        # 文章模板
        self.article_templates = {
            "投資策略": {
                "structure": [
                    "引言（為什麼要投資黃金）",
                    "投資方式比較",
                    "風險評估",
                    "實作建議",
                    "總結"
                ],
                "tone": "專業但易懂，適合初學者"
            },
            "市場分析": {
                "structure": [
                    "市場現況概述",
                    "技術面分析",
                    "基本面分析",
                    "未來展望",
                    "投資建議"
                ],
                "tone": "專業分析，數據導向"
            },
            "實用知識": {
                "structure": [
                    "問題背景",
                    "詳細說明",
                    "實用技巧",
                    "注意事項",
                    "實例分享"
                ],
                "tone": "實用導向，步驟清楚"
            }
        }
        
        logger.info("部落格生成器初始化完成")
    
    def generate_article_outline(self, category: str, topic: str, market_data: Dict = None) -> Dict:
        """
        生成文章大綱
        
        Args:
            category: 文章分類
            topic: 文章主題
            market_data: 市場資料（可選）
            
        Returns:
            文章大綱字典
        """
        try:
            # 根據分類選擇模板
            template = self.article_templates.get(category, self.article_templates["投資策略"])
            
            # 生成大綱提示詞
            prompt = f"""
你是一位專業的黃金投資分析師，請為以下主題生成詳細的文章大綱：

主題：{topic}
分類：{category}
目標讀者：黃金投資初學者到中級投資者

要求：
1. 文章結構要符合 {template['tone']} 的風格
2. 包含實用的投資建議和具體例子
3. 融入最新的市場資訊（如果有的話）
4. 適合台灣投資者閱讀

請生成包含以下內容的大綱：
- 文章標題（吸引人且 SEO 友善）
- 各段落標題和重點
- 關鍵要點
- 實用建議
- 總結重點

格式：JSON 格式，包含 title, sections, key_points, practical_tips, summary
"""
            
            if market_data:
                prompt += f"\n\n最新市場資料：{json.dumps(market_data, ensure_ascii=False)}"
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是專業的黃金投資分析師，擅長撰寫教育性的投資文章。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            outline = json.loads(response.choices[0].message.content)
            logger.info(f"成功生成文章大綱：{outline.get('title', topic)}")
            return outline
            
        except Exception as e:
            logger.error(f"生成文章大綱失敗: {e}")
            return None
    
    def generate_article_content(self, outline: Dict, category: str, market_data: Dict = None) -> str:
        """
        根據大綱生成完整文章內容
        
        Args:
            outline: 文章大綱
            category: 文章分類
            market_data: 市場資料（可選）
            
        Returns:
            完整文章內容
        """
        try:
            # 生成內容提示詞
            prompt = f"""
請根據以下大綱撰寫一篇完整的黃金投資文章：

文章大綱：
{json.dumps(outline, ensure_ascii=False, indent=2)}

要求：
1. 文章長度：1500-2000 字
2. 風格：專業但易懂，適合台灣投資者
3. 包含具體的投資建議和實例
4. 使用繁體中文
5. 段落清楚，易於閱讀
6. 加入相關的數據和事實

如果提供市場資料，請適當地融入文章中：
{json.dumps(market_data, ensure_ascii=False) if market_data else "無"}

請直接輸出文章內容，不需要額外的格式說明。
"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是專業的黃金投資分析師，擅長撰寫教育性的投資文章。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=3000
            )
            
            content = response.choices[0].message.content
            logger.info(f"成功生成文章內容，長度：{len(content)} 字")
            return content
            
        except Exception as e:
            logger.error(f"生成文章內容失敗: {e}")
            return None
    
    def generate_seo_optimized_title(self, topic: str, category: str) -> str:
        """
        生成 SEO 優化的標題
        
        Args:
            topic: 文章主題
            category: 文章分類
            
        Returns:
            SEO 優化標題
        """
        try:
            prompt = f"""
請為以下黃金投資文章生成一個 SEO 優化的標題：

主題：{topic}
分類：{category}

要求：
1. 包含相關關鍵字（如：黃金投資、黃金價格、投資策略等）
2. 吸引讀者點擊
3. 長度適中（20-40 字）
4. 適合台灣搜尋習慣
5. 使用繁體中文

請直接輸出標題，不需要額外說明。
"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是 SEO 專家，擅長撰寫吸引人的標題。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            
            title = response.choices[0].message.content.strip()
            logger.info(f"生成 SEO 標題：{title}")
            return title
            
        except Exception as e:
            logger.error(f"生成 SEO 標題失敗: {e}")
            return topic
    
    def extract_keywords(self, content: str) -> List[str]:
        """
        從文章內容提取關鍵字
        
        Args:
            content: 文章內容
            
        Returns:
            關鍵字列表
        """
        try:
            prompt = f"""
請從以下黃金投資文章中提取 5-8 個重要的 SEO 關鍵字：

文章內容：
{content[:1000]}...

要求：
1. 包含黃金投資相關的專業術語
2. 適合台灣搜尋習慣
3. 長尾關鍵字優先
4. 用逗號分隔

請直接輸出關鍵字，用逗號分隔。
"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是 SEO 專家，擅長關鍵字分析。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=200
            )
            
            keywords = [kw.strip() for kw in response.choices[0].message.content.split(',')]
            logger.info(f"提取關鍵字：{keywords}")
            return keywords
            
        except Exception as e:
            logger.error(f"提取關鍵字失敗: {e}")
            return ["黃金投資", "投資策略"]
    
    def generate_article_summary(self, content: str) -> str:
        """
        生成文章摘要
        
        Args:
            content: 文章內容
            
        Returns:
            文章摘要
        """
        try:
            prompt = f"""
請為以下黃金投資文章生成一個簡潔的摘要：

文章內容：
{content}

要求：
1. 摘要長度：100-150 字
2. 包含文章主要重點
3. 吸引讀者繼續閱讀
4. 使用繁體中文

請直接輸出摘要。
"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是內容編輯，擅長撰寫文章摘要。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=200
            )
            
            summary = response.choices[0].message.content.strip()
            logger.info(f"生成文章摘要，長度：{len(summary)} 字")
            return summary
            
        except Exception as e:
            logger.error(f"生成文章摘要失敗: {e}")
            return content[:150] + "..."
    
    def create_blog_article(self, category: str, topic: str, market_data: Dict = None) -> Optional[BlogArticle]:
        """
        創建完整的部落格文章
        
        Args:
            category: 文章分類
            topic: 文章主題
            market_data: 市場資料（可選）
            
        Returns:
            BlogArticle 物件或 None
        """
        try:
            # 1. 生成 SEO 標題
            title = self.generate_seo_optimized_title(topic, category)
            
            # 2. 生成文章大綱
            outline = self.generate_article_outline(category, topic, market_data)
            if not outline:
                return None
            
            # 3. 生成完整內容
            content = self.generate_article_content(outline, category, market_data)
            if not content:
                return None
            
            # 4. 生成摘要
            summary = self.generate_article_summary(content)
            
            # 5. 提取關鍵字
            keywords = self.extract_keywords(content)
            
            # 6. 計算閱讀時間（假設每分鐘 300 字）
            read_time = max(3, len(content) // 300)
            
            # 7. 創建文章物件
            article = BlogArticle(
                id=f"blog_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title=title,
                content=content,
                summary=summary,
                category=category,
                tags=keywords,
                seo_keywords=keywords,
                read_time=read_time,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            )
            
            logger.info(f"成功創建部落格文章：{article.title}")
            return article
            
        except Exception as e:
            logger.error(f"創建部落格文章失敗: {e}")
            return None
    
    def save_article(self, article: BlogArticle, filename: str = None):
        """
        儲存文章到檔案
        
        Args:
            article: 文章物件
            filename: 檔案名稱（可選）
        """
        try:
            if not filename:
                filename = f"data/blog_{article.id}.json"
            
            # 確保目錄存在
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            
            # 儲存為 JSON
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(asdict(article), f, ensure_ascii=False, indent=2)
            
            logger.info(f"文章已儲存至 {filename}")
            
        except Exception as e:
            logger.error(f"儲存文章失敗: {e}")
    
    def generate_daily_article(self, market_data: Dict = None) -> Optional[BlogArticle]:
        """
        生成每日文章（隨機選擇主題）
        
        Args:
            market_data: 市場資料（可選）
            
        Returns:
            BlogArticle 物件或 None
        """
        try:
            # 隨機選擇分類和主題
            category = random.choice(list(self.categories.keys()))
            topic = random.choice(self.categories[category])
            
            logger.info(f"開始生成每日文章：{category} - {topic}")
            
            # 創建文章
            article = self.create_blog_article(category, topic, market_data)
            
            if article:
                # 儲存文章
                self.save_article(article)
                logger.info(f"每日文章生成完成：{article.title}")
            
            return article
            
        except Exception as e:
            logger.error(f"生成每日文章失敗: {e}")
            return None

def main():
    """主函數 - 測試部落格生成器"""
    # 請替換為您的 OpenAI API Key
    openai_api_key = "your-openai-api-key-here"
    
    generator = BlogGenerator(openai_api_key)
    
    print("=== AI 黃金知識部落格生成器測試 ===")
    
    # 模擬市場資料
    market_data = {
        "current_price": 2350.50,
        "change": 15.20,
        "change_percent": 0.65,
        "market_sentiment": "樂觀",
        "key_events": ["聯準會利率決策", "通膨數據發布"]
    }
    
    # 生成每日文章
    print("\n生成每日文章...")
    article = generator.generate_daily_article(market_data)
    
    if article:
        print(f"\n✅ 文章生成成功！")
        print(f"標題：{article.title}")
        print(f"分類：{article.category}")
        print(f"摘要：{article.summary}")
        print(f"關鍵字：{', '.join(article.tags)}")
        print(f"閱讀時間：{article.read_time} 分鐘")
        print(f"文章 ID：{article.id}")
    else:
        print("❌ 文章生成失敗")

if __name__ == "__main__":
    main() 