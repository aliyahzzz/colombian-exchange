
class GeoMap {
    static zoomFactor = 1.5;
    
    constructor(frame) {
        this.document = frame.contentDocument;
        this.svg = this.document.rootElement;
        this.g = this.svg.querySelector("g#the-map");
        this.notedGrp = this.svg.querySelector("g#noted");
        this.notedElem = null;
        this.transform = this.svg.createSVGTransform();
        this.addEventListener("mousedown");
        this.addEventListener("mouseup");
        this.addEventListener("click");
        this.addEventListener("mousemove");
    }

    getCenterPoint() {
        let rect = this.svg.getBoundingClientRect();
        let ctm = this.g.getCTM();
        let x = ((rect.width / 2) - ctm.e) / ctm.a;
        let y = ((rect.height / 2) - ctm.f) / ctm.d;
        return [x, y]
    }
    
    zoomIn() {
        this.transform.matrix.a *= GeoMap.zoomFactor;
        this.transform.matrix.d *= GeoMap.zoomFactor;
        this.transform.matrix.e *= GeoMap.zoomFactor;
        this.transform.matrix.f *= GeoMap.zoomFactor;
        let [x, y] = this.getCenterPoint();
        this.transform.matrix.e += x - (x * GeoMap.zoomFactor);
        this.transform.matrix.f += y - (y * GeoMap.zoomFactor);
        this.g.transform.baseVal.initialize(this.transform);
    }

    zoomOut() {
        this.transform.matrix.a /= GeoMap.zoomFactor;
        this.transform.matrix.d /= GeoMap.zoomFactor;
        this.transform.matrix.e /= GeoMap.zoomFactor;
        this.transform.matrix.f /= GeoMap.zoomFactor;
        let [x, y] = this.getCenterPoint();
        this.transform.matrix.e += x - (x / GeoMap.zoomFactor);
        this.transform.matrix.f += y - (y / GeoMap.zoomFactor);
        this.g.transform.baseVal.initialize(this.transform);
    }

    moveBy(dx, dy) {
        let ctm = this.g.getCTM();
        console.log(ctm);
        dx /= ctm.a;
        dy /= ctm.d;
        this.transform.matrix.e += dx * this.transform.matrix.a;
        this.transform.matrix.f += dy * this.transform.matrix.d;
        this.g.transform.baseVal.initialize(this.transform);
    }

    addEventListener(etype, options) {
        let listener = this[etype].bind(this);
        this.g.addEventListener(etype, listener, options);
    }

    mousedown(event) {
        this.g.style.cursor = "grabbing";
    }

    mouseup(event) {
        this.g.style.cursor = "default";
    }

    click(event) {
        if (this.notedElem)
            displayNotes(this.notedElem.getAttribute("id"));
    }

    mousemove(event) {
        if (event.buttons) {
            this.moveBy(event.movementX, event.movementY);
            this.theOther.moveBy(event.movementX, event.movementY);
        }
        else {
            let elems = this.document.elementsFromPoint(event.clientX, event.clientY);
            let notedElem = null;
            for (let elem of elems) {
                if (elem.parentElement && elem.parentElement == this.notedGrp) {
                    notedElem = elem;
                    break;
                }
            }
            if (notedElem != this.notedElem) {
                this.notedElem = notedElem;
                this.g.style.cursor = notedElem == null ? "default" : "help";
            }
        }
    }
}


var __appMaps = [];
var __notesDiv;


function convertNotesToDivs() {
    let notes, div;
    for (let key in __appHistNotes) {
        notes = __appHistNotes[key];
        for (let i = 0; i < notes.length; i++) {
            div = document.createElement("div");
            //div.setAttribute("class", "note-par");
            div.innerHTML = notes[i];
            notes[i] = div;
        }
    }
}

function displayNotes(key) {
    let contdiv = __notesDiv.lastElementChild;
    while (contdiv.lastElementChild)
        contdiv.lastElementChild.remove();
    for (let div of __appHistNotes[key])
        contdiv.appendChild(div);
    __notesDiv.style.visibility = "visible";
}

function initApp() {
    console.log("initializing app...");
    let map;
    for (let frm of document.body.querySelectorAll("iframe"))
        __appMaps.push(new GeoMap(frm));

    __appMaps[0].theOther = __appMaps[1];
    __appMaps[1].theOther = __appMaps[0];
    document.body.querySelector("#zoom-in").addEventListener("click", (event) => {
        for (let map of __appMaps)
            map.zoomIn();
    });
    document.body.querySelector("#zoom-out").addEventListener("click", (event) => {
        for (let map of __appMaps)
            map.zoomOut();
    });
    document.body.querySelector("#close-btn").addEventListener("click", (event) => {
        __notesDiv.style.visibility = "hidden";
    });
    __notesDiv = document.body.querySelector("div#notes");
    convertNotesToDivs();
    displayNotes("intro");
}

window.addEventListener("load", (event) => {
    initApp();
});
