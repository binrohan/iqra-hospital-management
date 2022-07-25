
var Controller = new function () {
    var isBind, callerOptions, formModel = {}, service = {};
    this.Show = function (model) {
        callerOptions = model;

        callerOptions.modules = callerOptions.modules || ['Attendance', 'EmployeeShift', 'Weekend', 'LeaveItem'];

        if (isBind) {
            service.Calendar.Reload(callerOptions.model.Date);
        } else {
            isBind = true;
            service.Calendar.Bind(callerOptions.model.Date);
        }
    };
    (function (none) {
        var that = this,calendar, selfService = {}, viewItems = [], isActiveVisible, selectedValues = {},
            maxDays = [32, 29, 32, 31, 32, 31, 32, 32, 31, 32, 31, 32];
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
            var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstHalf, secondHalf, hlfClass = 'col-md-6', cls = 'col-md-1', bigCls = ' big_line';
            function getNewDate(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); };
            function getDateTime(date) { return getNewDate(date).getTime(); };
            function getFirstHalf(i, l) {
                var htmlText = '<div class="' + hlfClass + '"><div class="row">';
                for (; i <= l; i++) {
                    htmlText += '<div class="' + cls + (i % 4 === 0 ? bigCls : '') + '"><div class="line"></div>' + (i % 4 === 0 ? '<div class="text">' + i + '</div>' : '') + '</div>';
                }
                htmlText += '</div></div>'
                return htmlText;
            };
            function setHours(itemModel) {
                firstHalf = firstHalf || getFirstHalf(1, 12);
                secondHalf = secondHalf || getFirstHalf(13, 23);

                itemModel.ViewPort.append('<div class="hour_divide"><div class="row">' +
                    firstHalf + secondHalf + '</div></div>');
            };
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
                var tr = $('<tr>'), width = model.DateModel.tbody.width() / 7 - 11, height = width * (3 / 4) < 50 ? 50 : width * (3 / 4);
                viewItems = [];
                for (; startDate <= endDate;) {
                    var cls = startDate.getMonth() > model.DateModel.Month ? 'day new' : startDate.getMonth() < model.DateModel.Month ? 'day old' : 'day',
                        time = startDate.getTime();
                    (model.max < time) && (cls = 'disabled');
                    var date = startDate.getDate();
                    var itemModel = { String: startDate.format('yyyy-MM-dd'), Date: new Date(startDate), Model: model, IsCurrentMonth: startDate.getMonth() == model.DateModel.Month };
                    (selectedValues[itemModel.String]) && (cls += ' selected');
                    viewItems.push(itemModel);
                    (time == today) && (cls += ' today');
                    itemModel.Elm = $('<td class="' + cls + '" style="border: 5px solid silver;"><div class="view_port" style="position: relative; height: ' + height + 'px;"><div class="text" style="position:absolute;top: calc(50% - 30px);left: calc(50% - 30px);">' + date + '</div></div></td>');
                    itemModel.ViewPort = itemModel.Elm.find('.view_port');
                    tr.append(Global.Click(itemModel.Elm, objectModel.SelectDate, itemModel));
                    setHours(itemModel);
                    if (startDate.getDay() == 6) {
                        model.DateModel.tbody.append(tr);
                        tr = $('<tr>');
                    }
                    startDate.setDate(date + 1);
                }
                model.DateModel.title.html(monthName[model.DateModel.Month] + ' ' + model.DateModel.Date.getFullYear());
                model.DateModel.tbody.append(tr);
                selfService.Loader.Load(from, startDate.format('yyyy/MM/dd 00:00'));

                callerOptions.OnViewSet && callerOptions.OnViewSet(viewItems, from, startDate.format('yyyy/MM/dd 00:00'));
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
                var date = item.Date, model = item.Model, elm = $(this);
                callerOptions.onDateSelect && callerOptions.onDateSelect(item);
                if (selectedValues[item.String]) {
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
                model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() + 1);
                objectModel.SetDateView(model);
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
                var template = $('<div class="datepicker" style="display: block;"><table style="width: 100%; font-size: 4em;"><colgroup><col><col><col><col><col><col><col></colgroup><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch" colspan="5">February 2015</th><th class="next" style="visibility: visible;">»</th></tr>' +
                    '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody></tbody></table></div>');
                var thead = template.find('thead');
                model.DateModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
                thead.find('.prev').click(function () { objectModel.PrevMonth(model) });
                //thead.find('.datepicker-switch').click(function () { objectModel.SwitchToMonthView(model) });
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
            return tmp;
        };
        function set(model) {
            var timeOutEvent;
            model.max = model.max ? model.max.getTime() : Math.max;
            model.min = model.min ? model.min.getTime() : Math.min;
            model.elm.append(getTemplate(model));
            objectModel.SetDateView(model);
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
        this.Bind = function (date) {
            model = getDefaultOption();
            model.elm = callerOptions.Container;
            model.value = date;
            model.elm.val(model.value.format(model.format));
            model.text = model.elm.val();

            model.open = function () {
                show(model);
            };
            model.hide = function () {
                hide(model)
            };
            set(model);
            calendar = model;
            return model;
        };
        this.Reload = function (date) {
            calendar.DateModel.Date = date;
            objectModel.SetDateView(calendar);
        };
        (function () {
            var leaveItem;
            function setView(viewItem, leaveModel) {
                viewItem.Attendance = viewItem.Attendance || [];
                viewItem.Attendance.push(leaveModel);
                var elm = $('<div class="attendance ' + (leaveModel.AdjustmentType==3?'manually':'auto') + '">');
                viewItem.ViewPort.prepend(elm);
                leaveModel.ViewModel = viewItem;
                elm.css({ left: (((leaveModel.InterAt.getTime() - leaveModel.InterAt.getTimezoneOffset() * 60000) % 86400000) / 864000) + '%', width: (100 * (leaveModel.OutAt.getTime() - leaveModel.InterAt.getTime()) / 86400000) + '%' });
            };
            function checkView(leaveItem, ln) {
                for (var i = 0; i < ln; i++) {
                    var item = viewItems[i];
                    if (item.Date <= leaveItem.Date && viewItems[i + 1].Date > leaveItem.Date) {
                        setView(item, leaveItem);
                    }
                }
            };
            this.Set = function (list) {
                var ln = viewItems.length, item = { Date: new Date(viewItems[viewItems.length - 1].Date) };
                item.Date.setDate(item.Date.getDate() + 1);
                viewItems.push(item);
                list.each(function () {
                    leaveItem = this;
                    this.Date = this.Date.getDate();
                    this.InterAt = Global.DateTime.GetObject(this.Date.format('dd/MM/yyyy ') + this.InterAt, 'dd/MM/yyyy HH:mm');
                    this.OutAt = Global.DateTime.GetObject(this.Date.format('dd/MM/yyyy ') + this.OutAt, 'dd/MM/yyyy HH:mm');
                    if (this.InterAt > this.OutAt && this.IsOut) {
                        var copyPro = Global.Copy({}, this);
                        copyPro.InterAt = copyPro.Date = new Date(this.Date.getFullYear(), this.OutAt.getMonth(), this.OutAt.getDate() + 1);
                        this.OutAt.setDate(this.OutAt.getDate() + 1);
                        copyPro.OutAt = this.OutAt;
                        this.OutAt = copyPro.InterAt;
                        checkView(copyPro, ln);
                    } else if (!this.IsOut) {
                        if (this.InterAt.getDate() == new Date().getDate()) {
                            this.OutAt = new Date();
                        } else if ((this.InterAt.getDate()+1) == new Date().getDate()) {
                            var copyPro = Global.Copy({}, this);
                            copyPro.InterAt = copyPro.Date = new Date(this.Date.getFullYear(), this.OutAt.getMonth(), this.OutAt.getDate() + 1);
                            this.OutAt=new Date();
                            copyPro.OutAt = this.OutAt;
                            this.OutAt = copyPro.InterAt;
                            checkView(copyPro, ln);
                        }
                    }
                    checkView(leaveItem, ln);
                });
                viewItems.pop();
            };
        }).call(selfService.Attendance = {});
        (function () {
            var shiftModel;
            function setView(viewItem, shiftModel) {
                viewItem.ShiftModel = viewItem.ShiftModel || [];
                viewItem.ShiftModel.push(shiftModel);
                var elm = $('<div class="shift">');
                viewItem.ViewPort.append(elm);
                elm.css({ left: (((shiftModel.StartAt.getTime() - shiftModel.StartAt.getTimezoneOffset() * 60000) % 86400000) / 864000) + '%', width: (100 * (shiftModel.EndAt.getTime() - shiftModel.StartAt.getTime()) / 86400000) + '%' });
            };
            this.Set = function (list) {
                //console.log(list);
                //list = list.orderBy('StartDayOfMonth', true);
                list.each(function () {
                    shiftModel = this;
                    this.ActivateAt = this.ActivateAt.getDate();
                    this.ActiveTo = this.ActiveTo.getDate();
                    this.StartAt = Global.DateTime.GetObject(this.StartAt,'HH:mm');
                    this.EndAt = Global.DateTime.GetObject(this.EndAt, 'HH:mm');
                    this.StartAt.setFullYear(2000);
                    this.EndAt.setFullYear(2000);
                    viewItems.each(function () {
                        if (this.Date >= shiftModel.ActivateAt && this.Date < shiftModel.ActiveTo && this.Date.getDate() >= shiftModel.StartDayOfMonth && this.Date.getDate() <= shiftModel.EndDayOfMonth) {
                            setView(this, shiftModel);
                        }
                    });
                });

            };
        }).call(selfService.EmployeeShift = {});
        (function () {
            var weekends = {}, weekend = {};
            function setWeekend(list) {
                viewItems.each(function () {
                    weekend = weekends[this.Date.getDay()];
                    if (weekend && weekend.From <= this.Date && weekend.To >= this.Date) {
                        this.ViewPort.addClass('weekend');
                    }
                });
            };
            this.Set = function (list) {
                weekends = {};
                list.each(function () {
                    this.From = this.From.getDate();
                    this.To = this.To.getDate();
                    weekends[this.DayOfWeek] = this;
                });
                setWeekend(list);
            };
        }).call(selfService.Weekend = {});
        (function () {
            var leaveItem;
            function setView(viewItem, leaveModel) {
                viewItem.LeaveModel = viewItem.LeaveModel || [];
                viewItem.LeaveModel.push(leaveModel);
                var elm = $('<div class="leave">');
                viewItem.ViewPort.prepend(elm);
                leaveModel.ViewModel = viewItem;
                elm.css({ left: (((leaveModel.StartAt.getTime() - leaveModel.StartAt.getTimezoneOffset() * 60000) % 86400000) / 864000) + '%', width: (100 * (leaveModel.EndAt.getTime() - leaveModel.StartAt.getTime()) / 86400000) + '%' });
                
                switch (leaveItem.Status) {
                    case 0:
                        elm.addClass('pending');
                        break;
                    case 1:
                        elm.addClass('approved');
                        break;
                    case 2:
                        elm.addClass('rejected');
                        break;
                }
            };
            this.Set = function (list) {

                list.each(function () {
                    leaveItem=this;
                    this.StartAt = this.StartAt.getDate();
                    this.EndAt = this.EndAt.getDate();
                    var ln = viewItems.length, item = { Date: new Date(viewItems[viewItems.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    viewItems.push(item);
                    for (var i = 0; i < ln; i++) {
                        item = viewItems[i];
                        if (item.Date <= leaveItem.StartAt && viewItems[i + 1].Date > leaveItem.StartAt) {
                            setView(item, leaveItem);
                        }
                    }
                    viewItems.pop();
                });
                console.log(list);
                callerOptions.OnLeaveLoaded && callerOptions.OnLeaveLoaded(list,viewItems);
            };
        }).call(selfService.LeaveItem = {});
        (function () {
            var lateEntry;
            function setView(viewItem, lateEntryModel) {
                viewItem.LateEntryModel = viewItem.LateEntryModel || [];
                viewItem.LateEntryModel.push(lateEntryModel);
                var elm = $('<div class="late_entry">');
                viewItem.ViewPort.prepend(elm);
                lateEntryModel.ViewModel = viewItem;
                elm.css({ left: (((lateEntryModel.StartAt.getTime() - lateEntryModel.StartAt.getTimezoneOffset() * 60000) % 86400000) / 864000) + '%', width: (100 * (lateEntryModel.EndAt.getTime() - lateEntryModel.StartAt.getTime()) / 86400000) + '%' });

                switch (lateEntry.Status) {
                    case 0:
                        elm.addClass('pending');
                        break;
                    case 1:
                        elm.addClass('approved');
                        break;
                    case 2:
                        elm.addClass('rejected');
                        break;
                }
            };
            this.Set = function (list) {
                list.each(function () {
                    lateEntry = this;
                    this.StartAt = this.EntryTime.getDate();
                    this.EndAt = this.EnterAt.getDate();
                    var ln = viewItems.length, item = { Date: new Date(viewItems[viewItems.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    viewItems.push(item);
                    for (var i = 0; i < ln; i++) {
                        item = viewItems[i];
                        if (item.Date <= lateEntry.StartAt && viewItems[i + 1].Date > lateEntry.StartAt) {
                            setView(item, lateEntry);
                        }
                    }
                    viewItems.pop();
                });
                callerOptions.OnLateEntryLoaded && callerOptions.OnLateEntryLoaded(list, viewItems);
            };
        }).call(selfService.LateEntry = {});
        (function () {
            var overTime;
            function setView(viewItem, overTimeModel) {
                viewItem.OverTimeModel = viewItem.OverTimeModel || [];
                viewItem.OverTimeModel.push(overTimeModel);
                var elm = $('<div class="over_time">');
                viewItem.ViewPort.prepend(elm);
                overTimeModel.ViewModel = viewItem;
                elm.css({ left: (((overTimeModel.StartAt.getTime() - overTimeModel.StartAt.getTimezoneOffset() * 60000) % 86400000) / 864000) + '%', width: (100 * (overTimeModel.EndAt.getTime() - overTimeModel.StartAt.getTime()) / 86400000) + '%' });

                switch (overTime.Status) {
                    case 0:
                        elm.addClass('pending');
                        break;
                    case 1:
                        elm.addClass('approved');
                        break;
                    case 2:
                        elm.addClass('rejected');
                        break;
                }
            };
            this.Set = function (list) {
                list.each(function () {
                    overTime = this;
                    this.StartAt = this.StartAt.getDate();
                    this.EndAt = this.EndAt.getDate();
                    var ln = viewItems.length, item = { Date: new Date(viewItems[viewItems.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    viewItems.push(item);
                    for (var i = 0; i < ln; i++) {
                        item = viewItems[i];
                        if (item.Date <= overTime.StartAt && viewItems[i + 1].Date > overTime.StartAt) {
                            setView(item, overTime);
                        }
                    }
                    viewItems.pop();
                });
                callerOptions.OnOverTimeLoaded && callerOptions.OnOverTimeLoaded(list, viewItems);
            };
        }).call(selfService.OverTime = {});
        (function () {
            this.Load = function (from, to) {
                if (callerOptions.modules.length < 1) {
                    return;
                }
                //console.log([callerOptions.model, callerOptions, callerOptions.model.EmployeeId]);
                var model = {
                    employeId: callerOptions.model.EmployeeId,
                    From: from,
                    To:to,
                    modules: callerOptions.modules
                };
                Global.CallServer('/EmployeeArea/Employee/GetMonthDetails', function (response) {
                    if (!response.IsError) {
                        //[Holidays,EmployeeShift,Weekend,LeaveItem]
                        //callerOptions.modules = callerOptions.modules || [
                        callerOptions.modules.each(function (i) {
                            selfService[this].Set(response.Data[i]);
                        });
                        
                    } else {
                        error.Save(response, saveUrl);
                    }
                }, function (response) {
                    response.Id = -8;
                    alert('Errors.');
                }, model, 'POST');
            };
        }).call(selfService.Loader = {});
    }).call(service.Calendar = {});
    LazyLoading.LoadCss([IqraConfig.Url.Css.Datepicker]);
};