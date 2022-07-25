(function () {
    var that = this, service = {};
    var WIDEBAR_WIDTH = 2;
    var NARROWBAR_WIDTH = 1;

    var NUM_CHARACTERS = 43;
    var mEncoding = {};

    var mCodeValue = [];

    //Additional properties 
    var ShowString = false;
    var IncludeCheckSumDigit = false;
    //var TextFont = new Font("Courier New", 7);
    //var TextColor = Color.Black;

    (function () {
        mEncoding["*"] = "bWbwBwBwb";
        mEncoding["-"] = "bWbwbwBwB";
        mEncoding["$"] = "bWbWbWbwb";
        mEncoding["%"] = "bwbWbWbWb";
        mEncoding[" "] = "bWBwbwBwb";
        mEncoding["."] = "BWbwbwBwb";
        mEncoding["/"] = "bWbWbwbWb";
        mEncoding["+"] = "bWbwbWbWb";
        mEncoding["0"] = "bwbWBwBwb";
        mEncoding["1"] = "BwbWbwbwB";
        mEncoding["2"] = "bwBWbwbwB";
        mEncoding["3"] = "BwBWbwbwb";
        mEncoding["4"] = "bwbWBwbwB";
        mEncoding["5"] = "BwbWBwbwb";
        mEncoding["6"] = "bwBWBwbwb";
        mEncoding["7"] = "bwbWbwBwB";
        mEncoding["8"] = "BwbWbwBwb";
        mEncoding["9"] = "bwBWbwBwb";
        mEncoding["A"] = "BwbwbWbwB";
        mEncoding["B"] = "bwBwbWbwB";
        mEncoding["C"] = "BwBwbWbwb";
        mEncoding["D"] = "bwbwBWbwB";
        mEncoding["E"] = "BwbwBWbwb";
        mEncoding["F"] = "bwBwBWbwb";
        mEncoding["G"] = "bwbwbWBwB";
        mEncoding["H"] = "BwbwbWBwb";
        mEncoding["I"] = "bwBwbWBwb";
        mEncoding["J"] = "bwbwBWBwb";
        mEncoding["K"] = "BwbwbwbWB";
        mEncoding["L"] = "bwBwbwbWB";
        mEncoding["M"] = "BwBwbwbWb";
        mEncoding["N"] = "bwbwBwbWB";
        mEncoding["O"] = "BwbwBwbWb";
        mEncoding["P"] = "bwBwBwbWb";
        mEncoding["Q"] = "bwbwbwBWB";
        mEncoding["R"] = "BwbwbwBWb";
        mEncoding["S"] = "bwBwbwBWb";
        mEncoding["T"] = "bwbwBwBWb";
        mEncoding["U"] = "BWbwbwbwB";
        mEncoding["V"] = "bWBwbwbwB";
        mEncoding["W"] = "BWBwbwbwb";
        mEncoding["X"] = "bWbwBwbwB";
        mEncoding["Y"] = "BWbwBwbwb";
        mEncoding["Z"] = "bWBwBwbwb";

        mCodeValue[0] = '0';
        mCodeValue[1] = '1';
        mCodeValue[2] = '2';
        mCodeValue[3] = '3';
        mCodeValue[4] = '4';
        mCodeValue[5] = '5';
        mCodeValue[6] = '6';
        mCodeValue[7] = '7';
        mCodeValue[8] = '8';
        mCodeValue[9] = '9';
        mCodeValue[10] = 'A';
        mCodeValue[11] = 'B';
        mCodeValue[12] = 'C';
        mCodeValue[13] = 'D';
        mCodeValue[14] = 'E';
        mCodeValue[15] = 'F';
        mCodeValue[16] = 'G';
        mCodeValue[17] = 'H';
        mCodeValue[18] = 'I';
        mCodeValue[19] = 'J';
        mCodeValue[20] = 'K';
        mCodeValue[21] = 'L';
        mCodeValue[22] = 'M';
        mCodeValue[23] = 'N';
        mCodeValue[24] = 'O';
        mCodeValue[25] = 'P';
        mCodeValue[26] = 'Q';
        mCodeValue[27] = 'R';
        mCodeValue[28] = 'S';
        mCodeValue[29] = 'T';
        mCodeValue[30] = 'U';
        mCodeValue[31] = 'V';
        mCodeValue[32] = 'W';
        mCodeValue[33] = 'X';
        mCodeValue[34] = 'Y';
        mCodeValue[35] = 'Z';
        mCodeValue[36] = '-';
        mCodeValue[37] = '.';
        mCodeValue[38] = ' ';
        mCodeValue[39] = '$';
        mCodeValue[40] = '/';
        mCodeValue[41] = '+';
        mCodeValue[42] = '%';
    })();
    (function () {
        function setDefaultOptions(options) {
            (typeof (options.text) === 'object') && setNonCapitalisation(options.text);
            if (typeof (options.text) === 'string') {
                options.text = { text: options.text };
            }

            options.text.font = options.text.font || "15px Arial";
            options.text.fillStyle = options.text.color || options.text.fillcolor || options.text.fillStyle || "#000000";
            options.text.height = parseInt(options.text.font, 10) || 15;
            //console.log(['options.height || 30) + options.text.height', (options.height || 25), options.text.height, options]);
            options.height = options.height || (25 + options.text.height);
            return options;
        };
        this.GetHeight = function (options) {
            if (options.code && options.text) {
                setDefaultOptions(options);
            }
            return options.height || 40;
        };
        this.Set = function (options, ctx, width) {
            if (options.code && options.text) {
                ctx.font = options.text.font;
                var wd = ctx.measureText(options.text.text).width,
                    start = (width - wd) / 2,
                    height = options.height - options.text.height;

                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(start - 5, height, wd + 10, options.text.height);
                ctx.font = options.text.font;
                ctx.fillStyle = options.text.fillStyle;
                ctx.fillText(options.text.text, start, options.height);
            }
        };
    }).call(service.Text = {});

    function ExtendedString(s) {
        return s;
    };

    function DrawBarcode(ctx, EncodedString, Height, options) {
        //Start drawing at 0, 0
        var XPosition = options.paddingLeft, YPosition = options.paddingTop;


        var CurrentSymbol = EncodedString.split("");
        var EncodedSymbols;
        //console.log([' for (var j = 0; j < EncodedString.length; j++) {',CurrentSymbol,  EncodedString, EncodedString.length]);
        //-- draw the bars
        for (var j = 0; j < EncodedString.length; j++) {

            //check if the symbol can be used

            EncodedSymbols = mEncoding[CurrentSymbol[j]].split("");
            //console.log(['EncodedSymbols', EncodedSymbols, CurrentSymbol[j]]);
            for (var i = 0; i < EncodedSymbols.length; i++) {
                //Dim CurrentCode As String = EncodedSymbol.Substring(i, 1)
                var CurrentCode = EncodedSymbols[i];


                ctx.fillStyle = getBCSymbolColor(CurrentCode);
                ctx.fillRect(XPosition, YPosition, getBCSymbolWidth(CurrentCode), Height);

                XPosition = XPosition + getBCSymbolWidth(CurrentCode);
            }
            ctx.fillStyle = getBCSymbolColor('w');
            ctx.fillRect(XPosition, YPosition, getBCSymbolWidth('w'), Height);

            //After each written full symbol we need a whitespace (narrow width)
            XPosition = XPosition + getBCSymbolWidth('w');

        }
        //--------------------------

    };
    function getBCSymbolColor(symbol) {
        if (symbol == 'W' | symbol == 'w') {
            return "#FFFFFF";
        }
        else {
            return "#000000";
        }
    };
    function getBCSymbolWidth(symbol) {
        if (symbol == 'B' | symbol == 'W') {
            return WIDEBAR_WIDTH;
        }
        else {
            return NARROWBAR_WIDTH;
        }
    };
    function CheckSum(sCode) {
        var Chk = 0;

        var ax = sCode.ToCharArray();

        for (var j = 0; j <= sCode.length - 1; j++) {

            Chk += GetSymbolValue(ax[j]);
        }
        return Chk % (NUM_CHARACTERS);
    };
    function GetSymbolValue(s) {
        var k = 0;

        for (k = 0; k <= NUM_CHARACTERS; k++) {
            if (mCodeValue[k] == s) {
                return k;
            }
        }
        return -1;
    };
    function setDefaultOptions(options) {
        setNonCapitalisation(options);
        options.height = service.Text.GetHeight(options);
        options.padding = options.padding || 0;
        options.paddingLeft = options.paddingLeft || options.padding;
        options.paddingRight = options.paddingRight || options.padding;
        options.paddingTop = options.paddingTop || options.padding;
        options.paddingBottom = options.paddingBottom || options.padding;

        return options;
    };

    this.Get = function (options) {
        setDefaultOptions(options);
        //elm, OriginalString, ImageHeight
        var OriginalString = options.code || options.text, ImageHeight = options.height;
        var c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            ImageWidth = (OriginalString.length + 2) * 13 + options.paddingLeft;
        //document.getElementById("canvas").appendChild(c);

        c.width = (ImageWidth + options.paddingRight);
        c.height = ImageHeight;
        ctx.font = "10px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ImageWidth, ImageHeight);
        ImageHeight = ImageHeight - (options.paddingTop + options.paddingBottom);

        //get the extended string
        var ExtString = null;
        ExtString = OriginalString;


        //-- This part format the sring that will be encoded
        //-- The string needs to be surrounded by asterisks 
        //-- to make it a valid Code39 barcode
        var EncodedString = null;
        var ChkSum = 0;

        EncodedString = "*" + ExtString + "*";
        //----------------------


        var H = 20;

        ctx.fillStyle = "#000000";
        //ctx.fillText(OriginalString, 0, ImageHeight - H);
        //ImageHeight = ImageHeight - H;
        //console.log([OriginalString, c, ctx, H, ImageHeight, ctx.measureText(OriginalString)]);

        //----------------------------------------

        //THIS IS WHERE THE BARCODE DRAWING HAPPENS
        DrawBarcode(ctx, EncodedString, ImageHeight, options);

        service.Text.Set(options, ctx, ImageWidth);
        //var img = c.toDataURL("image/png");
        //elm.html('<img src="' + c.toDataURL("image/png") + '"/>');

        return c.toDataURL("image/png");


    };
    this.Bind = function (options) {
        var data = that.Get(options);
        options.elm.html('<img src="' + data + '"/>');
    };
    this.Print = function (options, text) {
        if (typeof (options) === 'string') {
            options = { Code: options, text: text };
        }
        Global.Print('<img src="' + that.Get(options) + '"/>');
    };
    this.Ean13 = new function () {
        var Structure = setStructure(), img, elementWidth = 1, barWidth = 1, height = 1, fonts = [];
        var Text = '', StartX = 0, StartY = 0, ctx, that = this;
        function Draw(ctx) {
            var x = StartX;
            //console.log(['x, StartY, barWidth, height', x, StartY, barWidth, height]);
            ctx.fillRect(x, StartY, barWidth, height);
            x += barWidth * 2;
            ctx.fillRect(x, StartY, barWidth, height);
            x = fonts[5].Point.X + barWidth * 8;
            ctx.fillRect(x, StartY, barWidth, height);
            x += barWidth * 2;
            ctx.fillRect(x, StartY, barWidth, height);
            x = fonts[11].Point.X + barWidth * 7;
            ctx.fillRect(x, StartY, barWidth, height);
            x += barWidth * 2;
            ctx.fillRect(x, StartY, barWidth, height);

            fonts.each(function () {
                this.Draw(ctx);
            });
        };
        function SetFont() {
            var chk = Text[0];
            var strct = Structure[chk];
            var checkSum = parseInt(chk + ""), digit = 0;
            fonts = [];
            StartX += 3 * barWidth;
            for (var i = 1; i < 7; i++) {
                checkSum += getValue(Text[i], i);
                var font = GetFont(Text[i], i - 1, FontBase.WhitePen, FontBase.BlackPen);
                font.SetDirection(strct[i - 1]);
                fonts.push(font);
            }
            StartX += 5 * barWidth;
            for (var i = 7; i < 12; i++) {
                checkSum += getValue(Text[i], i);
                var font = GetFont(Text[i], i - 1, FontBase.BlackPen, FontBase.WhitePen);
                fonts.push(font);
            }
            console.log(['checkSum', checkSum]);
            checkSum = checkSum % 10;
            fonts.push(GetFont(checkSum == 0 ? '0' : ((10 - checkSum) + ''), 11, FontBase.BlackPen, FontBase.WhitePen));
            StartX -= 8 * barWidth;

            //console.log(['StartX, StartY, barWidth, checkSum', StartX, StartY, barWidth, checkSum]);
        };
        function setStructure() {
            return {
                '0': [false, false, false, false, false, false],
                '1': [false, false, true, false, true, true],
                '2': [false, false, true, true, false, true],
                '3': [false, false, true, true, true, false],
                '4': [false, true, false, false, true, true],
                '5': [false, true, true, false, false, true],
                '6': [false, true, true, true, false, false],
                '7': [false, true, false, true, false, true],
                '8': [false, true, false, true, true, false],
                '9': [false, true, true, false, true, false]
            };
        };
        function getValue(chk, i) {
            var digit = parseInt(chk + "");
            if (i % 2 == 0) {
                return digit;
            }
            else {
                return digit * 3;
            }
        };
        function getLine(line, line1) {
            return [
                {
                    Width: line[0],
                    StartAt: line[1]
                },
                {
                    Width: line1[0],
                    StartAt: line1[1]
                }
            ]
        };
        function GetFont(latter, i, BackColor, FillColor) {
            var point = { X: StartX + i * 7 * barWidth, Y: StartY }, line = new FontBase(point, height, barWidth, BackColor, FillColor, latter);
            switch (latter) {
                case '0':
                    line.AddLines(getLine([barWidth * 2, barWidth * 3], [barWidth, barWidth * 6]))
                    return line;
                case '1':
                    line.AddLines(getLine([barWidth * 2, barWidth * 2], [barWidth, barWidth * 6]))
                    return line;
                case '2':
                    line.AddLines(getLine([barWidth, barWidth * 2], [barWidth * 2, barWidth * 5]))
                    return line;
                case '3':
                    line.AddLines(getLine([barWidth * 4, barWidth * 1], [barWidth, barWidth * 6]))
                    return line;
                case '4':
                    line.AddLines(getLine([barWidth, barWidth], [barWidth * 2, barWidth * 5]))
                    return line;
                case '5':
                    line.AddLines(getLine([barWidth * 2, barWidth], [barWidth, barWidth * 6]))
                    return line;
                case '6':
                    line.AddLines(getLine([barWidth, barWidth], [barWidth * 4, barWidth * 3]))
                    return line;
                case '7':
                    line.AddLines(getLine([barWidth * 3, barWidth], [barWidth * 2, barWidth * 5]))
                    return line;
                case '8':
                    line.AddLines(getLine([barWidth * 2, barWidth], [barWidth * 3, barWidth * 4]))
                    return line;
                case '9':
                    line.AddLines(getLine([barWidth, barWidth * 3], [barWidth * 2, barWidth * 5]))
                    return line;
            }
            return new Font0(point, height, barWidth);
        };

        function FontBase(point, height, barWidth, backColor, fillColor, latter) {
            var blackPen = '#000000', whitePen = '#FFFFFF', Lines = [];
            var Height = height, BarWidth = barWidth, Point = point, BackColor = backColor, FillColor = fillColor, IsDesc;


            this.BackColor = backColor;
            this.FillColor = fillColor;

            this.Lines = Lines;
            this.Later = latter;
            this.Point = point;
            this.FontBase = function (point, height, width, backColor, fillColor) {
                this.Point = point;
                this.Height = height;
                this.BarWidth = width;
                this.BackColor = backColor;
                this.FillColor = fillColor;
            }
            this.Draw = function (ctx) {

                if (IsDesc) {
                    DrawDesc(ctx);
                }
                else {
                    Drawing(ctx);
                }
            }
            function Drawing(ctx) {
                ctx.fillStyle = BackColor;
                ctx.fillRect(Point.X, Point.Y, BarWidth * 7, Height);
                for (var l in Lines) {
                    var line = Lines[l];
                    ctx.fillStyle = FillColor;
                    ctx.fillRect(Point.X + line.StartAt, Point.Y, line.Width, Height);
                    line.Rect = [Point.X + line.StartAt, Point.Y, line.Width, Height];
                }
            }
            function DrawDesc(ctx) {
                ctx.fillStyle = FillColor;
                ctx.fillRect(Point.X, Point.Y, BarWidth * 7, Height);
                var line;
                for (var i = Lines.length - 1; i > -1; i--) {
                    line = Lines[i];
                    ctx.fillStyle = BackColor;
                    ctx.fillRect(Point.X + 7 * BarWidth - line.StartAt - line.Width, Point.Y, line.Width, Height);
                    line.Rect1 = [Point.X + line.StartAt, Point.Y, line.Width, Height];
                }
            }
            this.SetDirection = function (IsDescending) {
                IsDesc = IsDescending;
                this.IsDesc = IsDescending;
            }
            this.AddLine = function (line) {
                Lines.push(line);
            };
            this.AddLines = function (lines) {
                this.Lines = Lines = Lines.concat(lines);
                return this;
            };
        };
        FontBase.WhitePen = '#FFFFFF';
        FontBase.BlackPen = '#000000';


        function getRandom() {
            var code = (Math.floor(Math.random() * 8999) + 1000) + '' +
                (Math.floor(Math.random() * 8999) + 1000) + '' +
                (Math.floor(Math.random() * 8999) + 1000) + '';

            var chk = code[0];
            var checkSum = parseInt(chk + ""), digit = 0;
            //console.log(['checkSum', checkSum]);
            for (var i = 1; i < 12; i++) {
                //console.log(['checkSum', checkSum]);
                checkSum += getValue(code[i], i);
            }
            //console.log(['checkSum', checkSum]);
            checkSum = checkSum % 10;
            code = code + (checkSum == 0 ? '0' : (10 - checkSum));
            return code;
        };
        function setDefaultOptions(options) {
            options = options || {};
            setNonCapitalisation(options);
            options.height = options.height || 40;
            options.width = options.width || 140;
            options.text = options.text || options.code;
            options.code = options.code || options.text;
            return options;
        };
        this.Check = function (code) {
            if (code.length != 13) {
                return false;
            }
            var chk = code[0];
            var checkSum = parseInt(chk + ""), digit = 0;
            //console.log(['checkSum', checkSum]);
            for (var i = 1; i < 12; i++) {
                //console.log(['checkSum', checkSum]);
                checkSum += getValue(code[i], i);
            }
            //console.log(['checkSum', checkSum]);
            checkSum = checkSum % 10;
            //code = code + (checkSum == 0 ? '0' : (10 - checkSum)+'');
            return code[12] === (checkSum == 0 ? '0' : (10 - checkSum) + '');
        };
        this.Get = function (options) {
            options = setDefaultOptions(options);
            var width = options.width, hgt = options.height;
            if (!options.code) {
                return getRandom();
            }
            Text = options.text;
            barWidth = (width - 4) / 95;
            StartX = (width - barWidth * 95) / 2;
            StartY = 2;
            elementWidth = barWidth * 7;
            height = hgt - 4;


            var c = document.createElement("canvas"),
                ctx = c.getContext("2d");
            c.width = width;
            c.height = hgt;
            ctx.font = "10px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = "#000000";
            SetFont();
            Draw(ctx);

            return c.toDataURL("image/png");

            //console.log(['fonts', fonts]);
            //$(document.body).append($(c));
            //$(document.body).append('<img style="position:fixed; top:100px;left:500px;" src="' + c.toDataURL("image/png") + '"/>');
        };
        this.Bind = function (options) {
            var data = that.Get(options);
            options.elm.html('<img src="' + data + '"/>');
        };
        this.Print = function (options, text) {
            if (typeof (options) === 'string') {
                options = { Code: options, text: text };
            }
            Global.Print('<img src="' + that.Get(options) + '"/>');
        };
    };
}).call(Global.Barcode = {});

var Controller = new function () {

    var service = {}, windowModel, formModel = {}, callerOptions, currentDate = new Date(),
        filter = { "field": "Id", "value": "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        filter.value = callerOptions.PatientInvestigationId;
        console.log(['model', model]);
        if (windowModel) {
            windowModel.Show();
            //console.log(['service.Prescription', service.Prescription, service.Prescription.Bind]);
            //service.Prescription.Bind();
            service.PatientInvestigation.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InvestigationArea/Templates/PrintInvestigation.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_print').click(() => service.PrintService.Print(callerOptions.List));
                windowModel.Show();
                service.PatientInvestigation.Bind();
            }, noop);
        }
    };
    (function () {
        var isBind, dataSource = {}, Id, selfServicre = {}, invgridModel;
        var dic = {};
        function setData(list) {
            dic = {};
            var datasource = [],
                group = {
                    dic: {},
                    list: []
                },
                category = {
                    dic: {},
                    list: [],
                    group: []
                };
            list.each(function () {
                if (this.Category) {
                    if (this.Group) {
                        if (group.dic[this.Group]) {
                            group.dic[this.Group].items.push(this);
                        } else {
                            group.dic[this.Group] = { items: [this], position: this.GroupPosition || 0 };
                            group.list.push(group.dic[this.Group]);
                            if (!category.dic[this.Category]) {
                                category.list.push(category.dic[this.Category] = { items: [], position: this.CategoryPosition || 0, groups: [] });

                            }
                            category.dic[this.Category].groups.push(group.dic[this.Group]);

                        }
                    } else {
                        if (category.dic[this.Category]) {
                            category.dic[this.Category].items.push(this);
                        } else {
                            category.dic[this.Category] = { items: [this], position: this.CategoryPosition || 0, groups: [] };
                            category.list.push(category.dic[this.Category]);
                        }
                    }
                } else {
                    datasource.push(this)
                }
            });
            category.list.orderBy('position');
            category.list.each(function () {
                var ctgr = this;
                this.groups.orderBy('position');
                this.groups.each(function () {
                    this.items[0].GroupHeader = this.items[0].Group || '';
                    ctgr.items = ctgr.items.concat(this.items);
                });
                this.items[0].CategoryHeader = this.items[0].Category || '';
                datasource = datasource.concat(this.items);
            });
            return datasource;
        };
        function load() {
            Global.CallServer('/InvestigationArea/PatientInvestigationList/DetailsForSetData?Id=' + callerOptions.PatientInvestigationListId, function (response) {
                console.log(response);
                if (!response.IsError) {
                    Global.Copy(formModel, response.Data[0][0], true);
                    Global.Copy(formModel, response.Data[1][0], true);
                    response.Data[2] = setData(response.Data[2]);
                    invgridModel.dataSource = response.Data[2];
                    invgridModel.Reload();
                    callerOptions.List = response.Data;
                    response.Data[0][0].Barcode = Global.Barcode.Get({ text: response.Data[0][0].Code, height: 30 });
                    response.Data[1][0].Barcode = Global.Barcode.Get({ text: response.Data[1][0].Code, height: 30 });
                    response.Data[1][0].ReportBarcode = Global.Barcode.Get({ text: response.Data[1][0].ReportNo, height: 30 });
                    console.log(['Code=>', response.Data[0][0].Barcode, response.Data[0][0].Code, response.Data[0][0].Barcode, response.Data[1][0].Code]);
                    //service.PrintService.Print(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        function onResultBound(td) {

        };
        function onRowBound(elm, tbody, b, c) {
            //var id = Global.Guid();
            //elm.addClass(id);
            var prnt = elm.parent();
            if (this.CategoryHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.8em;">' + this.CategoryHeader + '</td></tr>');
                //tr.insertBefore('.' + id);
                tbody.append(tr);
                //console.log(['tr', tr, elm, prnt, tbody, '<tr colspan="5" style="font-size:2em;">' + this.CategoryHeader + '</tr>', c]);
            }
            if (this.GroupHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.3em;">' + this.GroupHeader + '</td></tr>');
                tbody.append(tr);
                //$('<tr colspan="5" style="font-size:1.5em;">' + this.GroupHeader + '</tr>').insertBefore('.' + id);
            }
        };
        function bind() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#investigation_grid_container'),
                columns: [
                    { field: 'Name', filter: false, sorting: false },
                    { field: 'Unit', filter: false, sorting: false },
                    { field: 'Result', filter: false, sorting: false, AutoBind: false, bound: onResultBound, width: 200 },
                    { field: 'Refference', filter: false, sorting: false },
                    { field: 'Remarks', filter: false, sorting: false },
                ],
                dataSource: [],
                Printable: false,
                Responsive: false,
                selector: false,
                rowBound: onRowBound,
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Items ' },
                onComplete: function (model) {
                    invgridModel = model;
                },
            });
        };
        this.Bind = function () {
            if (!invgridModel) {
                bind();
            }
            load();
        };
    }).call(service.PatientInvestigation = {});
    (function () {
        var self = this;
        function getHeader() {
            return `<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/Content/IqraHMS/InvestigationArea/css/InvestigationPrint.css" />
    <script src="/Content/IqraService/Js/global.js"></script>
    <title>HAEMATOLOGY REPORT</title>
  </head>`;
        };
        function getPageHeader(list) {
            var patient = list[0][0], investigation = list[1][0];
            var age = patient.DateOfBirth.getDate();
            var currentDate = list[3][0].CurrentDate.getDate();
            list = list[2];

            patient.Age = new Date(currentDate.getTime() - age.getTime());
            patient.Age.setFullYear(patient.Age.getFullYear() - 1970);
            patient.Age = patient.Age.getFullYear() + ' Y ' + (patient.Age.getMonth()) + ' M ' + patient.Age.getDate() + ' D ';


            return `<div class="page-header">
      <div class="title">
        <div class="title__text">
          <p class="title__text__phone">Hotline: 911</p>
          <p class="title__text__name">Iqra Hospital Ltd, Dhaka</p>
          <p class="title__text__licence">
            Licence No: HSM45xxx6138 &nbsp; | &nbsp; Reg. Code: HSM45648xxx8
          </p>
        </div>
        <div class="title__logo">
          <img src="/Content/Img/logo.png" alt="Logo" />
        </div>
      </div>
      <div class="report">
        <div class="report__code">
          <img src="`+ (investigation.Barcode || '') + `" alt="Bar Code" />
        </div>
        <div class="report__name">
          <h1>HAEMATOLOGY REPORT</h1>
        </div>
        <div class="report__code">
          <img src="`+ (investigation.ReportBarcode || '') + `" alt="Bar Code" />
        </div>
      </div>
      <div class="invoice">
        <div>Invoice No</div>
        <div>: <span>`+ (investigation.Code || '') + `</span></div>
        <div>Invoice Date</div>
        <div>: <span>`+ (investigation.InvoiceDate.getDate().format('dd/MM/yyyy')) + `</span></div>
        <div>Delivery Date</div>
        <div>: <span>`+ (investigation.DeliveryDate.getDate().format('dd/MM/yyyy')) + `</span></div>
        <div>Report No</div>
        <div>: <span>`+ (investigation.ReportNo || '') + `</span></div>
        <div>Patient Name</div>
        <div style="grid-column: 2 / 5; text-transform: uppercase">
          : <span>`+ patient.Name + `</span>
        </div>
        <div>Age</div>
        <div>: <span>`+ patient.Age + `</span></div>
        <div>Gender</div>
        <div>: <span>`+ patient.Gender + `</span></div>
        <div>Address</div>
        <div style="grid-column: 2 / 7">:`+ (patient.CAddress || '') + ` <span></span></div>
        <div>Contact No</div>
        <div>:`+ patient.Mobile + `</div>

        <div>Reffered By</div>
        <div>: <span>`+ (investigation.Referar || '') + `</span></div>
      </div>
      <div class="test">
        <div>Sample Type</div>
        <div>: <b>WHOLE BLOOD</b></div>
        <div>LAB No</div>
        <div style="grid-column: 4 / 9">
          : <span>12202554896486</span>
        </div>
        <div>Tests</div>
        <div style="grid-column: 2 / 9">
          :
          <span>`+ (investigation.InvestigationName || '') + `</span>
        </div>
        <div>Sample Collected</div>
        <div>: <span>06/04/22 05:09PM</span></div>
        <div>Sample Received</div>
        <div>
          :
          <span
            >06/04/22 05:09PM</span
          >
        </div>
        <div>Received Time</div>
        <div>: <span>07/04/22 05:09PM </span></div>
      </div>
    </div>`;
        };
        function getPageFooter() {
            return `<div class="page-footer">
      <div class="print-info">
        <div class="print-info__personal">
          Print by & Date :: <span>namim on 17/04/2022 10:49:56 PM</span>
        </div>
        <div class="print-info__page">
          <div class="print-info__page__code">
            <img src="./assests/qr-code.png" alt="QR Code" />
          </div>
          <!-- <div>Page <span class="page-counter"></span> of 2</div> -->
        </div>
      </div>
      <address>
        House 858, Road 12, Avenue 3, Mirpur DOHS, Dhaka, Bangladesh, Phone:
        01778772327, E-mail: iqrasysinfo@gmail.com, Web: https://iqrasys.com
      </address>
    </div>`;
        };
        function printElem(list) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<!DOCTYPE html><html lang="en">' + getHeader());
            mywindow.document.write('<body>');
            mywindow.document.write(getPageHeader(list));
            mywindow.document.write(getPageFooter(list));
            //console.log(self.Data.Get(list));
            mywindow.document.write(self.Data.Get(list));
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        };
        (function () {
            function getHeader() {
                return ` <thead>
        <tr>
          <td>
            <div class="page-header-space"></div>
          </td>
        </tr>
      </thead>`;
            };
            function getpoweredBy(patient) {
                return `<div class="power">
                <div>B566522</div>
                <div>Powered by: iqrasys.com</div>
                <div class="power__bar-code">
                  HN:
                  <div><img src="`+ (patient.Barcode || '') + `" alt="" /></div>
                </div>
              </div>`;
            };
            function getColumnHeader() {
                return `<div class="result__header result--grid">
                  <div>Test</div>
                  <div>Unit</div>
                  <div>Result</div>
                  <div>Reference Value</div>
                </div>`;
            };
            function getResult(list) {
                var result = '';
                list.each(function () {
                    if (this.CategoryHeader) {
                        result += '<div class="result__section">' + this.CategoryHeader + '</div>'
                    }
                    if (this.GroupHeader) {
                        result += '<div class="result__section--su">' + this.GroupHeader + '</div>'
                    }
                    result += `<div class="result__row result--grid">
                  <div>`+ this.Name + `</div>
                  <div>`+ this.Unit + `</div>
                  <div>`+ this.Result + `</div>
                  <div>`+ this.Refference + `</div>
                  </div>`;
                });
                console.log(['result', result]);
                return result;
            };
            function getSignatories() {
                return `<div class="signatories">
                <div>
                  <p><b>Mst. Shamsunnahar</b></p>
                  <p>Medical Technologist</p>
                  <p>Automation Lab</p>
                </div>
                <div>
                  <p><b>DR. Taskia Sultana Zaman</b></p>
                  <p>MBBS(DMC), PhD(Japan)</p>
                  <p>Jr.Consultant(Immunology)</p>
                  <p>Iqra Hospital Ltd</p>
                </div>
              </div>`;
            };
            function getEndReport() {
                return `
              <div class="end-report">
                <div class="end-report__label">
                  -------------------------------------------------- End of
                  Report --------------------------------------------------
                </div>
                <div class="end-report__instructions">
                  <h4>IMPORTANT INSTRUCTIONS</h4>
                  <p>
                    *The test results should only be interpreted by qualified
                    and registered medical practitioners.*The laboratory test
                    results should be clinically correlated by the referring
                    physician *The reported results depend on the quality of the
                    samples and sensitivity/specificity of the test methods.*1n
                    case of grossly abnormal test results, the lab may perform
                    repeat test from the same/fresh sample at its own or on the
                    basis of clinicians/Clients request within 2 days post
                    reporting.*Inter-laboratory variations may be found in test
                    results, and Iqra Hospital Limited (Diagnostics) shall not
                    incur any liability due to such variance.*This test report
                    is not valid for medico-legal purpose.*Iqra Hospital Limited
                    (Diagnostics)and its staff will not take any responsibility
                    or liability for any loss or injury resulting from
                    incomplete or erroneous interpretation of the test results
                    contained herein *Due to unexpected circumstances. the
                    report delivery may rarely be delayed.*Partial reproduction
                    of this test report is not allowed.
                  </p>
                </div>
              </div>`;
            };
            function getTableFooter() {

                return `      <tfoot>
        <tr>
          <td>
            <!--place holder for the fixed-position footer-->
            <div class="page-footer-space"></div>
          </td>
        </tr>
      </tfoot>`;
            };
            this.Get = function (list) {
                var tbl = '<table class="">' + getHeader();
                tbl += '<tbody><tr><td><div class="page">' + getpoweredBy(list[0][0]);
                tbl += '<div class="result">' + getColumnHeader();
                tbl += getResult(list[2]);
                tbl += '</div>';
                tbl += getSignatories();
                tbl += getEndReport();
                tbl += '</div></td></tr></tbody>';
                tbl += getTableFooter();
                tbl += '</table>';
                //console.log(tbl);
                return tbl;
            };
        }).call(self.Data = {});
        this.Print = function (list) {
            printElem(list);
        }
    }).call(service.PrintService = {});
};