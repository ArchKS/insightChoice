import os
import requests


class CninfoCrawler:
    def __init__(self):
        self.headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'http://www.cninfo.com.cn',
            'Pragma': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        }
        self.report_category_map = {
            '年报': 'category_ndbg_szsh;',
            '半年报': 'category_bndbg_szsh;',
            '一季报': 'category_yjdbg_szsh;',
            '三季报': 'category_sjdbg_szsh;',
            '全部': 'category_ndbg_szsh;category_bndbg_szsh;category_yjdbg_szsh;category_sjdbg_szsh;',
            '年报和半年报': 'category_ndbg_szsh;category_bndbg_szsh;',
        }

    def get_stock_info(self, query, category="A股"):
        """
        :param query: 搜索词，可以输入股票代码精准匹配，也能输入股票名称匹配
        :param category: 如果一家公司上市地方有多个，可以在这里筛选，默认 A股、港股
        :return: 类似 {"orgId":"9900004143","category":"A股","code":"601899","pinyin":"zjky","zwjc":"紫金矿业"}
        """
        if not query:
            return
        params = {
            'keyWord': query,
            'maxNum': '10',
        }
        url = 'http://www.cninfo.com.cn/new/information/topSearch/query'
        try:
            response = requests.post(url, params=params, headers=self.headers, verify=False)
            json_data = response.json()
            if len(json_data) == 1:
                return json_data[0]
            for stock_data in json_data:
                # stock_code = stock_data["code"]
                # stock_name = stock_data["zwjc"]
                # org_id = stock_data["orgId"]    # 公司 id
                if category == stock_data["category"]:
                    return stock_data
        except Exception as e:
            print(f"get_stock_info error: {e}")

    def download_pdf(self, url, file_name, stock_name):
        print(f"开始下载财报文件: {file_name}")
        try:
            file_path = f"{self.save_path}/{stock_name}/"
            if not os.path.exists(file_path):
                os.mkdir(file_path)

            response = requests.get(url, headers=self.headers, verify=False)
            with open(file_path + file_name, 'wb') as file:
                file.write(response.content)
                print(f"成功下载财报文件: {file_name}")
        except Exception as e:
            print(f"下载文件失败: {file_name}, error: {e}")

    def search_report(self, stock_info, report_category, page_num=1):
        # 原始请求
        req_data = {
            'stock': '601899,9900004143',  # 股票代号
            'tabName': 'fulltext',
            'pageSize': '30',
            'pageNum': '1',
            'column': 'sse',  # 交易所
            'category': 'category_ndbg_szsh;category_bndbg_szsh;category_yjdbg_szsh;category_sjdbg_szsh;',
            'plate': 'sh',  # 上市位置
            'seDate': '',
            'searchkey': '',
            'secid': '',
            'sortName': '',
            'sortType': '',
            'isHLtitle': 'true',
        }
        # 修改参数
        req_data["stock"] = f'{stock_info["code"]},{stock_info["orgId"]}'
        req_data["pageNum"] = page_num
        req_data["category"] = self.report_category_map[report_category]
        if stock_info["code"].startswith("0") or stock_info["code"].startswith("3"):
            req_data["plate"] = "sz"
            req_data["column"] = "szse"
        else:
            req_data["plate"] = "sh"
            req_data["column"] = "sse"

        url = 'http://www.cninfo.com.cn/new/hisAnnouncement/query'
        response = requests.post(url, headers=self.headers, data=req_data, verify=False)
        print(f"开始搜集财报 stock: {stock_info['zwjc']} status_code: {response.status_code}")
        json_data = response.json()
        announcements = json_data.get("announcements")
        has_more = json_data.get("hasMore")
        print(f"发现财报文件总数: {json_data.get('totalAnnouncement')}")

        if announcements:
            print(f"本页发现财报文件总数: {len(announcements)}")
            for announcement in announcements:
                file_url = 'http://static.cninfo.com.cn/' + announcement["adjunctUrl"]
                title = announcement["announcementTitle"] + ".pdf"
                stock_name = announcement["secName"]
                file_name = f"{stock_name}_{title}"
                self.download_pdf(file_url, file_name, stock_name)

        if has_more:
            print(f"搜索结果还有下一页，继续翻页采集")
            self.search_report(stock_info, report_category, page_num + 1)

    def start_download(self, query, report_category="全部", stock_category="A股", ):
        """
        :param query: 搜索词，可以输入股票代码精准匹配，也能输入股票名称匹配
        :param report_category: 财报类型：年报、半年报、一季报、三季报、全部，默认是 全部
        :param stock_category: 如果一家公司上市地方有多个，可以在这里筛选，A股、港股, 默认是 A股
        """
        stock_info = self.get_stock_info(query, stock_category)
        self.search_report(stock_info, report_category)


if __name__ == '__main__':
    cninfo = CninfoCrawler()
    cninfo.save_path = "/Users/zendu/Desktop/scratch/insightChoice"  # 用的话自己调整目录
    cninfo.start_download("马应龙", "年报")     # 使用样例1
    # cninfo.start_download("海康威视", "全部")   # 使用样例2
    # cninfo.start_download("600519", "年报") # 使用样例3 茅台


# 删除摘要
# 