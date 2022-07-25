

//var Ean13 = new function () {
//    var Structure = setStructure(), img, elementWidth = 1, barWidth = 1, height = 1, fonts = [];
//    var Text = '', StartX = 0, StartY = 0, ctx;
//    this.Get = function (text, width, hgt) {
//        Text = getRandom();
//        console.log(Text);
//        barWidth = (width - 4) / 95;
//        StartX = (width - barWidth * 95) / 2;
//        StartY = 2;
//        elementWidth = barWidth * 7;
//        height = hgt - 4;


//        var c = document.createElement("canvas"),
//        ctx = c.getContext("2d");
//        c.width = width;
//        c.height = hgt;
//        ctx.font = "10px Arial";
//        ctx.fillStyle = "#FFFFFF";
//        ctx.fillRect(0, 0, c.width, c.height);
//        ctx.fillStyle = "#000000";
//        SetFont();
//        Draw(ctx);
//        //console.log(['fonts', fonts]);
//        //$(document.body).append($(c));
//        $(document.body).append('<img style="position:fixed; top:100px;left:500px;" src="' + c.toDataURL("image/png") + '"/>');
//    };
    
//    function getRandom() {
//        var code = (Math.floor(Math.random() * 8999) + 1000) + '' +
//                 (Math.floor(Math.random() * 8999) + 1000) + '' +
//                 (Math.floor(Math.random() * 8999) + 1000)+'';

//        var chk = code[0];
//        var checkSum = parseInt(chk + ""), digit = 0;
//        console.log(['checkSum', checkSum]);
//        for (var i = 1; i < 12; i++) {
//            console.log(['checkSum', checkSum]);
//            checkSum += getValue(code[i], i);
//        }
//        console.log(['checkSum', checkSum]);
//        checkSum = checkSum % 10;
//        code = code + (checkSum == 0 ? '0' : (10 - checkSum));
//        return code;
//    };
//    function Draw(ctx) {
//        var x = StartX;
//        //console.log(['x, StartY, barWidth, height', x, StartY, barWidth, height]);
//        ctx.fillRect(x, StartY, barWidth, height);
//        x += barWidth * 2;
//        ctx.fillRect(x, StartY, barWidth, height);
//        x = fonts[5].Point.X + barWidth * 8;
//        ctx.fillRect( x, StartY, barWidth, height);
//        x += barWidth * 2;
//        ctx.fillRect(x, StartY, barWidth, height);
//        x = fonts[11].Point.X + barWidth * 7;
//        ctx.fillRect(x, StartY, barWidth, height);
//        x += barWidth * 2;
//        ctx.fillRect(x, StartY, barWidth, height);

//        fonts.each(function () {
//            this.Draw(ctx);
//        });
//    };
//    function SetFont() {
//        var chk = Text[0];
//        var strct = Structure[chk];
//        var checkSum = parseInt(chk + ""), digit = 0;
//        fonts = [];
//        StartX += 3 * barWidth;
//        for (var i = 1; i < 7; i++) {
//            checkSum += getValue(Text[i], i);
//            var font = GetFont(Text[i], i - 1, FontBase.WhitePen, FontBase.BlackPen);
//            font.SetDirection(strct[i - 1]);
//            fonts.push(font);
//        }
//        StartX += 5 * barWidth;
//        for (var i = 7; i < 12; i++) {
//            checkSum += getValue(Text[i], i);
//            var font = GetFont(Text[i], i - 1, FontBase.BlackPen, FontBase.WhitePen);
//            fonts.push(font);
//        }
//        console.log(['checkSum', checkSum]);
//        checkSum = checkSum % 10;
//        fonts.push(GetFont(checkSum == 0 ? '0' : ((10 - checkSum) + ''), 11, FontBase.BlackPen, FontBase.WhitePen));
//        StartX -= 8 * barWidth;

//        //console.log(['StartX, StartY, barWidth, checkSum', StartX, StartY, barWidth, checkSum]);
//    };
//    function setStructure() {
//        return {
//            '0': [false, false, false, false, false, false],
//            '1': [false, false, true, false, true, true],
//            '2': [false, false, true, true, false, true],
//            '3': [false, false, true, true, true, false],
//            '4': [false, true, false, false, true, true],
//            '5': [false, true, true, false, false, true],
//            '6': [false, true, true, true, false, false],
//            '7': [false, true, false, true, false, true],
//            '8': [false, true, false, true, true, false],
//            '9': [false, true, true, false, true, false]
//        };
//    };
//    function getValue(chk, i) {
//        var digit = parseInt(chk + "");
//        if (i % 2 == 0) {
//            return digit;
//        }
//        else {
//            return digit * 3;
//        }
//    };
//    function getLine(line,line1) {
//        return [
//            {
//                Width:line[0],
//                StartAt: line[1]
//            },
//            {
//                Width: line1[0],
//                StartAt: line1[1]
//            }
//        ]
//    };
//    function GetFont(latter, i, BackColor, FillColor) {
//        var point = { X: StartX + i * 7 * barWidth, Y: StartY }, line = new FontBase(point, height, barWidth, BackColor, FillColor, latter);
//        switch (latter) {
//            case '0':
//                line.AddLines(getLine([barWidth * 2, barWidth * 3], [barWidth, barWidth * 6]))
//                return line;
//            case '1':
//                line.AddLines(getLine([barWidth * 2, barWidth * 2], [barWidth, barWidth * 6]))
//                return line;
//            case '2':
//                line.AddLines(getLine([barWidth, barWidth * 2], [barWidth * 2, barWidth * 5]))
//                return line;
//            case '3':
//                line.AddLines(getLine([barWidth * 4, barWidth * 1], [barWidth, barWidth * 6]))
//                return line;
//            case '4':
//                line.AddLines(getLine([barWidth, barWidth], [barWidth * 2, barWidth * 5]))
//                return line;
//            case '5':
//                line.AddLines(getLine([barWidth * 2, barWidth], [barWidth, barWidth * 6]))
//                return line;
//            case '6':
//                line.AddLines(getLine([barWidth, barWidth], [barWidth * 4, barWidth * 3]))
//                return line;
//            case '7':
//                line.AddLines(getLine([barWidth * 3, barWidth], [barWidth * 2, barWidth * 5]))
//                return line;
//            case '8':
//                line.AddLines(getLine([barWidth * 2, barWidth], [barWidth * 3, barWidth * 4]))
//                return line;
//            case '9':
//                line.AddLines(getLine([barWidth, barWidth * 3], [barWidth * 2, barWidth * 5]))
//                return line;
//        }
//        return new Font0(point, height, barWidth);
//    };

//    function FontBase(point, height, barWidth, backColor, fillColor, latter) {
//        var blackPen = '#000000', whitePen = '#FFFFFF', Lines = [];
//        var Height = height, BarWidth = barWidth, Point = point, BackColor = backColor, FillColor = fillColor, IsDesc;


//        this.BackColor = backColor;
//        this.FillColor = fillColor;

//        this.Lines = Lines;
//        this.Later = latter;
//        this.Point = point;
//        this.FontBase = function (point, height, width, backColor, fillColor) {
//            this.Point = point;
//            this.Height = height;
//            this.BarWidth = width;
//            this.BackColor = backColor;
//            this.FillColor = fillColor;
//        }
//        this.Draw = function (ctx) {

//            if (IsDesc) {
//                DrawDesc(ctx);
//            }
//            else {
//                Drawing(ctx);
//            }
//        }
//        function Drawing(ctx) {
//            ctx.fillStyle = BackColor;
//            ctx.fillRect(Point.X, Point.Y, BarWidth * 7, Height);
//            for (var l in Lines) {
//                var line = Lines[l];
//                ctx.fillStyle = FillColor;
//                ctx.fillRect(Point.X + line.StartAt, Point.Y, line.Width, Height);
//                line.Rect = [Point.X + line.StartAt, Point.Y, line.Width, Height];
//            }
//        }
//        function DrawDesc(ctx) {
//            ctx.fillStyle = FillColor;
//            ctx.fillRect(Point.X, Point.Y, BarWidth * 7, Height);
//            var line;
//            for (var i = Lines.length - 1; i > -1 ; i--) {
//                line = Lines[i];
//                ctx.fillStyle = BackColor;
//                ctx.fillRect(Point.X + 7 * BarWidth - line.StartAt - line.Width, Point.Y, line.Width, Height);
//                line.Rect1 = [Point.X + line.StartAt, Point.Y, line.Width, Height];
//            }
//        }
//        this.SetDirection = function (IsDescending) {
//            IsDesc = IsDescending;
//            this.IsDesc = IsDescending;
//        }
//        this.AddLine = function (line) {
//            Lines.push(line);
//        };
//        this.AddLines = function (lines) {
//            this.Lines = Lines = Lines.concat(lines);
//            return this;
//        };
//    };
//    FontBase.WhitePen = '#FFFFFF';
//    FontBase.BlackPen = '#000000';
//};


var Ean13 = new function () {
    var Structure = setStructure(), img, elementWidth = 1, barWidth = 1, height = 1, fonts = [];
    var Text = '', StartX = 0, StartY = 0, ctx;
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
            for (var i = Lines.length - 1; i > -1 ; i--) {
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

        //return c.toDataURL("image/png");

        console.log(['fonts', fonts]);
        //$(document.body).append($(c));
        $(document.body).append('<img style="position:fixed; top:100px;left:500px;" src="' + c.toDataURL("image/png") + '"/>');
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


var code=Ean13.Get();
Ean13.Get({ code: '6298996158568', width: 400, height: 70 });
console.log([code, Ean13.Check('6298996158568')]);