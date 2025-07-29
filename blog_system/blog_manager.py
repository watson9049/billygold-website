#!/usr/bin/env python3
"""
部落格管理系統
負責文章管理、發布、編輯、搜尋等功能
"""

import json
import os
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
import sqlite3
from pathlib import Path
import re

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class BlogPost:
    """部落格文章資料結構"""
    id: str
    title: str
    content: str
    summary: str
    category: str
    tags: List[str]
    author: str
    status: str  # draft, published, archived
    publish_date: Optional[str] = None
    created_at: str = None
    updated_at: str = None
    read_time: int = None
    views: int = 0
    likes: int = 0
    seo_keywords: List[str] = None
    featured_image: str = None

class BlogManager:
    """部落格管理系統"""
    
    def __init__(self, db_path: str = "data/blog.db"):
        """
        初始化部落格管理器
        
        Args:
            db_path: 資料庫檔案路徑
        """
        self.db_path = db_path
        self.init_database()
        self.initialize_default_articles()
        logger.info("部落格管理器初始化完成")
    
    def init_database(self):
        """初始化資料庫"""
        try:
            # 確保目錄存在
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # 創建文章表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    summary TEXT,
                    category TEXT,
                    tags TEXT,
                    author TEXT,
                    status TEXT DEFAULT 'draft',
                    publish_date TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    read_time INTEGER,
                    views INTEGER DEFAULT 0,
                    likes INTEGER DEFAULT 0,
                    seo_keywords TEXT,
                    featured_image TEXT
                )
            ''')
            
            # 創建分類表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    created_at TEXT
                )
            ''')
            
            # 創建標籤表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    count INTEGER DEFAULT 0,
                    created_at TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            
            logger.info("資料庫初始化完成")
            
        except Exception as e:
            logger.error(f"資料庫初始化失敗: {e}")
    
    def add_article(self, article: BlogPost) -> bool:
        """
        新增文章
        
        Args:
            article: 文章物件
            
        Returns:
            是否成功
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO blog_posts (
                    id, title, content, summary, category, tags, author,
                    status, publish_date, created_at, updated_at, read_time,
                    seo_keywords, featured_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                article.id, article.title, article.content, article.summary,
                article.category, json.dumps(article.tags), article.author,
                article.status, article.publish_date, article.created_at,
                article.updated_at, article.read_time,
                json.dumps(article.seo_keywords) if article.seo_keywords else None,
                article.featured_image
            ))
            
            # 更新分類和標籤統計
            self._update_category_count(article.category)
            for tag in article.tags:
                self._update_tag_count(tag)
            
            conn.commit()
            conn.close()
            
            logger.info(f"文章新增成功：{article.title}")
            return True
            
        except Exception as e:
            logger.error(f"新增文章失敗: {e}")
            return False
    
    def get_article(self, article_id: str) -> Optional[BlogPost]:
        """
        獲取單篇文章
        
        Args:
            article_id: 文章 ID
            
        Returns:
            BlogPost 物件或 None
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM blog_posts WHERE id = ?', (article_id,))
            row = cursor.fetchone()
            
            conn.close()
            
            if row:
                return self._row_to_blog_post(row)
            
            return None
            
        except Exception as e:
            logger.error(f"獲取文章失敗: {e}")
            return None
    
    def get_articles(self, status: str = "published", limit: int = 10, offset: int = 0) -> List[BlogPost]:
        """
        獲取文章列表
        
        Args:
            status: 文章狀態
            limit: 限制數量
            offset: 偏移量
            
        Returns:
            BlogPost 列表
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if status == "all":
                cursor.execute('''
                    SELECT * FROM blog_posts 
                    ORDER BY created_at DESC 
                    LIMIT ? OFFSET ?
                ''', (limit, offset))
            else:
                cursor.execute('''
                    SELECT * FROM blog_posts 
                    WHERE status = ? 
                    ORDER BY created_at DESC 
                    LIMIT ? OFFSET ?
                ''', (status, limit, offset))
            
            rows = cursor.fetchall()
            conn.close()
            
            articles = [self._row_to_blog_post(row) for row in rows]
            logger.info(f"獲取 {len(articles)} 篇文章")
            return articles
            
        except Exception as e:
            logger.error(f"獲取文章列表失敗: {e}")
            return []
    
    def search_articles(self, keyword: str, limit: int = 10) -> List[BlogPost]:
        """
        搜尋文章
        
        Args:
            keyword: 搜尋關鍵字
            limit: 限制數量
            
        Returns:
            BlogPost 列表
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM blog_posts 
                WHERE (title LIKE ? OR content LIKE ? OR tags LIKE ?)
                AND status = 'published'
                ORDER BY created_at DESC 
                LIMIT ?
            ''', (f'%{keyword}%', f'%{keyword}%', f'%{keyword}%', limit))
            
            rows = cursor.fetchall()
            conn.close()
            
            articles = [self._row_to_blog_post(row) for row in rows]
            logger.info(f"搜尋到 {len(articles)} 篇相關文章")
            return articles
            
        except Exception as e:
            logger.error(f"搜尋文章失敗: {e}")
            return []
    
    def get_articles_by_category(self, category: str, limit: int = 10) -> List[BlogPost]:
        """
        根據分類獲取文章
        
        Args:
            category: 分類名稱
            limit: 限制數量
            
        Returns:
            BlogPost 列表
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT * FROM blog_posts 
                WHERE category = ? AND status = 'published'
                ORDER BY created_at DESC 
                LIMIT ?
            ''', (category, limit))
            
            rows = cursor.fetchall()
            conn.close()
            
            articles = [self._row_to_blog_post(row) for row in rows]
            logger.info(f"獲取分類 '{category}' 的 {len(articles)} 篇文章")
            return articles
            
        except Exception as e:
            logger.error(f"獲取分類文章失敗: {e}")
            return []
    
    def update_article(self, article_id: str, updates: Dict) -> bool:
        """
        更新文章
        
        Args:
            article_id: 文章 ID
            updates: 更新內容
            
        Returns:
            是否成功
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # 構建更新語句
            set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
            set_clause += ", updated_at = ?"
            
            values = list(updates.values())
            values.append(datetime.now().isoformat())
            values.append(article_id)
            
            cursor.execute(f'UPDATE blog_posts SET {set_clause} WHERE id = ?', values)
            
            conn.commit()
            conn.close()
            
            logger.info(f"文章更新成功：{article_id}")
            return True
            
        except Exception as e:
            logger.error(f"更新文章失敗: {e}")
            return False
    
    def delete_article(self, article_id: str) -> bool:
        """
        刪除文章
        
        Args:
            article_id: 文章 ID
            
        Returns:
            是否成功
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM blog_posts WHERE id = ?', (article_id,))
            
            conn.commit()
            conn.close()
            
            logger.info(f"文章刪除成功：{article_id}")
            return True
            
        except Exception as e:
            logger.error(f"刪除文章失敗: {e}")
            return False
    
    def publish_article(self, article_id: str) -> bool:
        """
        發布文章
        
        Args:
            article_id: 文章 ID
            
        Returns:
            是否成功
        """
        updates = {
            "status": "published",
            "publish_date": datetime.now().isoformat()
        }
        return self.update_article(article_id, updates)
    
    def archive_article(self, article_id: str) -> bool:
        """
        封存文章
        
        Args:
            article_id: 文章 ID
            
        Returns:
            是否成功
        """
        updates = {"status": "archived"}
        return self.update_article(article_id, updates)
    
    def increment_views(self, article_id: str) -> bool:
        """
        增加文章瀏覽次數
        
        Args:
            article_id: 文章 ID
            
        Returns:
            是否成功
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('UPDATE blog_posts SET views = views + 1 WHERE id = ?', (article_id,))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            logger.error(f"增加瀏覽次數失敗: {e}")
            return False
    
    def get_categories(self) -> List[Dict]:
        """
        獲取所有分類
        
        Returns:
            分類列表
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT name, description, count FROM categories ORDER BY count DESC')
            rows = cursor.fetchall()
            
            conn.close()
            
            categories = []
            for row in rows:
                categories.append({
                    "name": row[0],
                    "description": row[1],
                    "count": row[2]
                })
            
            return categories
            
        except Exception as e:
            logger.error(f"獲取分類失敗: {e}")
            return []
    
    def get_popular_tags(self, limit: int = 20) -> List[Dict]:
        """
        獲取熱門標籤
        
        Args:
            limit: 限制數量
            
        Returns:
            標籤列表
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('SELECT name, count FROM tags ORDER BY count DESC LIMIT ?', (limit,))
            rows = cursor.fetchall()
            
            conn.close()
            
            tags = []
            for row in rows:
                tags.append({
                    "name": row[0],
                    "count": row[1]
                })
            
            return tags
            
        except Exception as e:
            logger.error(f"獲取熱門標籤失敗: {e}")
            return []
    
    def _row_to_blog_post(self, row) -> BlogPost:
        """將資料庫行轉換為 BlogPost 物件"""
        return BlogPost(
            id=row[0],
            title=row[1],
            content=row[2],
            summary=row[3],
            category=row[4],
            tags=json.loads(row[5]) if row[5] else [],
            author=row[6],
            status=row[7],
            publish_date=row[8],
            created_at=row[9],
            updated_at=row[10],
            read_time=row[11],
            views=row[12],
            likes=row[13],
            seo_keywords=json.loads(row[14]) if row[14] else [],
            featured_image=row[15]
        )
    
    def _update_category_count(self, category: str):
        """更新分類統計"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO categories (name, count, created_at)
                VALUES (?, (SELECT COUNT(*) FROM blog_posts WHERE category = ?), ?)
            ''', (category, category, datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"更新分類統計失敗: {e}")
    
    def _update_tag_count(self, tag: str):
        """更新標籤統計"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO tags (name, count, created_at)
                VALUES (?, (SELECT COUNT(*) FROM blog_posts WHERE tags LIKE ?), ?)
            ''', (tag, f'%{tag}%', datetime.now().isoformat()))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"更新標籤統計失敗: {e}")

    def initialize_default_articles(self):
        """
        若資料庫為空，自動補上預設文章
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM blog_posts')
        count = cursor.fetchone()[0]
        if count == 0:
            logger.info("資料庫為空，自動補上預設文章...")
            default_articles = [
                BlogPost(
                    id="blog_001",
                    title="黃金投資入門指南：新手必讀的完整攻略",
                    content="""
# 黃金投資入門指南：新手必讀的完整攻略

## 為什麼要投資黃金？
黃金自古以來就是人類最珍貴的貴金屬之一，具有避險、保值、全球流通等特性。

## 黃金投資方式比較
- 實體黃金：安全、保值，但流動性較低
- 黃金存摺：方便、門檻低，但無法提領實體
- 黃金ETF：流動性高，適合投資組合配置

## 投資建議
- 從小額開始，分散風險
- 長期持有，避免短線波動
- 定期檢視投資組合

## 結語
黃金投資是一個需要耐心和知識的過程，建議多學習專業知識，理性規劃。
                    """,
                    summary="想要開始黃金投資卻不知道從何下手？本文將為您詳細介紹黃金投資的基本概念、投資方式、風險評估以及實用建議，讓您輕鬆踏入黃金投資的世界。",
                    category="投資策略",
                    tags=["黃金投資", "入門指南", "投資策略", "避險資產"],
                    author="AI 黃金分析師",
                    status="published",
                    publish_date=datetime.now().isoformat(),
                    created_at=datetime.now().isoformat(),
                    updated_at=datetime.now().isoformat(),
                    read_time=8,
                    views=1250,
                    likes=89,
                    seo_keywords=["黃金投資", "投資入門", "避險資產", "投資策略"],
                    featured_image="/images/gold-investment-guide.jpg"
                ),
                BlogPost(
                    id="blog_002",
                    title="2025年黃金價格走勢分析：技術面與基本面深度解析",
                    content="""
# 2025年黃金價格走勢分析：技術面與基本面深度解析

## 市場現況概述
2025年以來，黃金價格呈現穩健上漲趨勢，主要受到全球經濟、通膨、地緣政治等因素影響。

## 技術面分析
- 支撐位：$2,300/盎司
- 阻力位：$2,500/盎司
- RSI顯示超買，需注意回調

## 基本面分析
- 聯準會政策寬鬆，有利黃金避險需求
- CPI數據高於預期，增強抗通膨吸引力
- 國際局勢緊張，推動避險資金流入

## 投資建議
- 逢低分批買入，設置止損
- 長期持有，關注基本面變化

## 風險提示
- 市場波動、政策變化、匯率風險
                    """,
                    summary="深入分析2025年黃金市場的技術指標和基本面因素，包括聯準會政策、通膨數據、地緣政治風險等，為投資者提供專業的市場洞察。",
                    category="市場分析",
                    tags=["黃金價格", "技術分析", "基本面分析", "2025年預測"],
                    author="AI 黃金分析師",
                    status="published",
                    publish_date=datetime.now().isoformat(),
                    created_at=datetime.now().isoformat(),
                    updated_at=datetime.now().isoformat(),
                    read_time=12,
                    views=2100,
                    likes=156,
                    seo_keywords=["黃金價格", "技術分析", "基本面分析", "投資預測"],
                    featured_image="/images/gold-price-analysis.jpg"
                )
            ]
            for article in default_articles:
                self.add_article(article)
            logger.info(f"已補上 {len(default_articles)} 篇預設文章")
        conn.close()

def main():
    """主函數 - 測試部落格管理器"""
    manager = BlogManager()
    
    print("=== 部落格管理系統測試 ===")
    
    # 測試新增文章
    test_article = BlogPost(
        id="test_001",
        title="黃金投資入門指南",
        content="這是一篇測試文章內容...",
        summary="黃金投資的基本概念和注意事項",
        category="投資策略",
        tags=["黃金投資", "入門", "投資策略"],
        author="AI 黃金分析師",
        status="draft",
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        read_time=5
    )
    
    # 新增文章
    if manager.add_article(test_article):
        print("✅ 文章新增成功")
        
        # 獲取文章
        article = manager.get_article("test_001")
        if article:
            print(f"✅ 文章獲取成功：{article.title}")
        
        # 發布文章
        if manager.publish_article("test_001"):
            print("✅ 文章發布成功")
        
        # 獲取已發布文章
        published_articles = manager.get_articles(status="published")
        print(f"✅ 已發布文章數量：{len(published_articles)}")
        
        # 獲取分類
        categories = manager.get_categories()
        print(f"✅ 分類數量：{len(categories)}")
        
        # 獲取熱門標籤
        tags = manager.get_popular_tags()
        print(f"✅ 熱門標籤數量：{len(tags)}")
        
        # 刪除測試文章
        if manager.delete_article("test_001"):
            print("✅ 測試文章刪除成功")
    else:
        print("❌ 文章新增失敗")

if __name__ == "__main__":
    main() 