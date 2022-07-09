

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
