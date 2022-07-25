(function (nope, wnd, gbl, none) {
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
                var prevPoint, curentPoint = { value: options.data[0][options.sections[j].valuefield], x: 0, y: options.height - options.data[0][options.sections[j].valuefield] * options.yUnit }, nextPoint = { x: options.xUnit, y: options.height - options.data[1][options.sections[j].valuefield] * options.yUnit };
                options.d[j] = 'M' + curentPoint.x + ' ' + curentPoint.y + ' C ' + (curentPoint.x + options.TQXUnit) + ' ' + (curentPoint.y + (nextPoint.y - curentPoint.y) / 3);
                curentPoint.profile = options.sections[j];
                options.points[0].push(curentPoint);
                curentPoint.List = options.data[0].List;
                curentPoint.title = curentPoint.value.toMoney();
            }
        };
        function setForMiddlePoints(options, g, lastIndex) {
            for (var i = 1; i < lastIndex; i++) {
                options.points[i] = [];
                options.data[i].x = i * options.xUnit;
                for (var j = 0; j < options.sections.length; j++) {
                    var value = options.data[i][options.sections[j].valuefield];
                    var curentPoint = { value: value, x: options.data[i].x, y: options.height - value * options.yUnit };
                    curentPoint.profile = options.sections[j];
                    options.d[j] += getDForPoint(curentPoint, options, g);
                    //createCircle(g, curentPoint);
                    options.points[i].push(curentPoint);
                    curentPoint.List = options.data[i].List;
                    curentPoint.title = curentPoint.value.toMoney();
                }
            }
        };
        function setForLastPoint(options, g, lastIndex) {
            options.points[lastIndex] = [];
            options.data[lastIndex].x = lastIndex * options.xUnit;
            for (var j = 0; j < options.sections.length; j++) {
                var value = options.data[lastIndex][options.sections[j].valuefield];
                var curentPoint = { value: value, x: options.data[lastIndex].x, y: options.height - value * options.yUnit },
                    prevPoint = { x: (lastIndex - 1) * options.xUnit, y: options.height - options.data[lastIndex - 1][options.sections[j].valuefield] * options.yUnit };
                options.d[j] += ' ' + (curentPoint.x - options.TQXUnit) + ' ' + (curentPoint.y - (curentPoint.y - prevPoint.y) / 3) + ' ' + curentPoint.x + ' ' + curentPoint.y;
                curentPoint.profile = options.sections[j];
                //createCircle(g, curentPoint);
                options.points[lastIndex].push(curentPoint);
                curentPoint.List = options.data[lastIndex].List;
                curentPoint.title = curentPoint.value.toMoney();
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
        function getToltripOffset(prevPoint, point, nextValue, toltrip, index) {
            var x = point.x - toltrip.elm.width() / 2 - 8, y;
            if (((prevPoint && prevPoint[index].value || 0) + (nextValue && nextValue[index].value || 0)) / 2 > point.value) {
                y = point.y + 10;
                toltrip.elm.removeClass('bottom');
            } else {
                y = point.y - 40;
                toltrip.elm.addClass('bottom');
            }
            return {
                top: y + 'px',
                left: x + 'px'
            }
        };
        function showToltrip(prevPoint, point, nextValue, toltrip, index, sections) {
            sections.toltrip.show !== false && toltrip.elm.html(point.profile.title + ' : ' + point.title);
            sections.toltrip.onchange && sections.toltrip.onchange(sections, point, toltrip);
            var offset = getToltripOffset(prevPoint, point, nextValue, toltrip, index);
            toltrip.circle.setAttribute('cx', point.x);
            toltrip.circle.setAttribute('cy', point.y);
            toltrip.elm.stop().animate(offset, 100);
        };
        function onMouseMove(e, options) {
            var x = (e.pageX || e.clientX) - options.offset.left, y = (e.pageY || e.clientY) - options.offset.top;
            var index = parseInt((x + options.xUnit / 3) / options.xUnit), point = options.points[index];
            if (point && options.currentPoint != point) {
                for (var j = 0; j < options.sections.length; j++) {
                    showToltrip(options.points[index - 1], point[j], options.points[index + 1], options.toltrip[j], j, options.sections[j]);
                }
                options.currentPoint = point;
                //console.log(['options.points', options.points, options]);
            }
        };
        function onClick(elm, options) {
            var section = $(elm).data('section');
            for (var i = 0; i < options.currentPoint.length; i++) {
                if (section == options.currentPoint[i].profile) {
                    section.click && section.click(options.currentPoint[i].value, options);
                }
            }
        };
        function setTooltrip(options) {
            options.toltrip = [];
            for (var j = 0; j < options.sections.length; j++) {
                var g = createSVGElement({ name: 'g' }), section = options.sections[j];
                options.svg.appendChild(g);
                section.toltrip = section.toltrip || {};
                setNonCapitalisation(section.toltrip);
                section.toltrip.backcolor = section.toltrip.backcolor || section.color;
                section.toltrip.color = section.toltrip.color || section.textcolor || 'grey';
                section.toltrip.html = section.toltrip.html || '<div style="position: absolute; font: 12px Arial,Helvetica,sans-serif; background-color:' + section.toltrip.backcolor + '; border:1px solid ' + (section.color || '#ff6800') + '; color:' + section.toltrip.color + '; border-radius: 5px; padding: 5px;" class="toltrip"></div>';
                $(g).click(function () { onClick(this, options) }).data('section', section);
                options.toltrip.push({
                    elm: $(section.toltrip.html).click(function () { onClick(this, options) }).data('section', section),
                    circle: createCircle(g, { x: 0, y: 0, profile: section }, section.color || '#ff6800')
                });
                options.container.appendChild(options.toltrip[j].elm[0]);
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
            $(g).mousemove(function (e) { onMouseMove(e, options); });
            setTooltrip(options);
        };
    };
    function createChart(options) {
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
    (function (wnd, gbl) {
        function calculateVertix(options) {
            var start = 0, str = (parseInt(options.max) + ''), firstDigit = parseInt(str[0]);
            if (firstDigit < 4) {
                str = str.length - 2;
                start = firstDigit == 1 ? options.max < 20 ? options.max < 10 ? 1 : 3 : 1 : 5;
                for (var i = 0; i < str; i++) {
                    start = start * 10;
                }
            } else {
                str = str.length - 1;
                start = 1;
                for (var i = 0; i < str; i++) {
                    start = start * 10;
                }
            }
            options.vertex = [];
            var i = start;
            for (; i <= options.max; i += start) {
                options.vertex.push(i.toMoney());
            }
            options.vertex.push(i.toMoney());
            options.max = i;
            //options.vertexwidth = options.ctx.measureText(options.vertex[options.vertex.length - 1]).width + 10;
        };
        function calculateMax(options) {
            if (options.max) {
                calculateVertix(options);
                return options.max;
            }
            var data, max = 0;
            options.data.each(function () {
                data = this;
                options.sections.each(function () {
                    max = max < data[this.valuefield] ? data[this.valuefield] : max;
                });
            });
            options.max = max;
            calculateVertix(options);
            return options.max;
        };
        function setDefaultParameter(options) {
            var div = document.createElement('div');
            div.style.position = 'relative';
            setNonCapitalisation(options);
            options.width = options.width || options.container.width();
            options.height = options.height || options.container.height();
            options.onchange = options.onchange || function () { };
            options.svg = options.svg || createSVGElement({ name: 'svg', attributes: { width: options.width, height: options.height } });
            options.container.append(div);
            options.container = div;
            options.container.appendChild(options.svg);
            options.sections.each(function () {
                setNonCapitalisation(this);
            });
            calculateMax(options);

        };
        this.Bind = function (options) {
            setDefaultParameter(options);
            options.height = options.height - 60;//for Label
            //options.width = options.width - 40;//for Label
            options.yUnit = (options.height) / (options.max || 1);
            options.xUnit = (options.width) / options.data.length;
            options.TQXUnit = options.xUnit / 3;
            createChart(options);
            service.Label.Set(options);
            options.offset = $(options.container).offset();

            return options;
        };
    }).call(this.Service = {}, wnd, gbl);
    (function () {
        //<text x="0" y="15" fill="red">I love SVG!</text>
        this.Set = function (options) {
            var height = options.height + 75;
            options.data.each(function () {
                //document.createTextNode("milind morey")
                var text = createSVGElement({
                    name: 'text',
                    attributes: {
                        style: "fill:#000000;",
                        transform: 'rotate(270,' + this.x + ',' + height + ')',
                        x: this.x,
                        y: height,
                    }
                });
                text.appendChild(document.createTextNode(this.text));
                options.svg.appendChild(text);
            });
        };
    }).call(service.Label = {});
}).call(Global.LineChart, function () { }, window, Global);
