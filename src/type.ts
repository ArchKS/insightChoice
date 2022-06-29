export interface iXlsxBook {
    "Directory": {
        "workbooks": [
            "/xl/workbook.xml"
        ],
        "sheets": [
            "/xl/worksheets/sheet1.xml",
            "/xl/worksheets/sheet2.xml",
            "/xl/worksheets/sheet3.xml",
            "/xl/worksheets/sheet4.xml",
            "/xl/worksheets/sheet5.xml"
        ],
        "charts": [],
        "dialogs": [],
        "macros": [],
        "rels": [],
        "strs": [
            "/xl/sharedStrings.xml"
        ],
        "comments": [],
        "threadedcomments": [],
        "links": [],
        "coreprops": [
            "/docProps/core.xml"
        ],
        "extprops": [
            "/docProps/app.xml"
        ],
        "custprops": [],
        "themes": [
            "/xl/theme/theme1.xml"
        ],
        "styles": [
            "/xl/styles.xml"
        ],
        "vba": [],
        "drawings": [
            "/xl/drawings/drawing1.xml"
        ],
        "metadata": [],
        "people": [],
        "TODO": [],
        "xmlns": "http://schemas.openxmlformats.org/package/2006/content-types",
        "calcchain": "",
        "sst": "/xl/sharedStrings.xml",
        "style": "/xl/styles.xml",
        "defaults": {
            "jpeg": "image/jpeg",
            "png": "image/png",
            "rels": "application/vnd.openxmlformats-package.relationships+xml",
            "xml": "application/xml"
        }
    },
    "Workbook": {
        "AppVersion": {
            "appName": "xl",
            "appname": "xl",
            "lastEdited": "7",
            "lastedited": "7",
            "lowestEdited": "7",
            "lowestedited": "7",
            "rupBuild": "10111",
            "rupbuild": "10111"
        },
        "WBProps": {
            "defaultThemeVersion": 166925,
            "allowRefreshQuery": false,
            "autoCompressPictures": true,
            "backupFile": false,
            "checkCompatibility": false,
            "CodeName": "",
            "date1904": false,
            "filterPrivacy": false,
            "hidePivotFieldList": false,
            "promptedSolutions": false,
            "publishItems": false,
            "refreshAllConnections": false,
            "saveExternalLinkValues": true,
            "showBorderUnselectedTables": true,
            "showInkAnnotation": true,
            "showObjects": "all",
            "showPivotChartFilter": false,
            "updateLinks": "userSet"
        },
        "WBView": [
            {
                "xWindow": "1380",
                "xwindow": "1380",
                "yWindow": "500",
                "ywindow": "500",
                "windowWidth": "49820",
                "windowwidth": "49820",
                "windowHeight": "28300",
                "windowheight": "28300",
                "uid": "{C4A564BE-43D8-204E-8BA7-C4522884C75A}",
                "activeTab": 0,
                "autoFilterDateGrouping": true,
                "firstSheet": 0,
                "minimized": false,
                "showHorizontalScroll": true,
                "showSheetTabs": true,
                "showVerticalScroll": true,
                "tabRatio": 600,
                "visibility": "visible"
            }
        ],
        "Sheets": [
            {
                "name": "资产负债表_600036",
                "sheetId": "3",
                "sheetid": "3",
                "id": "rId1",
                "Hidden": 0
            },
            {
                "name": "现金流量表_600036",
                "sheetId": "4",
                "sheetid": "4",
                "id": "rId2",
                "Hidden": 0
            },
            {
                "name": "利润表_600036",
                "sheetId": "5",
                "sheetid": "5",
                "id": "rId3",
                "Hidden": 0
            },
            {
                "name": "ROE",
                "sheetId": "6",
                "sheetid": "6",
                "id": "rId4",
                "Hidden": 0
            },
            {
                "name": "营业数据",
                "sheetId": "1",
                "sheetid": "1",
                "id": "rId5",
                "Hidden": 0
            }
        ],
        "CalcPr": {
            "calcId": "181029",
            "calcid": "181029",
            "calcCompleted": "true",
            "calcMode": "auto",
            "calcOnSave": "true",
            "concurrentCalc": "true",
            "fullCalcOnLoad": "false",
            "fullPrecision": "true",
            "iterate": "false",
            "iterateCount": "100",
            "iterateDelta": "0.001",
            "refMode": "A1"
        },
        "Names": [],
        "xmlns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        "Views": [
            {
                "zoom": 75
            }
        ]
    },
    "Props": {
        "LastAuthor": "Microsoft Office User",
        "Author": "Microsoft Office User",
        "CreatedDate": "2022-05-30T15:00:08.000Z",
        "ModifiedDate": "2022-06-25T07:27:07.000Z",
        "Application": "Microsoft Macintosh Excel",
        "AppVersion": "16.0300",
        "DocSecurity": "0",
        "HyperlinksChanged": false,
        "SharedDoc": false,
        "LinksUpToDate": false,
        "ScaleCrop": false,
        "Worksheets": 5,
        "SheetNames": [
            "资产负债表_600036",
            "现金流量表_600036",
            "利润表_600036",
            "ROE",
            "营业数据"
        ]
    },
    "Custprops": {},
    "Deps": {},
    "Sheets": {
        "资产负债表_600036": {
            "!ref": "A1:U80",
            "T72": {
                "t": "s",
                "v": "2021-03-20",
                "r": "<t>2021-03-20</t>",
                "h": "2021-03-20",
                "w": "2021-03-20"
            },
            "U72": {
                "t": "s",
                "v": "2022-03-19",
                "r": "<t>2022-03-19</t>",
                "h": "2022-03-19",
                "w": "2022-03-19"
            },
        }
    },
    SheetNames: string[];
    Strings: iXlsxString[];
    Styles: any;
    Themes: any;
    SSF: any;
}


export interface iXlsxSheet {

}

export interface iXlsxString {
    t: string;
    r: string;
    h: string;
}




export interface iFinance {
    currentIndex: number;
    sheets: {
        selectIndex: number;
        balanceSheet: iCompanyJson[];
        incomeStatement: iCompanyJson[];
        cashFlowStatement: iCompanyJson[];
    }
}

interface iCompanyJson {
    [key: string]: string;
}

/* 
 sheets:{
    selectIndex:
    balanceSheet: [
        company1,
        company2,
        company3
    ]
 }
*/

export interface iFile {
    name: string; // 招商银行Data.xlsx
    lastModified: number; // 1656143008239
    lastModifiedDate: object; // "2022-06-25T07:43:28.239Z"
    size: number; // 311221
    type: string; // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
}