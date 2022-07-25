
var Controller = new function () {
    var isBind, callerOptions, formModel = {}, service = {};
    this.Show = function (model) {
        callerOptions = model;
        callerOptions.modules = ['EmployeeShift'];
        if (isBind) {
            service.Calendar.Reload(callerOptions.model.Date);
        } else {
            isBind = true;
            service.Calendar.Bind(callerOptions.model.Date);
        }
    };
    (function (none) {
        var that = this, calendar, selfService = {}, viewItems = [], viewDic = {}, isActiveVisible, selectedValues = {},
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
                //firstHalf = firstHalf || getFirstHalf(1, 12);
                //secondHalf = secondHalf || getFirstHalf(13, 23);
                //itemModel.ViewPort.append('<div class="hour_divide"><div class="row">' +
                //    firstHalf + secondHalf + '</div></div>');
            };
            this.SetDateView = function (model) {
                var endDate = model.DateModel.Date.Date();
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
                viewDic = {};
                for (; startDate <= endDate;) {
                    var cls = startDate.getMonth() > model.DateModel.Month ? 'day new' : startDate.getMonth() < model.DateModel.Month ? 'day old' : 'day',
                        time = startDate.getTime();
                    (model.max < time) && (cls = 'disabled');
                    var date = startDate.getDate();
                    var itemModel = { String: startDate.format('yyyy-MM-dd'), Date: new Date(startDate), Model: model, IsCurrentMonth: startDate.getMonth() == model.DateModel.Month };
                    (selectedValues[itemModel.String]) && (cls += ' selected');
                    viewItems.push(itemModel);
                    viewDic[itemModel.String] = itemModel;
                    (time == today) && (cls += ' today');
                    itemModel.Elm = $('<td class="' + cls + '" style="border: 5px solid silver;"><div class="view_port" style="position: relative; height: ' + height + 'px;"><div class="text" style="position:absolute;left: 5%;">' + date + '</div></div></td>');
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
            this.SelectDate = function (item) {
                //var date = item.Date, model = item.Model, elm = $(this);
                //callerOptions.onDateSelect && callerOptions.onDateSelect(item);
                //if (selectedValues[item.String]) {
                //    elm.removeClass('selected');
                //    selectedValues[item.String] = none;
                //} else {
                //    selectedValues[item.String] = item;
                //    elm.addClass('selected');
                //}
            };
            this.NextMonth = function (model) {
                var date = new Date(model.DateModel.Date);
                date.setMonth(date.getMonth() + 1);
                if (date.getTime() > model.max) {
                    return;
                }
                model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() + 1);
                objectModel.SetDateView(model);
            };
            this.PrevMonth = function (model) {
                model.DateModel.Date.setMonth(model.DateModel.Date.getMonth() - 1); objectModel.SetDateView(model);
            };
            this.SwitchToDateView = function (model) {
                model.DateModel.template.show();
                model.MonthModel.template.hide();
                objectModel.SetDateView(model);
            };
        };
        var template = new function () {
            var that = this;
            this.GetDateTemplate = function (model) {
                var template = $('<div class="datepicker" style="display: block;"><table style="width: 100%; font-size: 2em;"><colgroup><col><col><col><col><col><col><col></colgroup><thead><tr><th class="prev" style="visibility: visible;">«</th><th class="datepicker-switch" colspan="5">February 2015</th><th class="next" style="visibility: visible;">»</th></tr>' +
                    '<tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody></tbody></table></div>');
                var thead = template.find('thead');
                model.DateModel = { template: template, tbody: thead.next(), title: thead.find('.datepicker-switch'), Date: model.value && new Date(model.value) || new Date() }
                thead.find('.prev').click(function () { objectModel.PrevMonth(model) });
                //thead.find('.datepicker-switch').click(function () { objectModel.SwitchToMonthView(model) });
                thead.find('.next').click(function () { objectModel.NextMonth(model); });
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
        };
        function hide(model, isFromSelect) {
            checkForValue(model) && model.onchange && model.onchange(model.value, model, isFromSelect);
            model.template.hide().offset({ top: '100%', left: '100%' });
        };
        function get2digit(num) {
            num = num + '';
            return num.length == 1 ? '0' + num : num;
        };
        function getSortTime(time) {
            var str = parseInt(time / 60, 0), am = ' AM';
            if (str > 12) {
                str = str - 12;
                am = ' PM';
            }
            return get2digit(str) + ' : ' + get2digit(time % 60) + am;
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
            var availability;
            function onSelectAppointment(availability, date) {
                var tt = date.getTime() + availability.StartAtTime + ((availability.MaximumPatient-availability.Available) * (availability.EndAtTime - availability.StartAtTime) / availability.MaximumPatient);
                var time = new Date(tt);
                callerOptions.Success && callerOptions.Success(time, availability,date);
            };
            function onClickViewPort(viewItem) {
                console.log(viewItem);
                if (viewItem.Availability.length == 1) {
                    onSelectAppointment(viewItem.Availability[0], viewItem.Date);
                } else {

                }
            };
            function onClickSchedule(model) {
                console.log(model);
                onSelectAppointment(model.Availability, model.ViewItem.Date);
            };
            function setView(viewItem, availability) {
                viewItem.Availability = viewItem.Availability || [];
                viewItem.Availability.push(availability);
                var elm = $('<div class="attendance" title="' + getSortTime(availability.StartAtTime / 60000) + " - " + availability.MaximumPatient + " - " + getSortTime(availability.EndAtTime / 60000) + '">');
                viewItem.ViewPort.append(elm);
                elm.css({ left: (availability.StartAtTime / 864000) + '%', width: ((availability.EndAtTime - availability.StartAtTime) / 864000) + '%' });
                Global.Click(viewItem.ViewPort, onClickViewPort, viewItem);
                Global.Click(elm, onClickSchedule, { ViewItem: viewItem, Availability: availability });
            };
            this.Set = function (list) {
                list.each(function () {
                    availability = this;
                    this.ActiveFromDate = this.ActiveFromDate.getDate();
                    this.ActiveToDate = this.ActiveToDate.getDate();
                    this.StartAtTime = this.StartAtTime.getDate();
                    this.EndAtTime = this.EndAtTime.getDate();
                    this.StartAtTime = (this.StartAtTime.getTime() - this.StartAtTime.Date().getTime());
                    this.EndAtTime = (this.EndAtTime.getTime() - this.EndAtTime.Date().getTime());
                    this.Available = this.MaximumPatient;
                    this.AppointmentCounter = 0;

                    viewItems.each(function () {
                        if (this.Date >= availability.ActiveFromDate && this.Date <= availability.ActiveToDate) {
                            if (availability.PeriodType == 0 && this.Date.getDay() == availability.Day) {
                                setView(this, availability);
                            } else if (availability.PeriodType == 1 && this.Date.getDate() == availability.Day) {
                                setView(this, availability);
                            } else if (availability.PeriodType == 2 && this.Date.getDay() == availability.Day && availability.Day) {
                                setView(this, availability);
                            }
                        }
                    });
                    //0=Weekly, 1=Monthly, 2=MonthlyWeekly, 3 = Daily
//                    ,[IsDeleted]
//,[Remarks]
//,[DoctorId]
//,[PeriodType]
//,[StartAtTime]
//,[EndAtTime]
//,[MaximumPatient]
//,[ExtraPatientAppointment]
//,[Day]
//,[Week]
//,[ActiveFromDate]
//,[ActiveToDate]
                });
            };
        }).call(selfService.Availability = {});
        (function () {
            var schedule;
            function setOneView(viewItem, schedule) {
                viewItem.Schedule = viewItem.Schedule || [];
                viewItem.Schedule.push(schedule);
                schedule.DateView = viewItem;

                var cls = schedule.Available == 0 ? ' not_available' : ' available',
                    elm = $('<div class="schedule' + cls + '" style="position: absolute; font-size: 0.5em; top: 5px; left: 45px; text-align: left;">' +
                              '<div class="max_app">' + schedule.TotalAppointment + ' Max</div>' +
                                '<div class="app_taken">' + schedule.AppointmentCounter + ' Appoi</div>' +
                                '<div class="app_ava">' + schedule.Available + ' Avai</div>' +
                            '</div>');
                viewItem.ViewPort.append(elm);
            };
            function setTwoView(viewItem, schedule) {
                viewItem.Availability = viewItem.Availability || [];
                viewItem.Availability.push(schedule);
                schedule.DateView = viewItem;
                var elm = $('<div class="attendance" title="' + getSortTime(schedule.StartAtTime / 60000) + " to " + getSortTime(schedule.EndAtTime / 60000) + '">');
                viewItem.ViewPort.append(elm);
                elm.css({ left: (schedule.StartAtTime / 864000) + '%', width: ((schedule.EndAtTime - schedule.StartAtTime) / 864000) + '%' });
            };
            this.Set = function (list) {
                list.each(function () {
                    schedule = this;
                    this.ScheduleStartAtTime = this.ScheduleStartAtTime.getDate();
                    this.ScheduleEndAtTime = this.ScheduleEndAtTime.getDate();
                    this.ScheduleStartAt = (this.ScheduleStartAtTime.getTime() - this.ScheduleStartAtTime.Date().getTime());
                    this.ScheduleEndAt = (this.ScheduleEndAtTime.getTime() - this.ScheduleEndAtTime.Date().getTime());
                    this.Available = this.TotalAppointment - this.AppointmentCounter;
                    var viewItem =viewDic[this.ScheduleStartAtTime.format('yyyy-MM-dd')]||viewDic[this.ScheduleEndAtTime.format('yyyy-MM-dd')];
                    if (viewItem) {
                        if (viewItem.Availability.length < 2) {
                            setOneView(viewItem, schedule);
                        } else {
                            setTwoView(viewItem, schedule);
                        }
                    }
                    //viewItems.each(function () {
                    //    if (this.Date >= schedule.ScheduleStartAtTime && this.Date <= schedule.ScheduleEndAtTime) {
                    //        setView(this, schedule);
                    //    }
                    //});
      //  [IsDeleted]
      //, [Remarks]
      //, [DoctorId]
      //, [ScheduleStartAtTime]
      //, [ScheduleEndAtTime]
      //, [AppointmentCounter]
      //, [TotalAppointment]
      //, [DoctorFee]
      //, [RoomId]
      //, [AppointmentDone]
      //, [Status]
                });
            };
        }).call(selfService.Schedule = {});
        (function () {
            this.Load = function (from, to) {
                if (callerOptions.modules.length < 1) {
                    return;
                }
                //console.log([callerOptions.model, callerOptions, callerOptions.model.EmployeeId]);
                var model = {
                    doctorId: callerOptions.model.DoctorId,
                    from: from,
                    to: to
                };
                Global.CallServer('/DoctorAvailability/Monthly', function (response) {
                    if (!response.IsError) {
                        selfService.Availability.Set(response.Data[0]);
                        selfService.Schedule.Set(response.Data[1]);
                    } else {
                        Global.Error.Show(response, '/DoctorAvailability/Monthly');
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