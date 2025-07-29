#!/usr/bin/env python3
"""
Kitco 黃金資料爬蟲
負責爬取 Kitco 網站的黃金價格、新聞和分析文章
"""

import requests
import json
import time
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class GoldPrice:
    """黃金價格資料結構"""
    symbol: str  # 例如: "XAUUSD"
    price: float  # 當前價格
    change: float  # 價格變動
    change_percent: float  # 變動百分比
    high: float  # 今日最高
    low: float  # 今日最低
    open_price: float  # 開盤價
    volume: Optional[int] = None  # 成交量
    timestamp: str = None  # ISO 格式時間戳
    source: str = "kitco"  # 資料來源

@dataclass
class NewsArticle:
    """新聞文章資料結構"""
    title: str  # 文章標題
    content: str  # 文章內容摘要
    url: str  # 文章連結
    author: Optional[str] = None  # 作者
    publish_date: Optional[str] = None  # 發布日期
    category: Optional[str] = None  # 分類
    tags: List[str] = None  # 標籤
    source: str = "kitco"  # 資料來源
    scraped_at: str = None  # 爬取時間

class KitcoScraper:
    """Kitco 網站爬蟲類別"""
    
    def __init__(self, delay: float = 2.0):
        """
        初始化爬蟲
        
        Args:
            delay: 請求間隔時間（秒）
        """
        self.base_url = "https://www.kitco.com"
        self.delay = delay
        self.session = requests.Session()
        
        # 設定 headers 模擬真實瀏覽器
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        logger.info("Kitco 爬蟲初始化完成")
    
    def _make_request(self, url: str, params: Dict = None) -> Optional[requests.Response]:
        """
        發送 HTTP 請求
        
        Args:
            url: 目標 URL
            params: 查詢參數
            
        Returns:
            Response 物件或 None
        """
        try:
            logger.info(f"正在請求: {url}")
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            # 遵守延遲設定
            time.sleep(self.delay)
            
            return response
            
        except requests.RequestException as e:
            logger.error(f"請求失敗 {url}: {e}")
            return None
    
    def get_gold_price(self) -> Optional[GoldPrice]:
        """
        獲取黃金即時價格
        
        Returns:
            GoldPrice 物件或 None
        """
        try:
            # Kitco 黃金價格 API
            api_url = "https://www.kitco.com/charts/livegold.html"
            response = self._make_request(api_url)
            
            if not response:
                return None
            
            # 解析頁面內容
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 尋找價格資料（這裡需要根據實際頁面結構調整）
            price_element = soup.find('span', {'id': 'sp-bid'})
            if not price_element:
                # 嘗試其他可能的選擇器
                price_element = soup.find('div', {'class': 'price'})
            
            if price_element:
                price_text = price_element.get_text().strip()
                price = float(re.sub(r'[^\d.]', '', price_text))
                
                # 獲取變動資訊
                change_element = soup.find('span', {'class': 'change'})
                change = 0.0
                change_percent = 0.0
                
                if change_element:
                    change_text = change_element.get_text().strip()
                    change_match = re.search(r'([+-]?\d+\.?\d*)', change_text)
                    if change_match:
                        change = float(change_match.group(1))
                
                return GoldPrice(
                    symbol="XAUUSD",
                    price=price,
                    change=change,
                    change_percent=change_percent,
                    high=price,  # 暫時使用當前價格
                    low=price,   # 暫時使用當前價格
                    open_price=price,  # 暫時使用當前價格
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    source="kitco"
                )
            
            logger.warning("無法找到價格資料")
            return None
            
        except Exception as e:
            logger.error(f"獲取黃金價格失敗: {e}")
            return None
    
    def get_news_articles(self, limit: int = 10) -> List[NewsArticle]:
        """
        獲取最新新聞文章
        
        Args:
            limit: 獲取文章數量限制
            
        Returns:
            NewsArticle 列表
        """
        articles = []
        
        try:
            # Kitco 新聞頁面
            news_url = f"{self.base_url}/news/"
            response = self._make_request(news_url)
            
            if not response:
                return articles
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 尋找新聞文章連結
            article_links = soup.find_all('a', href=re.compile(r'/news/\d+/'))
            
            for link in article_links[:limit]:
                try:
                    article_url = urljoin(self.base_url, link.get('href'))
                    article = self._scrape_article(article_url)
                    
                    if article:
                        articles.append(article)
                        
                except Exception as e:
                    logger.error(f"爬取文章失敗 {link.get('href')}: {e}")
                    continue
            
            logger.info(f"成功爬取 {len(articles)} 篇文章")
            return articles
            
        except Exception as e:
            logger.error(f"獲取新聞文章失敗: {e}")
            return articles
    
    def _scrape_article(self, url: str) -> Optional[NewsArticle]:
        """
        爬取單篇文章內容
        
        Args:
            url: 文章 URL
            
        Returns:
            NewsArticle 物件或 None
        """
        try:
            response = self._make_request(url)
            
            if not response:
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取標題
            title_element = soup.find('h1') or soup.find('title')
            title = title_element.get_text().strip() if title_element else "無標題"
            
            # 提取內容
            content_element = soup.find('div', {'class': 'article-content'}) or \
                             soup.find('article') or \
                             soup.find('div', {'class': 'content'})
            
            content = ""
            if content_element:
                # 移除 script 和 style 標籤
                for script in content_element(["script", "style"]):
                    script.decompose()
                
                content = content_element.get_text().strip()
                # 清理多餘空白
                content = re.sub(r'\s+', ' ', content)
            
            # 提取作者
            author_element = soup.find('span', {'class': 'author'}) or \
                            soup.find('div', {'class': 'byline'})
            author = author_element.get_text().strip() if author_element else None
            
            # 提取發布日期
            date_element = soup.find('time') or \
                          soup.find('span', {'class': 'date'})
            publish_date = date_element.get('datetime') or date_element.get_text().strip() if date_element else None
            
            # 提取分類
            category_element = soup.find('a', {'class': 'category'})
            category = category_element.get_text().strip() if category_element else None
            
            return NewsArticle(
                title=title,
                content=content[:500] + "..." if len(content) > 500 else content,  # 限制內容長度
                url=url,
                author=author,
                publish_date=publish_date,
                category=category,
                tags=[],
                source="kitco",
                scraped_at=datetime.now(timezone.utc).isoformat()
            )
            
        except Exception as e:
            logger.error(f"爬取文章內容失敗 {url}: {e}")
            return None
    
    def get_market_analysis(self, limit: int = 5) -> List[NewsArticle]:
        """
        獲取市場分析文章
        
        Args:
            limit: 獲取文章數量限制
            
        Returns:
            NewsArticle 列表
        """
        try:
            # Kitco 市場分析頁面
            analysis_url = f"{self.base_url}/opinions/"
            response = self._make_request(analysis_url)
            
            if not response:
                return []
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            articles = []
            article_links = soup.find_all('a', href=re.compile(r'/opinions/'))
            
            for link in article_links[:limit]:
                try:
                    article_url = urljoin(self.base_url, link.get('href'))
                    article = self._scrape_article(article_url)
                    
                    if article:
                        article.category = "市場分析"
                        articles.append(article)
                        
                except Exception as e:
                    logger.error(f"爬取分析文章失敗 {link.get('href')}: {e}")
                    continue
            
            logger.info(f"成功爬取 {len(articles)} 篇分析文章")
            return articles
            
        except Exception as e:
            logger.error(f"獲取市場分析失敗: {e}")
            return []
    
    def save_to_json(self, data: List, filename: str):
        """
        將資料儲存為 JSON 檔案
        
        Args:
            data: 要儲存的資料
            filename: 檔案名稱
        """
        try:
            # 將 dataclass 轉換為 dict
            if hasattr(data, '__iter__') and not isinstance(data, str):
                json_data = [asdict(item) if hasattr(item, '__dict__') else item for item in data]
            else:
                json_data = asdict(data) if hasattr(data, '__dict__') else data
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"資料已儲存至 {filename}")
            
        except Exception as e:
            logger.error(f"儲存資料失敗: {e}")

def main():
    """主函數 - 測試爬蟲功能"""
    scraper = KitcoScraper(delay=3.0)  # 3秒延遲，避免過於頻繁
    
    print("=== Kitco 黃金資料爬蟲測試 ===")
    
    # 1. 獲取黃金價格
    print("\n1. 獲取黃金即時價格...")
    price = scraper.get_gold_price()
    if price:
        print(f"黃金價格: ${price.price:.2f} USD")
        print(f"變動: {price.change:+.2f} ({price.change_percent:+.2f}%)")
        scraper.save_to_json(price, "data/kitco_gold_price.json")
    else:
        print("無法獲取黃金價格")
    
    # 2. 獲取最新新聞
    print("\n2. 獲取最新新聞...")
    news = scraper.get_news_articles(limit=5)
    if news:
        print(f"成功獲取 {len(news)} 篇新聞")
        for i, article in enumerate(news, 1):
            print(f"{i}. {article.title}")
        scraper.save_to_json(news, "data/kitco_news.json")
    else:
        print("無法獲取新聞")
    
    # 3. 獲取市場分析
    print("\n3. 獲取市場分析...")
    analysis = scraper.get_market_analysis(limit=3)
    if analysis:
        print(f"成功獲取 {len(analysis)} 篇分析文章")
        for i, article in enumerate(analysis, 1):
            print(f"{i}. {article.title}")
        scraper.save_to_json(analysis, "data/kitco_analysis.json")
    else:
        print("無法獲取市場分析")

if __name__ == "__main__":
    main() 