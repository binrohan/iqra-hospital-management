
var Controller = new function () {
    var service = {}, windowModel, employees = [], callerOptions,
        page = { 'PageNumber': 1, 'PageSize': 10000000, showingInfo: ' {0}-{1} of {2} Attendances ', filter: [] };
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        page.from = callerOptions.From;
        page.to = callerOptions.To;
        console.log([callerOptions, page, page.from]);
        if (windowModel) {
            windowModel.Show();
            service.Attendance.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/SalaryArea/Templates/Salary/SalarySheet.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Attendance.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = callerOptions.model.Id;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#attendance').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onSubmit(model, data, formModel) {
            if (data) {
                model.Id = data.Id
            }
            model.EmployeeId = callerOptions.model.EmployeeId;
            model.DailyAttendanceId = callerOptions.model.Id;
            model.Date = callerOptions.model.Date;
            model.InterAt = formModel.InterAt;
            model.OutAt = formModel.OutAt;
            console.log(model);
        };
        function getDates(from, to) {
            var list = [];
            from = new Date(from);
            for (; from <= to;) {
                list.push({ Date: new Date(from), Time: from.getTime() });
                from.setDate(from.getDate() + 1);
            }
            return list;
        };
        function setWeekend(employee) {
            var weekends = {};
            employee.Weekend.Count = 0;
            employee.Weekend.Dates = [];
            employee.Weekend.List.each(function () {
                this.From = this.From.getDate();
                this.To = this.To.getDate();
                weekends[this.DayOfWeek] = this;
            });
            employee.Days.each(function () {
                weekend = weekends[this.Date.getDay()];
                if (weekend && weekend.From <= this.Date && weekend.To >= this.Date) {
                    employee.Weekend.Count++
                    employee.Weekend.Dates.push(this);
                    this.IsWeekend = true;
                }
            });
        };
        function setEmployeeShift(employee) {
            var startAt, endAt,model;
            employee.EmployeeShift.List.each(function () {
                shiftModel = this;
                this.ActivateAt = this.ActivateAt.getDate();
                this.ActiveTo = this.ActiveTo.getDate();
                this.StartAt = Global.DateTime.GetObject(this.StartAt, 'HH:mm');
                this.EndAt = Global.DateTime.GetObject(this.EndAt, 'HH:mm');
                this.StartAt.setFullYear(2000);
                this.EndAt.setFullYear(2000);
                this.StartAtTime = ((shiftModel.StartAt.getTime() - shiftModel.StartAt.getTimezoneOffset() * 60000) % 86400000);
                this.EndAtTime = ((shiftModel.EndAt.getTime() - shiftModel.EndAt.getTimezoneOffset() * 60000) % 86400000);

                employee.EmployeeShift.Duration = 0;
                employee.Days.each(function () {
                    this.EmployeeShift = this.EmployeeShift || { Item: [], Duration: 0, StartAt: 0, EndAt: 9999999999999 };
                    if (!this.IsWeekend && this.Date >= shiftModel.ActivateAt && this.Date <= shiftModel.ActiveTo && this.Date.getDate() >= shiftModel.StartDayOfMonth && this.Date.getDate() <= shiftModel.EndDayOfMonth) {
                        model = {
                            StartAt: this.Time + shiftModel.StartAtTime,
                            EndAt: this.Time + shiftModel.EndAtTime,
                            Id: shiftModel.Id
                        };
                        this.EmployeeShift.StartAt = Math.min(this.EmployeeShift.StartAt, model.StartAt);
                        this.EmployeeShift.EndAt = Math.max(this.EmployeeShift.EndAt, model.EndAt);

                        this.EmployeeShift.Item.push(model);
                        this.EmployeeShift.Duration += shiftModel.Duration;
                        employee.EmployeeShift.Duration += shiftModel.Duration;
                    }
                });
            });
        };
        function setLeaveItem(employee) {
            var ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
            item.Date.setDate(item.Date.getDate() + 1);
            employee.Days.push(item);
            employee.LeaveItem.Count=0
            employee.LeaveItem.List.each(function () {
                leaveItem = this;
                this.StartAt = this.StartAt.getDate();
                this.EndAt = this.EndAt.getDate();
                this.StartAtTime = this.StartAt.getTime();
                this.EndAtTime = this.EndAt.getTime();
                for (var i = 0; i < ln; i++) {
                    item = employee.Days[i];
                    item.LeaveItem = item.LeaveItem || { Item: [], Duration: 0, Count:0 };
                    if (item.Date <= leaveItem.StartAt && employee.Days[i + 1].Date > leaveItem.StartAt) {
                        employee.LeaveItem.Items.push(item);
                        item.LeaveItem.Item.push(leaveItem);
                        if (leaveItem.StartAtTime <= item.EmployeeShift.StartAt && leaveItem.EndAtTime >= item.EmployeeShift.EndAt) {
                            item.FullDayLeave = true;
                            employee.LeaveItem.Count++;
                            leaveItem.Duration =item.LeaveItem.Duration= item.EmployeeShift.Duration;
                        } else if (item.EmployeeShift.Duration>0) {
                            leaveItem.Duration = 0;
                            item.EmployeeShift.Item.each(function () {
                                if (leaveItem.StartAtTime < this.EndAt && leaveItem.EndAtTime > this.StartAt) {
                                    leaveItem.Duration += (Math.min(this.EndAt, leaveItem.EndAtTime) - Math.max(leaveItem.StartAtTime, this.StartAt));
                                }
                            });
                            item.LeaveItem.Duration = leaveItem.Duration = leaveItem.Duration/60000;
                            employee.LeaveItem.Count += item.LeaveItem.Count = (leaveItem.Duration / item.EmployeeShift.Duration).toFloat();
                            console.log([leaveItem.Duration, item.EmployeeShift.Duration, leaveItem.Duration / item.EmployeeShift.Duration])
                        }
                    }
                }
            });
            employee.Days.pop();
        };
        function setOverTime(employee) {
            var ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
            item.Date.setDate(item.Date.getDate() + 1);
            employee.Days.push(item);
            employee.OverTime.Duration = 0;
            employee.OverTime.List.each(function () {
                overTime = this;
                this.StartAt = this.StartAt.getDate();
                this.EndAt = this.EndAt.getDate();
                for (var i = 0; i < ln; i++) {
                    item = employee.Days[i];
                    item.OverTime = item.OverTime || { Item: [], Duration:0 };
                    if (item.Date <= overTime.StartAt && employee.Days[i + 1].Date > overTime.StartAt) {
                        employee.OverTime.Items.push(item);
                        item.OverTime.Item.push(overTime);
                        employee.OverTime.Duration += overTime.ApprovedDuration;
                        item.OverTime.Duration += overTime.ApprovedDuration;
                    }
                }
            });
            employee.Days.pop();
        };
        function setLateEntry(employee) {
            var ln = employee.Days.length, duration=0, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
            item.Date.setDate(item.Date.getDate() + 1);
            employee.Days.push(item);
            employee.LateEntry.Count = 0;
            employee.LateEntry.List.each(function () {
                lateEntry = this;
                this.StartAt = this.EntryTime.getDate();
                this.EndAt = this.EnterAt.getDate();
                this.StartAtTime = this.StartAt.getTime();
                this.EndAtTime = this.EndAt.getTime();
                for (var i = 0; i < ln; i++) {
                    item = employee.Days[i];
                    item.LateEntry = item.LateEntry || {Item:[],Duration:0};
                    if (item.Date <= lateEntry.EnterAt && employee.Days[i + 1].Date > lateEntry.EnterAt) {
                        employee.LateEntry.Items.push(item);
                        item.LateEntry.Item.push(lateEntry);
                        employee.LateEntry.Count++;
                        item.LateEntry.Duration += lateEntry.Duration
                    }
                }
            });
            employee.Days.pop();
        };
        function setAttendance(employee) {
            var ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
            item.Date.setDate(item.Date.getDate() + 1);
            employee.Days.push(item);
            employee.Attendance.List.each(function () {
                attendance = this;
                this.InterAt = Global.DateTime.GetObject(this.Date+' '+ this.InterAt,'MM/dd/yyyy HH:mm');
                this.OutAt = Global.DateTime.GetObject(this.Date + ' ' + this.OutAt, 'MM/dd/yyyy HH:mm');
                this.StartAtTime = this.InterAt.getTime();
                this.EndAtTime = this.OutAt.getTime();
                employee.Attendance.Count = 0;
                for (var i = 0; i < ln; i++) {
                    item = employee.Days[i];
                    item.Attendance = item.Attendance || { Item: [], Duration: 0 };
                    if (item.Date <= attendance.InterAt && employee.Days[i + 1].Date > attendance.InterAt) {
                        item.Attendance.Item.push(attendance);
                        if (attendance.StartAtTime <= item.EmployeeShift.StartAt && attendance.EndAtTime >= item.EmployeeShift.EndAt) {
                            item.FullDayPresant = true;
                            employee.Attendance.Count++;
                            item.Attendance.Duration += attendance.Duration = item.EmployeeShift.Duration;
                        } else {
                            attendance.Duration = 0;
                            item.EmployeeShift.Item.each(function () {
                                if (attendance.StartAtTime < this.EndAt && attendance.EndAtTime > this.StartAt) {
                                    attendance.Duration += (Math.min(this.EndAt, attendance.EndAtTime) - Math.max(attendance.StartAtTime, this.StartAt))/60000;
                                }
                            });
                            item.Attendance.Duration += attendance.Duration;
                            employee.Attendance.Count += (attendance.Duration / item.EmployeeShift.Duration).toFloat();
                        }
                    }
                }
            });
            employee.Days.pop();
        };
        function setData(list) {
            var from = Global.DateTime.GetObject(callerOptions.From, 'dd/MM/yyyy HH:mm'),
                to = Global.DateTime.GetObject(callerOptions.To, 'dd/MM/yyyy HH:mm');
            
            list.each(function () {
                this.Days = getDates(from, to);
                setWeekend(this);
                setEmployeeShift(this);
                setLeaveItem(this);
                setOverTime(this);
                setLateEntry(this);
                setAttendance(this);
            });
            console.log(new Date().getTime());
            console.log(list);
        };
        function rowBound(elm) {

        };
        function onDataBinding(response) {
            console.log(new Date().getTime());
            employees = [];
            var obj = {};
            response.Data[1].each(function () {
                obj[this.Id] = this;
                this.Weekend = { List: [], Count: 0 };
                this.LeaveItem = { List: [], Items:[] };
                this.EmployeeShift = { List: [], Items: [] };
                this.Attendance = { List: [], Items: [] };
                this.OverTime = { List: [], Items: [] };
                this.LateEntry = { List: [], Items: [] };
                employees.push(this);
            });
            response.Data[0].each(function () {
                obj[this.EmployeeId] = obj[this.EmployeeId]||[];
                obj[this.EmployeeId].SalaryItem = this;
            });
            response.Data[2].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].Weekend.List.push(this);
                }
            });
            response.Data[3].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].LeaveItem.List.push(this);
                }
            });
            response.Data[4].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].EmployeeShift.List.push(this);
                }
            });
            response.Data[5].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].Attendance.List.push(this);
                }
            });
            response.Data[6].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].OverTime.List.push(this);
                }
            });
            response.Data[7].each(function () {
                if (obj[this.EmployeeId]) {
                    obj[this.EmployeeId].LateEntry.List.push(this);
                }
            });
            setData(employees);
        };
        function getOptions() {
            var opts = {
                Name: 'Attendances',
                Grid: {
                    elm: windowModel.View.find('#attendance_grid'),
                    columns: [
                        { field: 'Employee', filter: true, Add: false },
                        { field: 'InterAt', dateFormat: 'HH:mm' },
                        { field: 'OutAt', dateFormat: 'HH:mm' },
                        { field: 'Duration', Add: false },
                        { field: 'LateDuration', Add: false },
                        { field: 'Date', dateFormat: 'dd/MM/yyyy', Add: false },
                        { field: 'Comments', filter: true, Add: { type: 'textarea', sibling: 1 } },
                    ],
                    url: '/SalaryArea/Salary/GetSheetDetails',
                    page: page,
                    onrequest: function (model) {
                        model.From = page.from;
                        model.To = page.to;
                    },
                    onDataBinding: onDataBinding,
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#print_container');
                        }
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: {
                    elm: windowModel.View.find('#btn_add_new_attendance'),
                    onSubmit: onSubmit,
                    save: '/AttendanceArea/Attendance/OnCreate',
                    saveChange: '/AttendanceArea/Attendance/Edit'
                },
                Edit: false,
                remove: { save: '/AttendanceArea/Attendance/Delete' }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (callerOptions.model.Id != userId) {
                gridModel.Reload();
            }
            userId = callerOptions.model.Id;
        };
    }).call(service.Attendance = {});
};