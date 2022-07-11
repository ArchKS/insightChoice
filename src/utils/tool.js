import { SUMMARYAARRAY } from "./Variable";

export function setStyleToTableColumn() {
    // 给:结尾的，和 合计 类目的添加单独的色号
    let tbContent = document.querySelectorAll(".ant-table-cell-content");
    tbContent.forEach(el => {
        el.classList.remove("row_item_content_by_self");
        let f = el.parentElement.parentElement;
        if (f) {
            f.classList.remove('row_content_by_self')
            f.classList.remove('summary_content_by_self')
        }
    });

    tbContent.forEach(el => {
        let txt = el.innerText.trim();
        if (/:$/.test(txt)) {
            el.classList.add("row_item_content_by_self");
            let f = el.parentElement.parentElement;
            if (f) {
                f.classList.add('row_content_by_self')
            }
        } else if (SUMMARYAARRAY.indexOf(txt) >= 0) {
            let f = el.parentElement.parentElement;
            if (f) {
                f.classList.add('summary_content_by_self')
            }
        }
    });
}