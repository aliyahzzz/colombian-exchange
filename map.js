
function initMap() {
    let ctryGrp = document.querySelector("g#ctry");
    let curCtry = null;
    document.rootElement.addEventListener("mousemove", (event) => {
        let elems = document.elementsFromPoint(event.clientX, event.clientY);
        for (let elem of elems) {
            if (elem.parentElement == ctryGrp && elem != curCtry) {
                if (curCtry) curCtry.style.fillOpacity = .7;
                curCtry = elem;
                curCtry.style.fillOpacity = 1;
                console.log(curCtry.getAttribute("id"));
                break;
            }
        }
    });
    document.rootElement.addEventListener("click", (event) => {
        let elems = document.elementsFromPoint(event.clientX, event.clientY);
        for (let elem of elems)
            console.log(elem.getAttribute("id"));
    });
    /*
    for (let elem of document.querySelectorAll("g#ctry > path"))
        elem.addEventListener("mouseenter", (event) => {
            let id = event.currentTarget.getAttribute("id");
            console.log(`entered ${id}`);
        });
    */
    console.log("initialized map");
}


window.addEventListener("load", (event) => {
    initMap();
});
