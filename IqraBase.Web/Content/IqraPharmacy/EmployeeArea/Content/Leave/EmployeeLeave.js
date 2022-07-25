
(function (none) {
    var that = this, service = {},viewItems=[], isActiveVisible, selectedValues = {}, employeeId = '98A5145C-A6C0-4535-8D2A-B1B945B6D694';

    function getDefaultOption(options) {
        options = options || {};
        var option = {};
        for (var key in options) { option[key.toLowerCase()] = options[key]; }
        option.max = new Date(2200, 0, 1);
        return {
            value: option.value || null,
            format: option.format || 'dd/MM/yyyy',
            defaultView: option.defaultView || 'day',
            max: option.max || null,
            min: option.min || null,
            onchange: option.onchange,
            onselect: option.onselect
        };
    };
    var validation = new function () {
        var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var monthsValues = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5, 'july': 6, 'augost': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
            '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, '11': 10, '12': 11,
            '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5, '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
        };
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
    var objectModel = new function () {
        var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
            var from = startDate.format('yyyy/MM/dd 00:00');
            var tr = $('<tr>');
            viewItems = [];
            for (; startDate <= endDate;) {
                var cls = startDate.getMonth() > model.DateModel.Month ? 'day new' : startDate.getMonth() < model.DateModel.Month ? 'day old' : 'day',
                    time = startDate.getTime();
                (model.max < time) && (cls = 'disabled');
                var date = startDate.getDate();
                var itemModel = { String: startDate.format('yyyyMMdd'), Date: new Date(startDate), Model:model };
                (selectedValues[itemModel.String]) && (cls += ' selected');
                viewItems.push(itemModel);
                (time == today) && (cls += ' today');
                itemModel.Elm=$('<td class="' + cls + '">' + date + '</td>');
                tr.append(Global.Click(itemModel.Elm, objectModel.SelectDate, itemModel));
                if (startDate.getDay() == 6) {
                    model.DateModel.tbody.append(tr);
                    tr = $('<tr>');
                }
                startDate.setDate(date + 1);
            }
            model.DateModel.title.html(monthName[model.DateModel.Month] + ' ' + model.DateModel.Date.getFullYear());
            model.DateModel.tbody.append(tr);
            service.Weekend.Load(from, startDate.format('yyyy/MM/dd 00:00'));
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
        this.SelectDate = function (item) {
            var date = item.Date, model=item.Model,elm=$(this);
            if (selectedValues[item.String])
            {
                elm.removeClass('selected');
                selectedValues[item.String] = none;
            } else {
                selectedValues[item.String] = item;
                elm.addClass('selected');
            }
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
            objectModel.SwitchToDateView(model);
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
        this.GetDateTemplate = function (model) {
            var template = $('<div class="datepicker" style="display: block;"><table style="width: 100%; font-size: 4em;"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch" colspan="5">February 2015</th><th class="next" style="visibility: visible;">»</th></tr>' +
                '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody></tbody></table></div>');
            var thead = template.find('thead');
            model.DateModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
            thead.find('.prev').click(function () { objectModel.PrevMonth(model) });
            thead.find('.datepicker-switch').click(function () { objectModel.SwitchToMonthView(model) });
            thead.find('.next').click(function () { objectModel.NextMonth(model); });
            return template;
        };
        this.GetMonthTemplate = function (model) {
            var template = $('<div class="datepicker-months"><table style="width: 100%; font-size: 4em;"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>' +
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
            var template = $('<div class="datepicker-months"><table style="width: 100%; font-size: 4em;"><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch">2015</th><th class="next" style="visibility: visible;">»</th></tr></thead>' +
            '<tbody></tbody></table></div>');
            var thead = template.find('thead');
            model.YearModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: new Date(model.DateModel.Date) }
            thead.find('.prev').click(function () { objectModel.PrevYearRange(model) });
            thead.find('.next').click(function () { objectModel.NextYearRange(model); });
            objectModel.SetYearView(model);

            return template;
        };
    };
    function getTemplate(model) {
        var tmp = $('<div>').append(template.GetDateTemplate(model));
        model.template = tmp;
        objectModel.SetDateView(model);
        return tmp;
    };
    function set(model) {
        var timeOutEvent;
        model.max = model.max ? model.max.getTime() : Math.max;
        model.min = model.min ? model.min.getTime() : Math.min;
        model.elm.append(getTemplate(model));
    };
    function setPosition(model) {
        
    };
    function checkForValue(model) {
        if (model.elm.val() != model.text) {
            var date = Global.DateTime.GetObject(model.elm.val(), model.format);
            if (date && !isNaN(date)) {
                model.DateModel.Date = model.value = date;
                model.DateModel.Date.setMonth(date.getMonth());
            } else {
                model.value = null;
                model.elm.val('')
            }
            objectModel.SetDateView(model);
            model.text = model.elm.val();
            return true;
        }
    };
    function show(model) {
        model.template.show();
        checkForValue(model);
        setPosition(model);
    };
    function hide(model, isFromSelect) {
        checkForValue(model) && model.onchange && model.onchange(model.value, model, isFromSelect);
        model.template.hide().offset({ top: '100%', left: '100%' });
    };
    this.Bind = function (elm, model) {
        model = getDefaultOption(model);
        //model.max = max || model.max;
        model.elm = $('#calender_view_container');
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

    (function () {

        this.Load = function (from,to) {
            var filters = [{ "field": "wknd.[EmployeeId]", "value": employeeId, Operation: 0 },
                { "field": "wknd.[To]", "value": "'" + from + "'", Operation: 2 },
                { "field": "wknd.[From]", "value": "'" + to + "'", Operation: 4 }];
            Global.CallServer('/EmployeeArea/Weekend/Get', function (response) {
                if (!response.IsError) {
                    var weekends = {}, weekend = {};
                    response.Data.Data.each(function () {
                        this.From = this.From.getDate();
                        this.To = this.To.getDate();
                        weekends[this.DayOfWeek] = this;
                    });
                    console.log(viewItems);
                    console.log(weekends);
                    viewItems.each(function () {
                        weekend=weekends[this.Date.getDay()];
                        if (weekend && weekend.From<=this.Date&&weekend.To>=this.Date) {
                            this.Elm.css({ 'background-color': '#999900' });
                        }
                    });
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors.');
            }, { "SortBy": "", "filter": filters, "PageNumber": 1, "PageSize": 1000 }, 'POST');
        };
    }).call(service.Weekend = {});

    this.Bind($('#calender_view_container'));

})();