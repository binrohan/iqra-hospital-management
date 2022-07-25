var LineChart = new function () {
    var const1_4angle = 3 * Math.PI / 8, that = this, service = {};
    function getNewColor() {
        return '#' + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
    };
    function createSVGElement(element) {
        var elm = document.createElementNS('http://www.w3.org/2000/svg', element.name);
        if (element.attributes) {
            for (var key in element.attributes) {
                elm.setAttribute(key, element.attributes[key]);
            }
        }
        return elm;
    };
    function createCircle(g, point, fillColor) {
        var circle = createSVGElement({
            name: 'circle',
            attributes: {
                'fill-opacity': '1',
                'stroke-opacity': '1',
                fill: fillColor || "#fff",
                "stroke-width": "2",
                stroke: point.profile.color || "#ff6800",
                r: "4",
                cx: point.x,
                cy: point.y
            }
        });
        g.appendChild(circle);
        return circle;
    };
    function getDForPoint(curentPoint, options, g) {
        return ' ' + (curentPoint.x - options.TQXUnit) + ' ' + curentPoint.y + ' ' + curentPoint.x + ' ' + curentPoint.y + ' ' + (curentPoint.x + options.TQXUnit) + ' ' + curentPoint.y;
    };
    var dParameter = new function () {
        function setForFirstPoint(options, g) {
            options.d = [];
            options.points[0] = [];
            for (var j = 0; j < options.sections.length; j++) {
                options.data[0].x = 0;
                var prevPoint, curentPoint = { value: options.data[0][options.sections[j].valueField], x: 0, y: options.height - options.data[0][options.sections[j].valueField] * options.yUnit }, nextPoint = { x: options.xUnit , y: options.height - options.data[1][options.sections[j].valueField] * options.yUnit };
                options.d[j] = 'M' + curentPoint.x + ' ' + curentPoint.y + ' C ' + (curentPoint.x + options.TQXUnit) + ' ' + (curentPoint.y + (nextPoint.y - curentPoint.y) / 3);
                curentPoint.profile = options.sections[j];
                options.points[0].push(curentPoint);
                curentPoint.List = options.data[0].List;
                //createCircle(g, curentPoint);
            }
        };
        function setForMiddlePoints(options, g, lastIndex) {
            for (var i = 1; i < lastIndex; i++) {
                options.points[i] = [];
                options.data[i].x = i * options.xUnit;
                for (var j = 0; j < options.sections.length; j++) {
                    var value = options.data[i][options.sections[j].valueField];
                    var curentPoint = { value: value, x: options.data[i].x, y: options.height - value * options.yUnit };
                    curentPoint.profile = options.sections[j];
                    options.d[j] += getDForPoint(curentPoint, options, g);
                    //createCircle(g, curentPoint);
                    options.points[i].push(curentPoint);
                    curentPoint.List = options.data[i].List;
                }
            }
        };
        function setForLastPoint(options, g, lastIndex) {
            options.points[lastIndex] = [];
            options.data[lastIndex].x = lastIndex * options.xUnit ;
            for (var j = 0; j < options.sections.length; j++) {
                var value = options.data[lastIndex][options.sections[j].valueField];
                var curentPoint = { value: value, x: options.data[lastIndex].x, y: options.height - value * options.yUnit },
                    prevPoint = { x: (lastIndex - 1) * options.xUnit, y: options.height - options.data[lastIndex - 1][options.sections[j].valueField] * options.yUnit };
                options.d[j] += ' ' + (curentPoint.x - options.TQXUnit) + ' ' + (curentPoint.y - (curentPoint.y - prevPoint.y) / 3) + ' ' + curentPoint.x + ' ' + curentPoint.y;
                curentPoint.profile = options.sections[j];
                //createCircle(g, curentPoint);
                options.points[lastIndex].push(curentPoint);
                curentPoint.List = options.data[lastIndex].List;
                //console.log(curentPoint);
            }
        };
        this.Set = function (options, g) {
            options.points = [];
            setForFirstPoint(options, g);
            var lastIndex = options.data.length - 1;
            setForMiddlePoints(options, g, lastIndex);
            setForLastPoint(options, g, lastIndex);
        };
    };
    var evts = new function () {
        var timer, formModel = {}, toltripElm = getHtml();
        function getHtml() {
            var elm= $('<div style="width:200px; position: absolute; font: 12px Arial,Helvetica,sans-serif; background-color:#ff6800;color:#333333; border:1px solid #ff6800;z-index:999999;" class="toltrip">' +
                    '<div class="row">' +
                        '<div class="col-md-6">Hour : </div><div class="col-md-6 auto_bind" data-binding="Hour"> </div>' +
                        '<div class="col-md-6">Sales : </div><div class="col-md-6 auto_bind" data-binding="SalePrice"> </div>' +
                        '<div class="col-md-6">Sale Discount : </div><div class="col-md-6 auto_bind" data-binding="TotalDiscount"> </div>' +
                        '<div class="col-md-6">Sale VAT : </div><div class="col-md-6 auto_bind" data-binding="TotalVAT"> </div>' +
                        '<div class="col-md-6">TP Price : </div><div class="col-md-6 auto_bind" data-binding="PurchasePrice"> </div>' +
                        '<div class="col-md-6">TP VAT : </div><div class="col-md-6 auto_bind" data-binding="PurchaseVAT"> </div>' +
                        '<div class="col-md-6">TP Discount : </div><div class="col-md-6 auto_bind" data-binding="PurchaseDiscount"> </div>' +
                        '<div class="col-md-6">Items : </div><div class="col-md-6 auto_bind" data-binding="ItemCount"> </div>' +
                        '<div class="col-md-6">Voucher : </div><div class="col-md-6 auto_bind" data-binding="TotalVoucher"> </div>' +
                    '</div>'+
                '</div>');
            $(document.body).append(elm);
            Global.Form.Bind(formModel, elm);
            return elm;
        };
        function getToltripOffset(e) {
            var x = (e.pageX || e.clientX) - toltripElm.width() - 20,
                y = $(document).scrollTop() + 20;
            x = x > 0 ? 20 : $(document).width() - toltripElm.width() - 20;
            return {
                top: y + 'px',
                left: x + 'px',
                display:'block'
            }
        };
        function showToltrip(point, toltrip) {
            toltrip.circle.setAttribute('cx', point.x);
            toltrip.circle.setAttribute('cy', point.y);
        };
        function onMouseMove(e, options) {
            var x = (e.pageX || e.clientX) - options.offset.left, y = (e.pageY || e.clientY) - options.offset.top;
            var index = parseInt((x + options.xUnit / 3) / options.xUnit), point = options.points[index];
            if (point && options.currentPoint != point) {
                for (var j = 0; j < options.sections.length; j++) {
                    showToltrip(point[j], options.toltrip[j]);
                }
                toltripElm.stop().show().animate(getToltripOffset(e), 100);
                formModel.Hour = options.data[index]?options.data[index].title:'';
                ["ItemCount", "TotalVoucher", "SalePrice", "TotalDiscount", "TotalVAT", "CreatedAt", "PurchasePrice", "PurchaseVAT", "PurchaseDiscount"].each(function (i) {
                    if (this != 'CreatedAt') {
                        formModel[this + ''] = point[0].List ? point[0].List[i].toMoney() : 0;
                        //console.log([this+'', point[0].List[i].toMoney()]);
                    }
                });
                //console.log(point);
                options.currentPoint = point;
                timer && clearTimeout(timer);
                //timer = setTimeout(function () {
                //    toltripElm.hide(300);
                //},2000);
            }
            //console.log(options);
            
        };
        function onClick(elm, options) {
            var section = $(elm).data('section');
            for (var i = 0; i < options.currentPoint.length; i++) {
                if (section == options.currentPoint[i].profile) {
                    //console.log(options.currentPoint[i]);
                    section.click && section.click(options.currentPoint[i].value, options);
                }
            }
        };
        function setTooltrip(options) {
            options.toltrip = [];
            for (var j = 0; j < options.sections.length; j++) {
                var g = createSVGElement({ name: 'g' }), section = options.sections[j];
                options.svg.appendChild(g);
                options.toltrip.push({
                    elm: toltripElm,
                    circle: createCircle(g, { x: 0, y: 0, profile: section }, section.color || '#ff6800')
                });
            }

        };
        this.Bind = function (options) {
            var g = createSVGElement({ name: 'g' });
            g.appendChild(createSVGElement({
                name: 'rect',
                attributes: {
                    style: "fill:#ffffff;fill-opacity:0;",
                    x: 0,
                    y: 0,
                    width: options.width,
                    height: options.height
                }
            }));
            options.svg.appendChild(g);
            $(g).mousemove(function (e) {
                onMouseMove(e, options);
            })
            setTooltrip(options);
            $(document).click(function () { toltripElm.hide(); });
        };
    };
    function createChart(options) {
        options.container.appendChild(options.svg);
        var g = createSVGElement({ name: 'g' });
        dParameter.Set(options, g);
        options.svg.appendChild(g);
        for (var j = 0; j < options.sections.length; j++) {
            var path = createSVGElement({
                name: 'path',
                attributes: {
                    fill: "none",
                    "stroke-width": "2",
                    stroke: options.sections[j].color,
                    d: options.d[j]
                }
            });
            g.appendChild(path);
        }
        evts.Bind(options);
    };
    this.Bind = function (options) {
        var div = document.createElement('div');
        div.style.position = 'relative';
        options.onChange = options.onChange || function () { };
        options.svg = options.svg || createSVGElement({ name: 'svg', attributes: { width: options.width, height: options.height } });
        //options.height = options.label != false ? options.height : options.height;
        options.container.appendChild(div);
        options.container = div;
        options.yUnit = (options.height) / (options.max || 1);
        options.xUnit = (options.width) / 24;
        options.TQXUnit = options.xUnit / 3;
        createChart(options);
        options.offset = $(options.container).offset();
    };
};
