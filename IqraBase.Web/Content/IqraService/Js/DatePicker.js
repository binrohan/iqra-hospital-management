DatePicker = new function () {
    var that = this, isActiveVisible;
    var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthsValues = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5, 'july': 6, 'augost': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, '11': 10, '12': 11,
        '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5, '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
        '': 0,
        '0': 0
    };
    function getDefaultOption(options) {
        options = options || {};
        var option = {};
        for (var key in options) { option[key.toLowerCase()] = options[key]; }
        option.max = new Date(2200, 0, 1);
        var model = {
            value: option.value || null,
            format: option.format || 'MM/dd/yyyy',
            defaultView: option.defaultView || 'day',
            max: option.max || null,
            min: option.min || null,
            onchange: option.onchange,
            onselect: option.onselect,
            formModel: {},
            formInputs: {},
            ondateselect: option.ondateselect,
            onviewcreated: option.onviewcreated
        };

        model.shortTime = new RegExp("hh").test(model.format);
        model.time = new RegExp("hh|HH|mm").test(model.format);
        model.date = new RegExp("dd").test(model.format);
        model.month = new RegExp("MM|mmm|mmmm").test(model.format);
        model.year = new RegExp("yyyy").test(model.format);
        return model;
    };
    function preentEent(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    function stopPropagationEent(e) {
        isActiveVisible = true;
        setTimeout(function () { isActiveVisible = false; }, 150);
        e.stopPropagation();
    };
    var validation = new function () {
        function getKey(key) {
            switch (key) {
                case "mmmm":
                case "mmm":
                    key = "MM";
                    break;
            }
            return key;
        };
        function checkForValue(obj) {
            if (!(obj.MM = monthsValues[obj.MM.toLowerCase()]) && obj.MM != 0) {
                return false;
            }
            for (var key in obj) {
                if (!/^\d+$/.test(obj[key] + ''))
                    return false;
                obj[key] = parseInt(obj[key] + '', 10);
            }

            var flag = !(obj.yyyy % 4) && obj.MM == 1 ? 1 : 0;
            if (obj.dd < 1 || obj.dd > (maxDays[obj.MM] + flag)) {
                return false;
            } else if (obj.yyyy < 0) {
                return false;
            }
            return true;
        };
        this.IsValid = function (model) {
            var dateModel = {}, startPosition = 0;
            this.value = this.value.trim();
        };
    };
    function onSetElmValue(model, currentView, noChange) {
        var text = model.currentaVlue.format(model.format);
        model.elm.val(text);
        model.value = model.currentaVlue;
        model.onselect && model.onselect(model.currentaVlue, model);
        model.onchange && model.text != text && model.onchange(model.currentaVlue, model, true);
        model.text = text;
        if (noChange) {
            return;
        }
        if (currentView == 0 && model.time) {
            that.TimePicker.Fire(model, true);
        } else if (currentView == 1) {
            that.TimePicker.Fire(model);
        } else {
            hide(model, true);
        }
    };
    var objectModel = new function () {
        function getNewDate(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); };
        function getDateTime(date) { return getNewDate(date).getTime(); };
        this.SetDateView = function (model) {
            var endDate = getNewDate(model.DateModel.Date);
            var today = getDateTime(new Date()),
                selectedDate = model.value ? getDateTime(model.value) : 0;
            endDate.setDate(1);
            model.DateModel.Date = new Date(endDate);
            var startDate = new Date(endDate);
            model.DateModel.Month = endDate.getMonth()
            startDate.setDate(1 - startDate.getDay());
            endDate.setMonth(model.DateModel.Month + 1);
            endDate.setDate(0);
            endDate.setDate(endDate.getDate() + 6 - endDate.getDay());
            model.DateModel.tbody.empty();
            var tr = $('<tr>');
            for (; startDate <= endDate;) {
                var cls = startDate.getMonth() > model.DateModel.Month ? 'day new' : startDate.getMonth() < model.DateModel.Month ? 'day old' : 'day',
                    time = startDate.getTime();
                (time == selectedDate) && (cls += ' selected');
                (time == today) && (cls += ' today');
                (model.max < time) && (cls = 'disabled');
                var date = startDate.getDate();
                tr.append($('<td class="' + cls + '">' + date + '</td>').click(function (e) { objectModel.SelectDate.call($(this), model,false, e); }).data('date', new Date(startDate)));
                if (startDate.getDay() == 6) {
                    model.DateModel.tbody.append(tr);
                    tr = $('<tr>');
                }
                startDate.setDate(date + 1);
            }
            model.DateModel.title.html(monthName[model.DateModel.Month] + ' ' + model.DateModel.Date.getFullYear());
            model.DateModel.tbody.append(tr);
        };
        this.SetMonthView = function (model) {
            model.MonthModel.title.html(model.MonthModel.Date.getFullYear());
            var date = new Date(model.MonthModel.Date.getFullYear() + 1, -1);
            var td = model.MonthModel.tbody.find('td').removeClass('disabled');
            if (date.getTime() > model.max) {

                var i = new Date(model.max).getMonth() + 1;
                for (; i < 12; i++) {
                    $(td[i]).addClass('disabled');
                }
            }
        };
        this.SetYearView = function (model) {
            var startYear = model.YearModel.Date.getFullYear() - 6, endYear = startYear + 12;
            model.YearModel.title.html(startYear + ' - ' + (endYear - 1));
            model.YearModel.tbody.empty();
            var tr = $('<tr>');
            for (var i = 1; startYear < endYear; startYear++, i++) {
                var date = new Date(startYear, 0);
                var cls = date.getTime() > model.max ? 'class="disabled"' : '';
                tr.append($('<td ' + cls + '>' + startYear + '</td>').click(function () { objectModel.SelectYear.call($(this), model); }).data('year', startYear));
                if (!(i % 3)) {
                    model.YearModel.tbody.append(tr);
                    tr = $('<tr>');
                }
            }
            model.YearModel.tbody.append(tr);
        };
        this.SetYear = function (model) {

        };
        this.SelectDate = function (model,date,e) {
            var date = date || this.data('date'), text = model.text;
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.tbody.find('.selected').removeClass('selected');
            this.addClass && this.addClass('selected');
            date.setHours(model.currentaVlue.getHours());
            date.setMinutes(model.currentaVlue.getMinutes());
            model.currentaVlue = date;
            //model.elm.val(date.format(model.format));
            model.text = model.elm.val();
            model.DateModel.Date.setDate(date.getDate());
            if (date.getMonth() != model.DateModel.Month) {
                model.DateModel.Date.setMonth(date.getMonth());
                model.DateModel.Date.setFullYear(date.getFullYear());
                objectModel.SetDateView(model);
                setPosition(model);
            }
            (!model.ondateselect || model.ondateselect(date, e, model)) && onSetElmValue(model, 0);
        };
        this.SelectMonth = function (model) {
            var date = new Date(model.MonthModel.Date);
            date.setMonth(this.dataset.value);
            date.setDate(1);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date = model.MonthModel.Date;
            model.DateModel.Date.setMonth(this.dataset.value);
            if (model.date) {
                objectModel.SwitchToDateView(model);
            } else {
                model.currentaVlue = model.DateModel.Date;
                onSetElmValue(model, 0);
            }
        };
        this.SelectYear = function (model) {
            var date = new Date(this.data('year'), 0);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date = model.YearModel.Date;
            model.DateModel.Date.setFullYear(this.data('year'));
            objectModel.SwitchToMonthView(model);
        };
        this.NextMonth = function (model) {
            var date = new Date(model.DateModel.Date);
            date.setMonth(date.getMonth() + 1);
            if (date.getTime() > model.max) {
                return;
            }
            model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() + 1); objectModel.SetDateView(model);
            setPosition(model);
        };
        this.PrevMonth = function (model) {
            model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() - 1); objectModel.SetDateView(model);
            setPosition(model);
        };
        this.NextYear = function (model) {
            var date = new Date(model.MonthModel.Date.getFullYear() + 1, 0);
            if (date.getTime() > model.max) {
                return;
            }
            model.MonthModel.Date.setFullYear(model.MonthModel.Date.getFullYear() + 1); objectModel.SetMonthView(model);
            setPosition(model);
        };
        this.PrevYear = function (model) {
            model.MonthModel.Date.setFullYear(model.MonthModel.Date.getFullYear() - 1); objectModel.SetMonthView(model);
            setPosition(model);
        };
        this.NextYearRange = function (model) {
            var date = new Date(model.YearModel.Date.getFullYear() + 12, 0);
            if (date.getTime() > model.max) {
                return;
            }
            model.YearModel.Date.setFullYear(model.YearModel.Date.getFullYear() + 12); objectModel.SetYearView(model);
            setPosition(model);
        };
        this.PrevYearRange = function (model) {
            model.YearModel.Date.setFullYear(model.YearModel.Date.getFullYear() - 12); objectModel.SetYearView(model);
            setPosition(model);
        };
        this.SwitchToDateView = function (model) {
            model.DateModel.template.show();
            model.MonthModel.template.hide();
            objectModel.SetDateView(model);
            setPosition(model);
        };
        this.SwitchToMonthView = function (model) {
            if (!model.MonthModel) {
                model.template.append(template.GetMonthTemplate(model));
            }
            model.DateModel.template.hide();
            model.YearModel && model.YearModel.template.hide();
            model.MonthModel.template.show();
            model.MonthModel.Date = new Date(model.DateModel.Date);
            objectModel.SetMonthView(model);
            setPosition(model);
        };
        this.SwitchToYearView = function (model) {
            if (!model.YearModel) {
                model.template.append(template.GetYearTemplate(model));
            }
            model.DateModel.template.hide();
            model.MonthModel.template.hide();
            model.YearModel.template.show();
            model.YearModel.Date = new Date(model.DateModel.Date);
            objectModel.SetYearView(model);
            setPosition(model);
        };
    };
    var template = new function () {
        var that = this;
        this.GetDateTemplate = function (model, template) {
            if (!template) {
                template = $('<div class="datepicker-days" style="display: block;"></div>');
                template.append(drpTemplate.Get(model));
            }
            template.append('<table class="table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch" colspan="5">February 2015</th><th class="next" style="visibility: visible;">»</th></tr>' +
                '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody></tbody></table>');

            var thead = template.find('thead');
            model.DateModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() };
            thead.find('.prev').click(function () { objectModel.PrevMonth(model) });
            thead.find('.datepicker-switch').click(function () { objectModel.SwitchToMonthView(model) });
            thead.find('.next').click(function () { objectModel.NextMonth(model); });
            return template;
        };
        this.GetMonthTemplate = function (model) {
            var template = $('<div class="datepicker-months" style="display: none;"><table class="table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>' +
            '<tbody><tr><td data-value="0">Jan</td><td data-value="1">Feb</td><td data-value="2">Mar</td></tr><tr><td data-value="3">Apr</td><td data-value="4">May</td><td data-value="5">Jun</td></tr><tr><td data-value="6">Jul</td><td data-value="7">Aug</td><td data-value="8">Sep</td></tr><tr><td data-value="9">Oct</td><td data-value="10">Nov</td><td data-value="11">Dec</td></tr></tbody></table></div>');
            var thead = template.find('thead');
            model.MonthModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
            thead.find('.prev').click(function () { objectModel.PrevYear(model) });
            thead.find('.datepicker-switch').click(function () { objectModel.SwitchToYearView(model) });
            thead.find('.next').click(function () { objectModel.NextYear(model); });
            model.MonthModel.tbody.find('td').click(function () {
                objectModel.SelectMonth.call(this, model);
            });
            objectModel.SetMonthView(model);
            return template;
        };
        this.GetYearTemplate = function (model) {
            var template = $('<div class="datepicker-months" style="display: none;"><table class="table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>' +
            '<tbody></tbody></table></div>');
            var thead = template.find('thead');
            model.YearModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: new Date(model.DateModel.Date) }
            thead.find('.prev').click(function () { objectModel.PrevYearRange(model) });
            thead.find('.next').click(function () { objectModel.NextYearRange(model); });
            objectModel.SetYearView(model);

            return template;
        };
    };
    var drpTemplate = new function () {
        var selectionStart = 0, strObj = {Date:'',Month:'',Year:''};
        function getTmpl(title, onchange, model, left,right) {
            var padding =' style="padding-left:' + left + 'px; padding-right:' + right + 'px;"';
            var tmpl = $('<section class="col-sm-4 col col-md-4" ' + padding + '>' +
                '<div>'+
                    '<label for="' + title + '">' + title + '</label>' +
                '</div>'+
                '<div class="input-group">'+
                    '<input  style="padding-left:2px; padding-top:1px; padding-right:2px; padding-bottom:1px;height: 25px;" data-type="int|null" data-binding="' + title + '" class="form-control" type="text">' +
                '</div>'+
            '</section>');
            var input = tmpl.find('input').keydown(function () {
                selectionStart = this.selectionStart;
            }).keyup(function (e) {
                if ((e.keyCode == 13 || e.which == 13)) {
                    onSelect(model);
                } else {
                    onchange(model, e);
                }

            }).blur(function () {
                    setTimeout(function () {
                        if (!isActiveVisible) hide(model);
                    }, 130);
            });
            tmpl.click(function () {
                input.focus();
            });
            return tmpl;
        };
        function onSelect(model) {
            var mDay;
            if (model.formInputs.Date.value) {
                mDay = parseInt(model.formInputs.Date.value || '1');
                model.DateModel.Date.setDate(mDay);
            }
            if (model.formInputs.Month.value) {
                mDay = monthsValues[model.formInputs.Month.value];
                if (mDay > -1 && mDay < 12) {
                    model.DateModel.Date.setMonth(mDay);
                }
            }
            if (model.formInputs.Year.value) {
                var mDay = parseInt(model.formInputs.Year.value || '1');
                model.DateModel.Date.setFullYear(mDay);
            }
            objectModel.SelectDate(model, model.DateModel.Date);
        };
        function onDateChange(model, e) {
            if ((e.keyCode == 39 || e.which == 39) && selectionStart == (model.formInputs.Date.value || '').length) {
                $(model.formInputs.Month).focus();
                stopPropagationEent(e);
            } else if (strObj.Date != model.formInputs.Date.value) {
                var mDay = maxDays[monthsValues[model.formInputs.Month.value]];
                //console.log(['model.formInputs.Date.value', parseInt(model.formInputs.Date.value || '0') > mDay, parseInt(model.formInputs.Date.value || '0') , mDay]);
                if (parseInt(model.formInputs.Date.value || '0') > mDay) {
                    model.formInputs.Date.value = mDay;
                } else if (model.formInputs.Date.value != '' && parseInt(model.formInputs.Date.value || '0') < 1) {
                    model.formInputs.Date.value = 1;
                }
                mDay = parseInt(model.formInputs.Date.value || '1');
                model.DateModel.Date.setDate(mDay);
                objectModel.SetDateView(model);
                strObj.Date = model.formInputs.Date.value;
            }
            //ctl.selectionStart
        };
        function onMonthChange(model, e) {
            if ((e.keyCode == 39 || e.which == 39) && selectionStart == (model.formInputs.Month.value || '').length) {
                $(model.formInputs.Year).focus();
                stopPropagationEent(e);
            } else if ((e.keyCode == 37 || e.which == 37) && selectionStart == 0) {
                $(model.formInputs.Date).focus();
                stopPropagationEent(e);
            } else if (strObj.Month != model.formInputs.Month.value) {
                if (parseInt(model.formInputs.Month.value || '0') > 12) {
                    model.formInputs.Month.value = 12;
                } else if (model.formInputs.Month.value != '' && parseInt(model.formInputs.Month.value || '0') < 1) {
                    model.formInputs.Month.value = 1;
                }
                mDay = monthsValues[model.formInputs.Month.value];
                if (mDay > -1 && mDay < 12) {
                    model.DateModel.Date.setMonth(mDay);
                    objectModel.SetDateView(model);
                }
                strObj.Month = model.formInputs.Month.value;
            }
        };
        function onYearChange(model, e) {
            if ((e.keyCode == 37 || e.which == 37) && selectionStart == 0) {
                $(model.formInputs.Month).focus();
                stopPropagationEent(e);
            } else if (strObj.Year != model.formInputs.Year.value) {
                var mDay = parseInt(model.formInputs.Year.value || '1');
                model.DateModel.Date.setFullYear(mDay);
                objectModel.SetDateView(model);
                strObj.Year = model.formInputs.Year.value;
            }
        };
        this.Get = function (model) {
            var tmpl = $('<div class="row" style="width: 220px;">');
            tmpl.append(getTmpl('Date', onDateChange, model,5,0));
            tmpl.append(getTmpl('Month', onMonthChange, model,5,5));
            tmpl.append(getTmpl('Year', onYearChange, model, 0, 5));
            model.formInputs = Global.Form.Bind(model.formModel, tmpl);
            tmpl.click(stopPropagationEent).mousedown(stopPropagationEent).mouseup(stopPropagationEent);
            return tmpl;
        };
        this.Populate = function (model,date) {
            model.formModel.Date = date.getDate();
            model.formModel.Month = date.getMonth() + 1;
            model.formModel.Year = date.getFullYear();
        };
    };
    function getTemplate(model) {
        var tmp = $('<div class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom">').append(template.GetDateTemplate(model));
        model.ClockTmpl = $('<div style="width: 250px; display: block;">');
        model.template = tmp;
        objectModel.SetDateView(model);
        tmp.append(model.ClockTmpl);
        model.ClockTmpl.click(preentEent).mousedown(preentEent).mouseup(preentEent);
        model.onviewcreated && model.onviewcreated(model);
        return tmp;
    };
    function set(model) {
        var timeOutEvent;
        model.elm.focus(model.open).click(model.open).blur(function () { setTimeout(function () { if (!isActiveVisible) hide(model);}, 130); });
        model.max = model.max ? model.max.getTime() : Math.max;
        model.min = model.min ? model.min.getTime() : Math.min;
        $(document.body).append(getTemplate(model));
        model.currentView = 0;
        model.template.mousedown(function () {
            isActiveVisible = true;
            timeOutEvent && clearTimeout(timeOutEvent);
            timeOutEvent = setTimeout(function () { isActiveVisible = false; }, 150);
        }).mouseup(function () { model.elm.focus(); });
        if (model.elm[0].dataset.onselect && !model.onselect) {
            model.onselect = Global.GetObject(model.elm[0].dataset.onselect);
        }
        if (model.elm[0].dataset.onchange && !model.onchange) {
            model.onchange = Global.GetObject(model.elm[0].dataset.onchange);
        }
    };
    function setPosition(model) {
        var h = model.template.height(), offset = model.elm.offset();
        offset.top = offset.top - h - 15;
        if (offset.top < 0) {
            model.template.removeClass('datepicker-orient-bottom').addClass('datepicker-orient-top');
            offset = model.elm.offset();
            offset.top = offset.top + model.elm.height() + 15;
        } else {
            model.template.removeClass('datepicker-orient-top').addClass('datepicker-orient-bottom');
        }
        model.template.css(offset)
    };
    function checkForValue(model) {
        if (model.elm.val() != model.text) {
            var date = model.currentaVlue = Global.DateTime.GetObject(model.elm.val(), model.format);
            if (date && !isNaN(date)) {
                model.DateModel.Date = model.value = model.currentaVlue = date;
                model.DateModel.Date.setMonth(date.getMonth());
            } else {
                model.value = null;
                model.elm.val('')
                model.currentaVlue = new Date();
            }
            objectModel.SetDateView(model);
            model.text = model.elm.val();
            return true;
        }
    };
    function show(model) {
        console.log(['show(model)', model]);
        model.template.show();
        checkForValue(model);
        model.currentView = 0;
        if (!model.time && !model.date && model.month) {
            objectModel.SwitchToMonthView(model)
        } else if (model.date) {
            model.ClockTmpl.hide();
            model.DateModel.template && model.DateModel.template.show();
        } else {
            model.currentView = 1;
            that.TimePicker.Fire(model, true);
        }
        setPosition(model);
        drpTemplate.Populate(model, model.currentaVlue);
    };
    function hide(model, isFromSelect) {
        checkForValue(model) && model.onchange && model.onchange(model.value, model, isFromSelect);
        model.template.hide().offset({ top: '100%', left: '100%' });
    };
    (function () {
        this.Fire = function (model, isHour) {
            model.currentView = 0;
            model.ClockTmpl.show();
            model.DateModel.template && model.DateModel.template.hide();
            isHour ? initHours(model) : initMinutes(model);
        };
        this.Show = function (model) {
            //model.template.removeClass('hidden');
            //this.$element.trigger('open');
        };
        this.Hide = function (model) {
            //$(window).off('keydown', null, null, this._onKeydown.bind(this));
            //model.template.addClass('hidden');
            //this.$element.trigger('close');
        };
        function initMeridienButtons(model) {
            Global.Click(model.template.find('a.am'), _onSelectAM, model);
            Global.Click(model.template.find('a.pm'), _onSelectPM, model);
        };
        function initHours(model) {
            model.currentView = 1;
            showTime(model, model.currentaVlue);

            var hFormat = ((model.shortTime) ? 12 : 24);
            var svgClockElement = createSVGClock(model, true);

            for (var i = 0; i < 12; i++) {
                var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 12))));
                var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 12))));

                var fill = (((model.currentaVlue.getHours()) == i) ? "#8BC34A" : 'transparent');
                var color = (((model.currentaVlue.getHours()) == i) ? "#fff" : '#000');

                var svgHourCircle = createSVGElement(model, "circle", { 'id': 'h-' + i, 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': i });

                var svgHourText = createSVGElement(model, "text", { 'id': 'th-' + i, 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-hour': i });
                svgHourText.textContent = ((i === 0) ? ((model.shortTime) ? 12 : i) : i);

                if (!toggleTime(model, i, true)) {
                    svgHourCircle.className += " disabled";
                    svgHourText.className += " disabled";
                    svgHourText.setAttribute('fill', '#bdbdbd');
                } else {
                    svgHourCircle.addEventListener('click', _onSelectHour.bind(model));
                    svgHourText.addEventListener('click', _onSelectHour.bind(model));
                }

                svgClockElement.appendChild(svgHourCircle)
                svgClockElement.appendChild(svgHourText)
            }

            if (!model.shortTime) {
                model.ClockTmpl.find('#am_pm').remove();
                for (var i = 0; i < 12; i++) {
                    var x = -(110 * (Math.sin(-Math.PI * 2 * (i / 12))));
                    var y = -(110 * (Math.cos(-Math.PI * 2 * (i / 12))));

                    var fill = ((model.currentaVlue.getHours() == (i + 12)) ? "#8BC34A" : 'transparent');
                    var color = ((model.currentaVlue.getHours() == (i + 12)) ? "#fff" : '#000');

                    var svgHourCircle = createSVGElement(model, "circle", { 'id': 'h-' + (i + 12), 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': (i + 12) });

                    var svgHourText = createSVGElement(model, "text", { 'id': 'th-' + (i + 12), 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '22', x: x, y: y + 7, fill: color, 'data-hour': (i + 12) });
                    svgHourText.textContent = i + 12;

                    if (!toggleTime(model, i + 12, true)) {
                        svgHourCircle.className += " disabled";
                        svgHourText.className += " disabled";
                        svgHourText.setAttribute('fill', '#bdbdbd');
                    } else {
                        svgHourCircle.addEventListener('click', _onSelectHour.bind(model));
                        svgHourText.addEventListener('click', _onSelectHour.bind(model));
                    }

                    svgClockElement.appendChild(svgHourCircle)
                    svgClockElement.appendChild(svgHourText)
                }
            }


            initMeridienButtons(model);
            if (model.currentaVlue.getHours() < 12) {
                model.template.find('a.am').click();
            } else {
                model.template.find('a.pm').click();
            }

            _centerBox(model);
        };
        function initMinutes(model) {
            model.currentView = 2;

            showTime(model, model.currentaVlue);

            initMeridienButtons(model);

            if (model.currentaVlue.getHours() < 12) {
                model.template.find('a.dtp-meridien-am').click();
            } else {
                model.template.find('a.dtp-meridien-pm').click();
            }

            var svgClockElement = createSVGClock(model, false);

            for (var i = 0; i < 60; i++) {
                var s = ((i % 5 === 0) ? 162 : 158);
                var r = ((i % 5 === 0) ? 30 : 20);

                var x = -(s * (Math.sin(-Math.PI * 2 * (i / 60))));
                var y = -(s * (Math.cos(-Math.PI * 2 * (i / 60))));

                var color = ((model.currentaVlue.format("m") == i) ? "#8BC34A" : 'transparent');

                var svgMinuteCircle = createSVGElement(model, "circle", { 'id': 'm-' + i, 'class': 'dtp-select-minute', 'style': 'cursor:pointer', r: r, cx: x, cy: y, fill: color, 'data-minute': i });

                if (!toggleTime(model, i, false)) {
                    svgMinuteCircle.className += " disabled";
                } else {
                    svgMinuteCircle.addEventListener('click', _onSelectMinute.bind(model));
                }

                svgClockElement.appendChild(svgMinuteCircle)
            }

            for (var i = 0; i < 60; i++) {
                if ((i % 5) === 0) {
                    var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 60))));
                    var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 60))));

                    var color = ((model.currentaVlue.format("m") == i) ? "#fff" : '#000');

                    var svgMinuteText = createSVGElement(model, "text", { 'id': 'tm-' + i, 'class': 'dtp-select-minute-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-minute': i });
                    svgMinuteText.textContent = i;

                    if (!toggleTime(model, i, false)) {
                        svgMinuteText.className += " disabled";
                        svgMinuteText.setAttribute('fill', '#bdbdbd');
                    } else {
                        svgMinuteText.addEventListener('click', _onSelectMinute.bind(model));
                    }

                    svgClockElement.appendChild(svgMinuteText)
                }
            }

            _centerBox(model);
        };
        function animateHands(model) {
            var H = model.currentaVlue.getHours();
            var M = model.currentaVlue.getMinutes();
            console.log([H, M, model, model.currentaVlue]);
            var hh = model.template.find('.hour-hand');
            hh[0].setAttribute('transform', "rotate(" + 360 * H / 12 + ")");

            var mh = model.template.find('.minute-hand');
            mh[0].setAttribute('transform', "rotate(" + 360 * M / 60 + ")");
        }
        function createSVGClock(model, isHour) {
            var hl = ((model.shortTime) ? -120 : -90);

            var svgElement = createSVGElement(model, "svg", { class: 'svg-clock', viewBox: '0,0,400,400' });
            var svgGElement = createSVGElement(model, "g", { transform: 'translate(200,200) ' });
            var svgClockFace = createSVGElement(model, "circle", { r: '192', fill: '#eee', stroke: '#bdbdbd', 'stroke-width': 2 });
            var svgClockCenter = createSVGElement(model, "circle", { r: '15', fill: '#757575' });

            svgGElement.appendChild(svgClockFace)

            if (isHour) {
                var svgMinuteHand = createSVGElement(model, "line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#bdbdbd', 'stroke-width': 2 });
                var svgHourHand = createSVGElement(model, "line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#8BC34A', 'stroke-width': 8 });

                svgGElement.appendChild(svgMinuteHand);
                svgGElement.appendChild(svgHourHand);
            } else {
                var svgMinuteHand = createSVGElement(model, "line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#8BC34A', 'stroke-width': 2 });
                var svgHourHand = createSVGElement(model, "line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#bdbdbd', 'stroke-width': 8 });

                svgGElement.appendChild(svgHourHand);
                svgGElement.appendChild(svgMinuteHand);
            }

            svgGElement.appendChild(svgClockCenter)

            svgElement.appendChild(svgGElement)
            if (model.currentView == 1) {
                model.ClockTmpl.html('<div id="am_pm" class="row"><div class="col-md-4 col-sm-4 col-xl-4"><a class="am btn btn-default"> AM</a></div><div class="col-md-4 col-sm-4 col-xl-4"></div><div class="col-md-4 col-sm-4 col-xl-4"style="text-align:right"><a class="pm btn btn-default">PM</a></div></div>');
            } else {
                model.ClockTmpl.empty();
            }
            model.ClockTmpl[0].appendChild(svgElement);

            animateHands(model);

            return svgGElement;
        };
        function createSVGElement(model, tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        };
        function rotateElement(model, el, deg) {
            $(el).css
                    ({
                        WebkitTransform: 'rotate(' + deg + 'deg)',
                        '-moz-transform': 'rotate(' + deg + 'deg)'
                    });
        };
        function showTime(model, date) {

        };
        function toggleTime(model, value, isHours) {
            var result = false;

            if (isHours) {
                var _date = new Date(model.currentaVlue);
                _date.setHours(value % 23);
                _date.setMinutes(0);
                _date.setSeconds(0);

                result = true;
            } else {
                var _date = new Date(model.currentaVlue);
                _date.setMinutes(value);
                _date.setSeconds(0);

                result = true;
            }

            return result;
        };
        function _onSelectHour(e) {
            var model = this;

            if (!$(e.target).hasClass('disabled')) {
                var value = $(e.target).data('hour');
                var parent = $(e.target).parent();

                var h = parent.find('.dtp-select-hour');
                for (var i = 0; i < h.length; i++) {
                    $(h[i]).attr('fill', 'transparent');
                }
                var th = parent.find('.dtp-select-hour-text');
                for (var i = 0; i < th.length; i++) {
                    $(th[i]).attr('fill', '#000');
                }

                $(parent.find('#h-' + value)).attr('fill', '#8BC34A');
                $(parent.find('#th-' + value)).attr('fill', '#fff');
                //console.log([value,model.currentaVlue, 'value']);
                model.currentaVlue.setHours(parseInt(value));

                if (model.shortTime === true && model.isPM) {
                    model.currentaVlue.setHours(model.currentaVlue.getHours() + 12);
                }
                showTime(model, model.currentaVlue);
                animateHands(model);
                setTimeout(initMinutes(model), 200);

            }
            onSetElmValue(model, 1);

        };
        function _onSelectMinute(e) {
            var model = this;
            if (!$(e.target).hasClass('disabled')) {
                var value = $(e.target).data('minute');
                var parent = $(e.target).parent();

                var m = parent.find('.dtp-select-minute');
                for (var i = 0; i < m.length; i++) {
                    $(m[i]).attr('fill', 'transparent');
                }
                var tm = parent.find('.dtp-select-minute-text');
                for (var i = 0; i < tm.length; i++) {
                    $(tm[i]).attr('fill', '#000');
                }

                $(parent.find('#m-' + value)).attr('fill', '#8BC34A');
                $(parent.find('#tm-' + value)).attr('fill', '#fff');

                model.currentaVlue.setMinutes(parseInt(value));
                showTime(model, model.currentaVlue);

                animateHands(model);

                if (this.switchOnClick === true)
                    setTimeout(function () {
                        setElementValue(this);
                        DatePicker.TimePicker.Hide(this);
                    }.bind(model), 200);
            }

            onSetElmValue(model, 2);
        };
        function _onSelectAM(model) {

            model.isPM = false;
            model.template.find('#am_pm a').removeClass('selected');
            $(this).addClass('selected');

            if (model.currentaVlue.getHours() >= 12) {
                model.currentaVlue.setHours(model.currentaVlue.getHours() - 12)
            }
            //toggleTime(model, (this.currentView === 1));

            onSetElmValue(model, model.currentView - 1, true);
        };
        function _onSelectPM(model) {
            model.template.find('#am_pm a').removeClass('selected');
            $(this).addClass('selected');
            model.isPM = true;
            if (model.currentaVlue.getHours() < 12) {
                model.currentaVlue.setHours(model.currentaVlue.getHours() + 12)
            }
            onSetElmValue(model, model.currentView - 1, true);
        };
        function _attachEvent(el, ev, fn) {
            el.on(ev, null, null, fn);
        };
        function _centerBox() {
            var model = this;
            //var h = (model.template.height() - model.template.find('.dtp-content').height()) / 2;
            //model.template.find('.dtp-content').css('marginLeft', -(model.template.find('.dtp-content').width() / 2) + 'px');
            //model.template.find('.dtp-content').css('top', h + 'px');
        };
    }).call(this.TimePicker = {});
    this.Bind = function (elm, model) {
        if (elm.data('DatePicker')) { return elm.data('DatePicker'); }
        //var max = model.max;
        model = getDefaultOption(model);
        //model.max = max || model.max;
        model.elm = elm;
        if (model.value) {
            elm.val(model.value.format(model.format));
            model.text = elm.val();
        }

        model.open = function () {
            show(model);
        };
        model.hide = function () {
            hide(model)
        };
        set(model);
        elm.data('DatePicker', model);
        return model;
    };
};
