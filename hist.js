
var __appMaps = [];


class GeoMap {
    static zoomFactor = 1.5;
    
    constructor(frame) {
        this.svg = frame.contentDocument.rootElement;
        this.g = this.svg.querySelector("g#the-map");
        this.transform = this.svg.createSVGTransform();
        this.ctm = this.g.getCTM();
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
        console.log("click");
    }

    mousemove(event) {
        if (event.buttons) {
            this.moveBy(event.movementX, event.movementY);
            this.theOther.moveBy(event.movementX, event.movementY);
        }
    }
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
}

window.addEventListener("load", (event) => {
    initApp();
});
