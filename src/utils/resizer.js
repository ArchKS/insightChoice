export function doResize() {
    let topEl = document.querySelector(".table");
    let resizerEl = document.getElementById("resizer");

    let m_pos;

    function resize(e) {
        let dy = e.y - m_pos;
        let h = parseInt(getComputedStyle(topEl).height) + dy;
        topEl.style.height = h + "px";
    }



    resizerEl.addEventListener("mousedown", (e) => {
        m_pos = e.y;
        resizerEl.addEventListener("mousemove", resize, false);
    }, false)

    resizerEl.addEventListener("mouseup", () => {
        resizerEl.removeEventListener("mouseover", resize, false);
    }, false)
}