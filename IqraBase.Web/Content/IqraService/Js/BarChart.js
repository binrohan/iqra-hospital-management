(function (that, none) {
    var model, uniqueBar = {}, self = {}, txt = ['','', ' Hundred', ' Thousand', '', ' Lac', '',' Crore'];
    function getVertexText(start) {
        var model = { div: 1, text: '' },index=0;
        start = parseInt(start + '', 10) + '';
        for (var i = start.length - 1; i > 0; i--) {
            if (start[i] === '0') {
                index = start.length - i;
                if (txt[index]) {
                    model = { div: Math.pow(10, index), text: txt[index] };
                }
            } else {
                return model;
            }
        }
        return model;
        //options.vertex[0].
    };
    function getNewColor() {
        return '#' + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
    };
    function getMaxHeight(options, response, width) {
        var maxWidth = 0, txtWidth = 0;
        response.Data.each(function (i) {
            this.textwidth=options.ctx.measureText(this[options.textfield]).width;
            maxWidth = maxWidth < this.textwidth ? this.textwidth : maxWidth;
        });
        width = width - 4;
        if (maxWidth <= width) {
            options.textrotation = 0;
            return 32;//10px top + 10px bottom +12 font size
        } else {
            options.textrotation = Math.acos(width / maxWidth);
            var maxHeight = Math.sin(options.textrotation) * maxWidth + 20 + (12 * Math.cos(options.textrotation));
            return maxHeight;
        }
    };
    function calculateVertix(options, response) {
        var start = 0, str = (parseInt(response.Max) + ''), firstDigit = parseInt(str[0]);
        if (firstDigit < 4) {
            str = str.length - 2;
            start = firstDigit == 1 ? response.Max < 20 ? response.Max < 10 ? 1 : 3 : 1 : 5;
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
        var i = start, opt = getVertexText(start);
        for (; i <= response.Max; i += start) {
            options.vertex.push(opt.text ? i.div(opt.div).toFloat(2) + opt.text : i.toMoney());
        }
        i <= response.Max && options.vertex.push(i.toMoney());
        response.Max = i;
        getVertexText(options);
        options.ctx.font = '12px "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif';
        options.vertexwidth = options.ctx.measureText(options.vertex[options.vertex.length - 1]).width + 10;
    };
    function setVertex(options) {
        var ctx=options.ctx, len = options.vertex.length, incrmnt = options.height / options.vertex.length, y;
        options.vertex.each(function (i) {
            y=options.height - (i + 1) * incrmnt;
            ctx.fillStyle = '#555555'
            ctx.fillText(this + "", 5, y + 6);
            ctx.strokeStyle = '#ededed';
            ctx.moveTo(options.vertexwidth, y);
            ctx.lineTo(options.width, y);
            ctx.stroke();
        });
        //console.log(['',]);
        ctx.fillStyle = '#FFFFFF'
    };
    function setLabel(options, response) {
        var x, y;


        //textwidth
        response.Data.each(function (i) {
            options.ctx.save();
            x = this.rect.x ;
            y = options.height + options.labelheight/2+6* Math.cos(options.textrotation);
            options.ctx.translate((x + this.width / 2), y);
            options.ctx.rotate(options.textrotation)
            options.ctx.translate(-(x + this.width / 2), -y);
            options.ctx.fillStyle = this.color;
            options.ctx.fillText(this[options.textfield], x + (this.width - this.textwidth) / 2 - 6 * Math.sign(options.textrotation), y);
            options.ctx.restore();
        });
    };
    function createInnerItem(options, item, ctx, data, i, rect) {
        ctx.fillStyle = item.color;
        ctx.fillRect(rect.x + (item.width + options.innerlinespace) * i + options.innerlinespace, options.height - item.height * data[item.valuefield], item.width, item.height * data[item.valuefield]);
    };
    function createItem(options, item, ctx, i) {
        ctx.fillStyle = item.color;
        var rect =item.rect= {
            x: (item.width + options.linespace) * i + options.linespace + options.vertexwidth,
            y:options.height - item.height,
            width:item.width,
            height: item.height
        };

        //console.log(['this[options.valuefield] * mltr', this[options.valuefield], mltr, this]);

        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        options.inner.each(function (i) {
            createInnerItem(options, this, ctx, item, i, rect);
        });
    };
    function create(options, response) {
        var canvas = $('<canvas width="' + options.width + '" height="' + options.height + '">')[0];
        var ctx = options.ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        options.container.append(canvas);
        calculateVertix(options, response);
        var width = parseInt((options.width - options.vertexwidth - (response.Data.length + 1) * options.linespace) / response.Data.length);
            options.labelheight = getMaxHeight(options, response, width);
            options.height = options.height - options.labelheight;


        ctx.fillRect(options.vertexwidth, 0, options.width - options.vertexwidth, options.height);
        ctx.strokeStyle = "silver";
        ctx.strokeRect(options.vertexwidth, 0, options.width - options.vertexwidth, options.height);
        setVertex(options);
        options.innerlinespace = parseInt(options.innerlinespace || width * 0.1);
        var innerWidth = parseInt((width - (options.inner.length + 1) * options.innerlinespace) / options.inner.length),
            mltr = options.height / options.CalculatedMaxValue;
        console.log(['this[options.valuefield] * mltr', options.height, options.CalculatedMaxValue, options]);

        options.inner.each(function () {
            this.height = mltr;
            this.width = innerWidth;
        });
        response.Data.each(function (i) {
            this.color = this.color || options.color || getNewColor();
            this.height = parseInt(this[options.valuefield] * mltr);
            this.width = width;
            createItem(options, this, ctx, i);
            console.log(['this[options.valuefield] * mltr', this[options.valuefield], mltr, this, options]);
        });
        setLabel(options, response);
    };
    function getCalculatedMax(max) {
        //console.log(max)
        var exMax = parseInt(max + max * 0.1), mm = 10, q = parseInt(exMax * 0.20), qml = (q + '').length-1;
        if (q < 4) {
            mm = 2;
        } else if (q < 20) {
            mm = 5;
        } else {
            mm = 1;
            for (var i = 0; i < qml; i++) {
                mm *= 10;
            }
        }
        max = 0;
        for (var i = 0; max <= exMax; i++) {
            max += mm;
        }
        return max||1;
    };
    function bind(options) {
        var response = { Data: [] }, max = 0, data;
        for (var key in options.uniqueBar) {
            data = options.uniqueBar[key];
            max = max < data[options.valuefield] ? data[options.valuefield] : max;
            response.Data.push(data);
        }
        options.MaxValue = max;
        options.CalculatedMaxValue = getCalculatedMax(max);
        response.Max = options.CalculatedMaxValue;
        //console.log(['response.Max', response.Max, response]);
        create(options, response);
    };
    (function (service) {
        function setDefault(options) {
            setNonCapitalisation(options);
            options.uniqueBar = {};
            options.textfield = options.textfield || 'text';
            options.valuefield = options.valuefield || 'value';
            options.width = options.width || options.container.width()||300;
            options.height = options.height || options.container.height()||100;
            options.linespace = options.linespace || 1;
            options.linespace = options.width * options.linespace/100
            options.inner = options.inner || [];
            options.inner.each(function () {
                setNonCapitalisation(this);
                this.color = this.color || getNewColor();
            });
        };
        function getDefaultValue(options,dataModel) {
            var model = Global.Copy({},dataModel,{});
            model[options.valuefield] = 0;
            model[options.textfield] = dataModel[options.textfield];
            return model;
        };
        service.Bind = function (options) {
            setDefault(options)
            options.data.each(function () {
                options.uniqueBar[this[options.textfield]] = options.uniqueBar[this[options.textfield]] || getDefaultValue(options,this);
                options.uniqueBar[this[options.textfield]][options.valuefield] += (this[options.valuefield]||0);
            });
            bind(options);
        };
    })(that.Service = {});
})(Global.BarChart = {});