// xlsx读取到的 Excel 文件的格式：XLSX.read(result, { type: "binary" }) as XLSX.WorkBook;
// like XLSX.WorkBook type
export interface iSheetBook {
    Diectory: object,
    Workbook: object,
    Props: object,
    Custprops: object,
    Deps: object,
    Sheets: iSheet[];
    SheetNames: string[];
    Strings: object[];
    Styles: object;
    Themes: Object;
    SSF: Object;
}

export interface iSheet {
    [key: string /* xlsx filename example -> 300059.xlsx */]: iCellObj[]
}

export interface iCellObj {
    [key: string /* cell positon: example -> E1 */]: {
        t: string;
        v: string;
        r: string;
        h: string;
        w: string;
    }
}

export interface iSheetJsonItem {
    [columnName: string]: string;
}

export interface iPane {
    title: string;
    key: string;
}
export interface iAntdTableColumnType {
    title: string;
    dataIndex: string;
    render: Function;
}

export interface iAntdTableDataSourceType {
    // 2001年年报: 20.35
    [key: string]: string;
    // Choice一般为空 首行
    __EMPTY: string;
}


export interface iEchartsOption {
    xAxis: any;
    yAxis: any;
    series: iSeriesItem[] | [];
    tooltip?: any;
    toolbox?: any;
    legend?: any;
}

export interface iSeriesItem {
    data: string[] | number[],
    type: 'line' | 'bar' | 'pie',
    name: string,
    smooth: boolean,
    markPoint?: any;
    markLine?: any;
    stack?: 'all' | 'total';
    areaStyle?:object;
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

export interface iFile {
    name: string; // 招商银行Data.xlsx
    lastModified: number; // 1656143008239
    lastModifiedDate: object; // "2022-06-25T07:43:28.239Z"
    size: number; // 311221
    type: string; // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
}


export interface iTable {
    fileName: string;
    columns: iAntdTableColumnType[];
    dataSource: iAntdTableDataSourceType[]
}

export interface iStoreObj {
    setRowIndex: any;
    setTable:any;
    setOption: any;
}