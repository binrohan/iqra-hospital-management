var Controller = new function () {
    var that = this, service = {}, mntDPR, options, formModel = { Summary: { Top: {}, Bottom: {}}}, defaultSalary = 0, windowModel, formInputs, drp = {};
    function setBonusList(model) {
        model.BonusList = [];
        service.Model.Bonus.Items.each(function () {
            model.BonusList.push({ Id: this.Id, Amount: this.Amount });
        });
    };
    function setLoanList(model) {
        model.LoanList = [];
        service.Model.Loan.Items.each(function () {
            model.LoanList.push({ Id: this.Id, Amount: this.Amount });
        });
    };
    function setAdvanceList(model) {
        model.AdvanceList = [];
        service.Model.Advance.Items.each(function () {
            model.AdvanceList.push({ Id: this.Id, Amount: (this.Amount - this.RePayment) });
        });
    };
    function getModel() {
        var model = {};

        model.From = formModel.From;
        model.To = formModel.To;
        model.EmployeeId = service.Model.EmployeeDetails.Id;
        model.DesignationId = service.Model.EmployeeDetails.DesignationId;
        model.SalaryId = service.Model.EmployeeDetails.SalaryId;
        model.Basic = service.Model.EmployeeDetails.Salary;
        model.WorkingHour = service.Model.WorkingDay.Minutes.div(60);
        model.Attended = service.Model.Attendance.FormModel.TotalValue;
        model.AttendedHour = service.Model.Attendance.FormModel.Hour;
        model.Leave = service.Model.LeaveItem.FormModel.TotalValue;
        model.LeaveHour = service.Model.LeaveItem.FormModel.Hour;
        model.LateEntry = service.Model.LateEntry.FormModel.TotalValue;
        model.LateEntryHour = service.Model.LateEntry.FormModel.Hour;
        model.Absent = service.Model.Absent.FormModel.TotalValue;
        model.AbsentHour = service.Model.Absent.FormModel.Hour;
        model.OverTime = service.Model.OverTime.FormModel.TotalValue;
        model.OverTimeHour = service.Model.OverTime.FormModel.Hour;
        model.ScheduledBonus = service.Model.Bonus.FormModel.TotalValue;
        model.Loan = service.Model.Loan.FormModel.TotalValue;
        model.Advance = service.Model.Advance.FormModel.TotalValue;
        model.Bonus = service.Model.Allowance.FormModel.TotalValue;
        model.Deduction = service.Model.Deduction.FormModel.TotalValue;
        model.WorkingDays = service.Model.WorkingDay.Count;
        model.NetPayable = service.Model.Payable.Total;

        model.Year = formModel.Year;
        model.Month = formModel.Month;
        model.Remarks = formModel.Remarks;
        setBonusList(model);
        setLoanList(model);
        setAdvanceList(model);
        return model;
    };
    function getSummaryModel() {
        return {
            Employee: { EmployeeCount: 0 },
            LeaveItem: { LeaveItemHour: 0, LeaveItemDay: 0, LeaveItemTotal: 0 },
            WorkingDay: { AttendanceHour: 0, AttendanceDay: 0, AttendanceTotal: 0 },
            Attendance: { AttendanceHour: 0, AttendanceDay: 0, AttendanceTotal: 0 },
            OverTime: { OverTimeHour: 0, OverTimeDay: 0, OverTimeTotal: 0 },
            LateEntry: { LateEntryHour: 0, LateEntryDay: 0, LateEntryTotal: 0 },
            Bonus: { BonusDay: 0, BonusTotal: 0 },
            Loan: { LoanDay: 0, LoanTotal: 0 },
            Advance: { AdvanceTotal: 0 },
            Absent: { AbsentHour: 0, AbsentDay: 0, AbsentTotal: 0 },
            Allowance: { AllowanceTotal: 0 },
            Deduction: { DeductionTotal: 0 },
            Payable: { PayableTotal: 0 }
        };
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/SalaryArea/SalaryPayment/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    //options.onSaveSuccess(formModel, formInputs);
                    cancel();
                } else {
                    alert('Errors.');
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert('Errors.');
            }, { SalaryPayment: model, AutoSalaryPayment: formModel.AutoPayment }, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function populate(model) {
        windowModel.Free();
        for (var key in formModel) {
            formModel[key] = model[key] || '';
        }
        if (drp.val) {
            drp.val(model.DesignationId);
        } else {
            drp.selectedValue = model.DesignationId;
        }
        if (model.OwnSalary) {
            formModel.IsDefaultSalary = false;
            formModel.Salary = model.OwnSalary;
            $(formInputs['Salary']).prop('disabled', false);
        } else {
            formModel.Salary = model.DesignationSalary;
            $(formInputs['Salary']).prop('disabled', true);
            formModel.IsDefaultSalary = true;
        }
        formModel.CurrentSalary = formModel.Salary;
    };
    function onDropDownChange(data) {
        if (data) {
            var from = data.Date,
                to = new Date(data.Date);

            to.setMonth(to.getMonth() + 1);
            to.setDate(0);
            console.log([from, to]);
            service.Loader.Load(from, to, function () {
                formModel.From = from.format('yyyy/MM/dd 00:00');
                formModel.To = to.format('yyyy/MM/dd 00:00');
                formModel.Year = from.getFullYear();
                formModel.Month = from.getMonth() + 1;
                formModel.AutoPayment = getModel();
            });
        }
    };
    function show(model) {
        windowModel.Show();
        console.log(['show(model)', model]);
        service.Loader.Load(model.From, model.To, function () {
            formModel.From = model.From.format('yyyy/MM/dd 00:00');
            formModel.To = model.To.format('yyyy/MM/dd 00:00');
            formModel.Year = model.From.getFullYear();
            formModel.Month = model.From.getMonth() + 1;
            //formModel.AutoPayment = getModel();
        });
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '99%' });
        windowModel.View.find('#footer_container').html(windowModel.View.find('#summary_container').html());
        Global.Form.Bind(formModel.Summary.Top, windowModel.View.find('#summary_container'));
        Global.Form.Bind(formModel.Summary.Bottom, windowModel.View.find('#footer_container'));
        windowModel.View.find('.btn_cancel').click(cancel);
        windowModel.View.find('.btn_save').click(save);
        show(options);
        //bindAutoComplete();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/SalaryArea/Templates/Salary/GenerateSalarySheet.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var selfService = {};
        function getDates(from, to) {
            var list = [];
            from = new Date(from);
            for (; from <= to;) {
                list.push({ Date: new Date(from), Time: from.getTime() });
                from.setDate(from.getDate() + 1);
            }
            return list;
        };
        function setDates(models, from, to) {
            var list = [];
            // && (models[key].EmployeeDetails.Id == '3bd014ba-ea54-4cf4-910f-b08023f484c6')
            for (var key in models) {
                if (models[key].EmployeeDetails && models[key].EmployeeDetails.Name) {
                    models[key].Days = getDates(from, to);
                    list.push(models[key]);
                } else {
                    //console.log(['models[key].EmployeeDetails.Name', models[key].EmployeeDetails.Name]);
                }
            }
            return list;
        };
        function setWeekend(list) {
            var weekends = {}, employee;
            list.each(function () {
                weekends = {};
                employee = this;
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
            });
        };
        function setEmployeeShift(list) {
            var startAt, endAt, model, employee;
            list.each(function () {
                employee = this;
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
                    //console.log([this, new Date(this.StartAtTime), new Date(this.EndAtTime)]);
                    employee.EmployeeShift.Duration = 0;
                    employee.Days.each(function () {
                        this.EmployeeShift = this.EmployeeShift || { Item: [], Duration: 0, StartAt: 9999999999999, EndAt: 0 };
                        if (!this.IsWeekend && this.Date >= shiftModel.ActivateAt && this.Date <= shiftModel.ActiveTo && this.Date.getDate() >= shiftModel.StartDayOfMonth && this.Date.getDate() <= shiftModel.EndDayOfMonth) {
                            model = {
                                StartAt: this.Time + shiftModel.StartAtTime,
                                EndAt: this.Time + shiftModel.EndAtTime,
                                Id: shiftModel.Id
                            };
                            this.EmployeeShift.StartAt = Math.min(this.EmployeeShift.StartAt, model.StartAt);
                            this.EmployeeShift.EndAt = Math.max(this.EmployeeShift.EndAt, model.EndAt);
                            //console.log([this.Time, shiftModel.StartAtTime, this.Time + shiftModel.StartAtTime, new Date(this.EmployeeShift.StartAt), new Date(this.EmployeeShift.EndAt)]);
                            this.EmployeeShift.Item.push(model);
                            this.EmployeeShift.Duration += shiftModel.Duration;
                            employee.EmployeeShift.Duration += shiftModel.Duration;
                        }
                    });
                });
            });
        };
        function setWorkingDay(list) {
            var weekends = {}, employee;
            list.each(function () {
                employee = this;
                employee.WorkingDay.Count = 0;
                employee.Days.each(function () {
                    if (!this.IsWeekend && this.EmployeeShift) {
                        employee.WorkingDay.Count++;
                        employee.WorkingDay.Minutes += this.EmployeeShift.Duration;
                        employee.WorkingDay.List.push({ Date: this, Duration: this.EmployeeShift.Duration });
                    }
                });
                if (employee.WorkingDay.Count > 0) {
                    employee.WorkingDay.DailyMinutes = employee.WorkingDay.Minutes.div(employee.WorkingDay.Count);
                    employee.WorkingDay.DailyHours = employee.WorkingDay.DailyMinutes.div(60);
                } else {
                    employee.WorkingDay.DailyMinutes = 0;
                    employee.WorkingDay.DailyHours = 0;
                }
            });
        };
        function setAbsentDay(list) {
            var weekends = {}, employee, duration = 0, data = { Attendance: 0, LeaveItem: 0, LateEntry: 0 };
            list.each(function () {
                weekends = {}, duration = 0, data = { Attendance: 0, LeaveItem: 0, LateEntry: 0 }
                employee = this;
                employee.Absent.Count = 0;
                employee.Days.each(function () {
                    if (!this.IsWeekend && this.EmployeeShift) {
                        duration = this.EmployeeShift.Duration;
                        if (this.Attendance) {
                            data.Attendance += this.Attendance.Duration;
                            duration -= this.Attendance.Duration;
                        }
                        if (this.LeaveItem) {
                            data.LeaveItem += this.LeaveItem.Duration;
                            duration -= this.LeaveItem.Duration;
                        }
                        if (this.LateEntry) {
                            data.LateEntry += this.LateEntry.Duration;
                            duration -= this.LateEntry.Duration;
                        }
                        if (duration > 0) {
                            employee.Absent.Count++;
                            employee.Absent.Minutes += duration;
                            employee.Absent.List.push({ Date: this, Duration: duration });
                        }
                    }
                });
            });
        };
        function setData(models, from, to) {
            var list = service.ModelList = setDates(models, from, to);
            service.SummaryModel.Employee.EmployeeCount = service.ModelList.length;
            setWeekend(list);
            setEmployeeShift(list);
            setWorkingDay(list);
            selfService.LeaveItem.Set(list);
            selfService.OverTime.Set(list);
            selfService.LateEntry.Set(list);
            selfService.Attendance.Set(list);
            selfService.Bonus.Set(list);
            selfService.Advance.Set(list);
            setAbsentDay(list);
            service.View.Create(list);
        };
        function getEmptyMode() {
            return {
                Weekend: { List: [], Count: 0 },
                LeaveItem: { List: [], Items: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                EmployeeShift: { List: [], Items: [] },
                WorkingDay: { List: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                Attendance: { List: [], Items: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                OverTime: { List: [], Items: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                LateEntry: { List: [], Items: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                Bonus: { List: [], Items: [], Count: 0, Total: 0 },
                Loan: { List: [], Items: [], Count: 0, Total: 0 },
                Advance: { List: [], Items: [], Count: 0, Total: 0 },
                Absent: { List: [], Count: 0, Minutes: 0, HourlyRate: 0, Total: 0 },
                Allowance: { Total: 0 },
                Deduction: { Total: 0 },
                EmployeeDetails: { Total: 0 },
                LateEntrySetting: { List: [], Items: [], Count: 0, Total: 0 },
                OverTimeApplication: { List: [], Items: [], Count: 0, Total: 0 },
                EmployeeLoanRepayment: { List: [], Items: [], Count: 0, Total: 0 },
                Payable: { Total: 0, FormModel: {} }
            }
        };
        (function () {
            function setPartOfDay(employee, attendance, day) {
                if (!day.IsWeekend) {
                    attendance.Duration = 0;
                    day.EmployeeShift.Item.each(function () {
                        if (attendance.StartAtTime < this.EndAt && attendance.EndAtTime > this.StartAt) {
                            attendance.Duration += (Math.min(this.EndAt, attendance.EndAtTime) - Math.max(attendance.StartAtTime, this.StartAt)) / 60000;
                        }
                    });
                    //console.log([attendance.Duration, day.Date, day, attendance]);
                    employee.Attendance.Minutes += attendance.Duration;
                    day.Attendance.Duration += attendance.Duration;
                    employee.Attendance.Count += (attendance.Duration / day.EmployeeShift.Duration).toFloat();
                }
            };
            function setFullDay(employee, attendance, day) {
                if (!day.IsWeekend) {
                    day.FullDayPresant = true;
                    employee.Attendance.Count++;
                    employee.Attendance.Minutes += day.EmployeeShift.Duration;
                    day.Attendance.Duration += attendance.Duration = day.EmployeeShift.Duration;
                }
            };
            function setData(employee, attendance, item) {
                item.Attendance.Item.push(attendance);
                if (attendance.StartAtTime <= item.EmployeeShift.StartAt && attendance.EndAtTime >= item.EmployeeShift.EndAt) {
                    setFullDay(employee, attendance, item);
                } else {
                    setPartOfDay(employee, attendance, item);
                }
            };
            this.Set = function (list) {
                var ln, item;
                list.each(function () {
                    employee = this;
                    ln = employee.Days.length;
                    item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    employee.Days.push(item);
                    employee.Attendance.Count = 0;
                    employee.Attendance.List.each(function () {
                        attendance = this;
                        this.InterAt = Global.DateTime.GetObject(this.Date + ' ' + this.InterAt, 'MM/dd/yyyy HH:mm');
                        this.OutAt = Global.DateTime.GetObject(this.Date + ' ' + this.OutAt, 'MM/dd/yyyy HH:mm');
                        this.StartAtTime = this.InterAt.getTime();
                        this.EndAtTime = this.OutAt.getTime();
                        for (var i = 0; i < ln; i++) {
                            item = employee.Days[i];
                            item.Attendance = item.Attendance || { Item: [], Duration: 0 };
                            if (item.Date <= attendance.InterAt && employee.Days[i + 1].Date > attendance.InterAt) {
                                setData(employee, attendance, item);
                            }
                        }
                    });
                    employee.Days.pop();
                });
            };
        }).call(selfService.Attendance = {});
        (function () {
            function set(employee, overTime, item, nextDay) {
                item.OverTime = item.OverTime || { Item: [], Duration: 0 };
                if (item.Date <= overTime.StartAt && nextDay.Date > overTime.StartAt) {
                    employee.OverTime.Items.push(item);
                    item.OverTime.Item.push(overTime);
                    employee.OverTime.Duration += overTime.ApprovedDuration;
                    item.OverTime.Duration += overTime.ApprovedDuration;
                    employee.OverTime.Minutes += overTime.ApprovedDuration;
                }
            };
            this.Set = function (list) {
                var ln , item;
                list.each(function () {
                    employee = this;
                    ln = employee.Days.length;
                    item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    employee.Days.push(item);
                    employee.OverTime.Duration = 0;
                    employee.OverTime.List.each(function () {
                        overTime = this;
                        this.StartAt = this.StartAt.getDate();
                        this.EndAt = this.EndAt.getDate();
                        for (var i = 0; i < ln; i++) {
                            item = employee.Days[i];
                            set(employee, overTime, item, employee.Days[i + 1])
                        }
                    });
                    employee.Days.pop();
                });
            };
            this.WeekendOverTime = function (employee, attendance, day) {

            };
        }).call(selfService.OverTime = {});
        (function () {
            function setPartDay(employee, leaveItem, day) {
                leaveItem.Duration = 0;
                day.EmployeeShift.Item.each(function () {
                    if (leaveItem.StartAtTime < this.EndAt && leaveItem.EndAtTime > this.StartAt) {
                        leaveItem.Duration += (Math.min(this.EndAt, leaveItem.EndAtTime) - Math.max(leaveItem.StartAtTime, this.StartAt));
                    }
                });
                day.LeaveItem.Duration = leaveItem.Duration = leaveItem.Duration / 60000;
                employee.LeaveItem.Minutes += leaveItem.Duration;
                employee.LeaveItem.Count += day.LeaveItem.Count = (leaveItem.Duration / day.EmployeeShift.Duration).toFloat();
            };
            function setFullDay(employee, leaveItem, day) {
                day.FullDayLeave = true;
                employee.LeaveItem.Count++;
                employee.LeaveItem.Minutes += day.EmployeeShift.Duration;
                leaveItem.Duration = day.LeaveItem.Duration = day.EmployeeShift.Duration;
            };
            function set(employee, leaveItem, day, nextDay) {
                day.LeaveItem = day.LeaveItem || { Item: [], Duration: 0, Count: 0 };
                if (day.Date <= leaveItem.StartAt && nextDay.Date > leaveItem.StartAt) {
                    employee.LeaveItem.Items.push(day);
                    day.LeaveItem.Item.push(leaveItem);
                    if (leaveItem.StartAtTime <= day.EmployeeShift.StartAt && leaveItem.EndAtTime >= day.EmployeeShift.EndAt) {
                        setFullDay(employee, leaveItem, day)
                    } else if (day.EmployeeShift.Duration > 0) {
                        setPartDay(employee, leaveItem, day);
                    }
                }
            };
            this.Set = function (list) {
                var ln , item ;
                list.each(function () {
                    employee = this;
                    ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
                    item.Date.setDate(item.Date.getDate() + 1);
                    employee.Days.push(item);
                    employee.LeaveItem.Count = 0
                    employee.LeaveItem.List.each(function () {
                        leaveItem = this;
                        this.StartAt = this.StartAt.getDate();
                        this.EndAt = this.EndAt.getDate();
                        this.StartAtTime = this.StartAt.getTime();
                        this.EndAtTime = this.EndAt.getTime();
                        for (var i = 0; i < ln; i++, i) {
                            item = employee.Days[i];
                            set(employee, leaveItem, item, employee.Days[i + 1]);
                        }
                    });
                    employee.Days.pop();
                });
            };
        }).call(selfService.LeaveItem = {});
        (function () {
            function setHourlyRate(employee, lateEntry, day, setting) {
                lateEntry.Amount = 0;
                employee.LateEntrySetting.List.each(function () {
                    if (!lateEntry.Setting && this.StartAt < lateEntry.EndAt && this.EndAt > lateEntry.StartAt) {
                        lateEntry.Setting = this;
                    }
                });
                if (lateEntry.Setting) {
                    lateEntry.Setting.RoundBy = lateEntry.Setting.RoundBy == 0 ? 1 : lateEntry.Setting.RoundBy;
                    lateEntry.Duration = (Math.ceil((lateEntry.Duration - (lateEntry.Setting.Duration || 0)) / lateEntry.Setting.RoundBy) * lateEntry.Setting.RoundBy);
                    if (lateEntry.Setting.Type == 0) {
                        lateEntry.Amount = (employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes) * lateEntry.Duration;
                    } else if (lateEntry.Setting.Type == 1) {
                        lateEntry.Amount = (employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes) * lateEntry.Duration * lateEntry.Setting.Value;
                    } else if (lateEntry.Setting.Type == 2) {
                        lateEntry.Amount = lateEntry.Duration * lateEntry.Setting.Value;
                    } else if (lateEntry.Setting.Type == 3) {
                        setting.SlotCount++;
                        if (setting.SlotCount == lateEntry.Setting.SlotLimit) {
                            setting.SlotCount = 0;
                            lateEntry.Duration = (employee.WorkingDay.Minutes / employee.WorkingDay.Count) * lateEntry.Setting.Value;
                        }
                        lateEntry.Amount = lateEntry.Duration * (employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes);
                    }
                }
            };
            function set(employee, lateEntry, day, nextDay, setting) {
                day.LateEntry = day.LateEntry || { Item: [], Duration: 0 };
                if (day.Date <= lateEntry.EndAt && nextDay.Date > lateEntry.EndAt) {
                    //console.log(['set(employee, lateEntry, day,nextDay)', lateEntry.EndAt, lateEntry.StartAt]);
                    setHourlyRate(employee, lateEntry, day);
                    employee.LateEntry.Items.push(day);
                    day.LateEntry.Item.push(lateEntry);
                    employee.LateEntry.Count++;
                    day.LateEntry.Duration += lateEntry.Duration;
                    employee.LateEntry.Minutes += lateEntry.Duration;
                    employee.LateEntry.Total += lateEntry.Amount;
                }
            };
            this.Set = function (list) {
                setting = {};
                var ln, duration, item, dics;
                list.each(function () {
                    employee = this;
                    setting = { SlotCount: 0 };
                    ln = employee.Days.length, duration = 0, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) }, dics = {};
                    item.Date.setDate(item.Date.getDate() + 1);
                    employee.Days.push(item);
                    employee.LateEntry.Count = 0;
                    employee.LateEntry.List.each(function () {
                        lateEntry = this;
                        this.StartAt = this.EntryTime.getDate();
                        this.EndAt = this.EnterAt.getDate();
                        this.StartAtTime = this.StartAt.getTime();
                        this.EndAtTime = this.EndAt.getTime();
                        if (this.Status == 1 || this.Status == 2) {
                            for (var i = 0; i < ln; i++) {
                                item = employee.Days[i];
                                set(employee, lateEntry, item, employee.Days[i + 1], setting);
                            }
                        }
                    });
                    employee.Days.pop();
                });
            };
        }).call(selfService.LateEntry = {});
        (function () {
            this.Set = function (list) {
                var bonus;
                list.each(function () {
                    employee = this;
                    employee.Bonus.Count = 0;
                    employee.Bonus.List.each(function () {
                        bonus = this;
                        if (this.Status == 0) {
                            employee.Bonus.Count++;
                            employee.Bonus.Total += this.Amount;
                            employee.Bonus.Items.push(this);
                        }
                    });
                });
            };
        }).call(selfService.Bonus = {});
        (function () {
            this.Set = function (list) {
                var bonus;
                list.each(function () {
                    employee = this;
                    employee.Advance.Count = 0;
                    employee.Advance.List.each(function () {
                        bonus = this;
                        if (this.Status < 2) {
                            employee.Advance.Count++;
                            employee.Advance.Total += (this.Amount - this.RePayment);
                            employee.Advance.Items.push(this);
                        }
                    });
                });
            };
        }).call(selfService.Advance = {});
        this.Load = function (from, to, func) {
            console.log(['from, to, func', from, to, func]);
            Global.CallServer('/SalaryArea/Salary/UserSheet?userId=00000000-0000-0000-0000-000000000000&from=' + from.format('yyyy-MM-dd 00:00') + '&to=' + to.format('yyyy-MM-dd 00:00'), function (response) {
                if (!response.IsError) {
                    var models = service.Models = {}, model, dic = {}, defaultLateSetting = [], stng;
                    service.SummaryModel = getSummaryModel();
                    response.Data[0].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].Weekend.List.push(this);
                    });
                    response.Data[1].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].LeaveItem.List.push(this);
                    });
                    response.Data[2].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].EmployeeShift.List.push(this);
                    });
                    response.Data[3].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].Attendance.List.push(this);
                    });
                    response.Data[4].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].OverTime.List.push(this);
                    });
                    response.Data[5].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].LateEntry.List.push(this);
                    });
                    response.Data[6].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].Bonus.List.push(this);
                    });
                    response.Data[7].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].Advance.List.push(this);
                    });
                    response.Data[8].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].Loan.List.push(this);
                    });
                    response.Data[10].orderBy('IsDefault', true).each(function () {
                        this.StartDate = this.StartAt = this.StartDate.getDate();
                        this.EndDate = this.EndAt = this.EndDate.getDate();
                        dic[this.RelativeId] = this.IsDefault;
                        this.IsDefault === 0 && defaultLateSetting.push(this);
                    });
                    response.Data[9].each(function () {
                        model = models[this.Id] = models[this.Id] || getEmptyMode();
                        model.EmployeeDetails = this;
                        model.Name = this.Name;
                        model.LateEntrySetting.List = defaultLateSetting.slice();
                        stng = dic[this.Id] || dic[this.DesignationId];
                        stng && model.LateEntrySetting.List.push(stng);
                    });
                    response.Data[11].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].OverTimeApplication.List.push(this);
                    });
                    response.Data[12].each(function () {
                        models[this.EmployeeId] = models[this.EmployeeId] || getEmptyMode();
                        models[this.EmployeeId].EmployeeLoanRepayment.List.push(this);
                    });
                    console.log(['models', models]);
                    setData(models, from, to);
                    func();
                } else {
                    //error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                //error.Save(response, saveUrl);
            }, null, 'Get');
        };
    }).call(service.Loader = {});
    (function () {
        var container, gridModel, changer = { onDayChange: onDayChange, onHourChange: onHourChange, onHourlyRateChange: onHourlyRateChange, onTotalChange: onTotalChange };
        function getFloat(value) {
            return parseFloat(value || '0') || 0;
        };
        function populateSummary() {
            var model = service.SummaryModel;
            for (var itm in model) {
                for (var key in model[itm]) {
                    formModel.Summary.Top[key] = formModel.Summary.Bottom[key] = (model[itm][key] || 0).toMoney();
                }
            }
        };
        function setSummary() {
            var model = service.SummaryModel = getSummaryModel();
            service.ModelList.each(function () {
                model.Attendance.AttendanceHour += this.Attendance.Hour;
                model.Attendance.AttendanceDay += this.Attendance.Count;
                model.Attendance.AttendanceTotal += this.Attendance.Total;

                model.LeaveItem.LeaveItemHour += this.LeaveItem.Hour;
                model.LeaveItem.LeaveItemDay += this.LeaveItem.Count;
                model.LeaveItem.LeaveItemTotal += this.LeaveItem.Total;

                model.LateEntry.LateEntryHour += this.LateEntry.Hour;
                model.LateEntry.LateEntryDay += this.LateEntry.Count;
                model.LateEntry.LateEntryTotal += this.LateEntry.Total;

                model.Absent.AbsentHour += this.Absent.Hour;
                model.Absent.AbsentDay += this.Absent.Count;
                model.Absent.AbsentTotal += this.Absent.Total;

                model.OverTime.OverTimeHour += this.OverTime.Hour;
                model.OverTime.OverTimeDay += this.OverTime.Count;
                model.OverTime.OverTimeTotal += this.OverTime.Total;

                model.Bonus.BonusDay += this.Bonus.Count;
                model.Bonus.BonusTotal += this.Bonus.Total;

                model.Loan.LoanDay += this.Loan.Count;
                model.Loan.LoanTotal += this.Loan.Total;

                model.Advance.AdvanceTotal += this.Advance.Total;

                model.Allowance.AllowanceTotal += this.Allowance.Total;

                model.Deduction.DeductionTotal += this.Deduction.Total;

                model.Payable.PayableTotal += this.Payable.Total;
            });
            populateSummary();
            console.log(model);
        };
        function setAbsent(model) {
            var hour = (getFloat(model.WorkingDay.FormModel.Hour || '0') -
                (getFloat(model.Attendance.FormModel.Hour || '0') +
                getFloat(model.LeaveItem.FormModel.Hour || '0') +
                getFloat(model.LateEntry.FormModel.Hour || '0'))),
                formModel = model.Absent.FormModel;

            formModel.Hour = model.Absent.Hour = hour;
            formModel.TotalValue = model.Absent.Total = getFloat(model.Absent.HourlyRate || '0').mlt(hour);
            formModel.Total = formModel.TotalValue.toMoney();
        };
        function onChange(formModel,model,hasChanged) {
            setAbsent(model);
            model.Payable.FormModel.Total = model.Payable.Total = Math.ceil(model.EmployeeDetails.Salary -
                model.LateEntry.FormModel.TotalValue -
                model.Absent.FormModel.TotalValue +
                model.Bonus.FormModel.TotalValue +
                model.OverTime.FormModel.TotalValue +
                model.Allowance.FormModel.TotalValue -
                model.Deduction.FormModel.TotalValue -
                model.Advance.FormModel.TotalValue -
                model.Loan.FormModel.TotalValue);
            if (hasChanged !== false) {
                setSummary(formModel, model);
            }
        };
        function isValid(model) {
            return (getFloat(model.Attendance.FormModel.Hour) +
                getFloat(model.LeaveItem.FormModel.Hour) +
                getFloat(model.LateEntry.FormModel.Hour)) < getFloat(model.WorkingDay.FormModel.Hour);
        };
        function getMaxHours(hours, model) {
            return getFloat(model.WorkingDay.FormModel.Hour) - ((getFloat(model.Attendance.FormModel.Hour) +
                getFloat(model.LeaveItem.FormModel.Hour) +
                getFloat(model.LateEntry.FormModel.Hour)) - hours);
        };
        function onTotalChange(formModel, handler, model, itmModel) {
            formModel.TotalValue = itmModel.Total = (getFloat(formModel.Total || '0') || 0).toFloat();
            if (itmModel.HourlyRate > 0) {
                formModel.Hour = itmModel.Hour = itmModel.Total.div(itmModel.HourlyRate);
                if (model.WorkingDay.DailyHours) {
                    formModel.Day = itmModel.Count = itmModel.Hour.div(model.WorkingDay.DailyHours);
                }
            }
            onChange(formModel, model);
        };
        function onDayChange(formModel, handler, model, itmModel) {
            console.log([formModel, handler, model]);
            var rate = itmModel.HourlyRate|| getFloat(formModel.HourlyRate || '0') || 0,
                day = getFloat(formModel.Day || '0') || 0,
                hour = parseInt(day.mlt(model.WorkingDay.DailyHours)),
                    prevHour = formModel.Hour;
            formModel.Hour = itmModel.Hour = hour;
            itmModel.Count = day;
            if (!isValid(model)) {
                hour = getMaxHours(hour,model);
                formModel.Hour = hour;
                formModel.Day = parseInt(hour.div(model.WorkingDay.DailyHours), 10);
            }
            formModel.TotalValue = itmModel.Total = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel, model);
        };
        function onHourlyRateChange(formModel, handler, model, itmModel) {
            var rate = itmModel.HourlyRate = getFloat(formModel.HourlyRate || '0') || 0,
                hour = getFloat(formModel.Hour || '0') || 0;

            formModel.TotalValue = itmModel.Total = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel, model);
        };
        function onHourChange(formModel, handler, model, itmModel) {
            var rate = itmModel.HourlyRate || getFloat(formModel.HourlyRate || '0') || 0,
                hour = itmModel.Hour = getFloat(formModel.Hour || '0') || 0;
            console.log([rate, hour]);
            if (!isValid(model)) {
                hour = getMaxHours(hour, model);
                formModel.Hour = hour;
                //alert('Invalid Val');
            }
            formModel.TotalValue = itmModel.Total = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel, model);
        };
        function setFunc(key, inputs, formModel, handler, model, itmModel) {
            handler = handler || {};
            handler.PrevModel = handler.PrevModel || {};
            $(inputs[key]).keydown(function () {
                handler.PrevModel[key] = this.value;
            }).keyup(function () {
                if (formModel[key] != handler.PrevModel[key]) {
                    (handler['on' + key + 'Change'] || changer['on' + key + 'Change']).call(this, formModel, handler, model, itmModel);
                }
            });
        };
        function getColumn(dic, name, cls) {
            return '<div class="input-group ' + cls + '">' +
                        (dic[name] ?
                        '<span data-binding="' + name + '" class="field auto_bind"></span>' :
                        '<input required type="text" data-type="float" data-binding="' + name + '" class="field" />') +
                    '</div>'
        };
        function getRow(container, model, handler, dic, baseModel) {
            dic = dic || { Total: true };

            var elm = $('<div>' +
                getColumn(dic, 'Day', 'day_container') +
                getColumn(dic, 'Hour', 'hour_container') +
                getColumn(dic, 'HourlyRate', 'hourly_rate_container') +
                getColumn(dic, 'Total', 'total_container') +
            '</div>');
            model.Elm = elm;
            model.FormModel = model.FormModel || {};
            var inputs = Global.Form.Bind(model.FormModel, elm, model);
            for (var key in inputs) {
                setFunc(key, inputs, model.FormModel, handler, baseModel,model);
            }
            container.empty().append(elm);
            return inputs;
        };
        function getAllowance(container, model, handler, baseModel) {
            var elm = $('<div>' +
                '<div class="input-group">' +
                        '<input required type="text" data-binding="Total" class="field" data-type="float">' +
                    '</div>' +
            '</div>');
            model.Elm = elm;
            model.FormModel = model.FormModel || {};
            var inputs = Global.Form.Bind(model.FormModel, elm);
            for (var key in inputs) {
                //(key === 'Day' || key === 'Hour') &&
                setFunc(key, inputs, model.FormModel, handler, baseModel, model);
            }
            container.empty().append(elm);
        };
        (function () {
            //(employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes)
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.WorkingDay;
                dataModel.FormModel = _formModel;
                var inputs = getRow(container, dataModel, this, { Day: true, Hour: true, HourlyRate: true, Total: true }, model);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = dataModel.Hour = parseInt(dataModel.Minutes / 60);
                //(!model.EmployeeDetails.Salary) && console.log(['model.EmployeeDetails.Salary', model]);
                _formModel.Total = model.EmployeeDetails.Salary.toMoney();
                if (dataModel.Hour > 0) {
                    _formModel.HourlyRate = (model.EmployeeDetails.Salary.div(dataModel.Hour)).toMoney();
                }
                else {
                    _formModel.HourlyRate = 0;
                }
            };
        }).call(this.WorkingDay = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Attendance;
                dataModel.FormModel = _formModel;
                getRow(container, dataModel, this, {}, model);

                var hours = parseInt(dataModel.Minutes / 60);
                _formModel.Day = dataModel.Count.toFloat();
                _formModel.Hour = dataModel.Hour = hours;
                if (model.WorkingDay.Hour > 0) {
                    dataModel.HourlyRate = model.EmployeeDetails.Salary.div(model.WorkingDay.Hour);
                    _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                    _formModel.TotalValue = dataModel.Total = (dataModel.HourlyRate * hours).toFloat();
                    _formModel.Total = _formModel.TotalValue.toMoney();
                } else {
                    dataModel.HourlyRate = 0;
                    _formModel.HourlyRate = 0;
                    _formModel.TotalValue = 0;
                    _formModel.Total = dataModel.Total = 0;
                }
                service.SummaryModel.Attendance.AttendanceHour += hours;
                service.SummaryModel.Attendance.AttendanceDay += dataModel.Count;
                service.SummaryModel.Attendance.AttendanceTotal += _formModel.TotalValue;
            };
        }).call(this.Attendance = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.LeaveItem;
                dataModel.FormModel = _formModel;
                getRow(container, dataModel, this, {}, model);
                var hours = parseInt(dataModel.Minutes / 60);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = dataModel.Hour = parseInt(dataModel.Minutes / 60);
                if (model.WorkingDay.Hour > 0) {
                    dataModel.HourlyRate = model.EmployeeDetails.Salary.div(model.WorkingDay.Hour);
                    _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                    _formModel.TotalValue = dataModel.Total = (dataModel.HourlyRate * hours).toFloat();
                    _formModel.Total = _formModel.TotalValue.toMoney();
                } else {
                    _formModel.HourlyRate = 0;
                    _formModel.TotalValue = 0;
                    _formModel.Total = dataModel.Total = 0;
                }
                service.SummaryModel.LeaveItem.LeaveItemHour += hours;
                service.SummaryModel.LeaveItem.LeaveItemDay += dataModel.Count;
                service.SummaryModel.LeaveItem.LeaveItemTotal += dataModel.Total;
            };
        }).call(this.LeaveItem = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.LateEntry;
                dataModel.FormModel = _formModel;
                getRow(container, dataModel, this, {}, model);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = dataModel.Hour = dataModel.Minutes.div(60);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = _formModel.TotalValue.toMoney();
                if (dataModel.Hour > 0) {
                    dataModel.HourlyRate = (dataModel.Total / dataModel.Hour);
                    _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                } else {
                    dataModel.HourlyRate = model.WorkingDay.Hour > 0 ? model.EmployeeDetails.Salary.div(model.WorkingDay.Hour) : 0;
                    _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                }

                service.SummaryModel.LateEntry.LateEntryHour += dataModel.Hour;
                service.SummaryModel.LateEntry.LateEntryDay += dataModel.Count;
                service.SummaryModel.LateEntry.LateEntryTotal += dataModel.Total;
            };
        }).call(this.LateEntry = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = { TotalValue: 0 };
                dataModel = model.Absent;
                dataModel.FormModel = _formModel;
                getRow(container, dataModel, this, { Day: true, Hour: true, HourlyRate: true, Total: true }, model);
                var hours = dataModel.Minutes.div(60);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = dataModel.Hour = hours;

                dataModel.HourlyRate = model.WorkingDay.Hour > 0 ? model.EmployeeDetails.Salary.div(model.WorkingDay.Hour) : 0;
                _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                _formModel.TotalValue = dataModel.Total = dataModel.HourlyRate.mlt(hours);
                _formModel.Total = _formModel.TotalValue.toMoney();


                service.SummaryModel.Absent.AbsentHour += hours;
                service.SummaryModel.Absent.AbsentDay += dataModel.Count;
                service.SummaryModel.Absent.AbsentTotal += dataModel.Total;
            };
        }).call(this.Absent = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.OverTime;
                dataModel.FormModel = _formModel;
                getRow(container, dataModel, this, {}, model);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = dataModel.Hour = parseInt(dataModel.Minutes / 60);
                                
                dataModel.HourlyRate = model.WorkingDay.Minutes > 0 ? model.EmployeeDetails.Salary.div(model.WorkingDay.Minutes).mlt(60) : 0;
                _formModel.HourlyRate = dataModel.HourlyRate.toMoney();

                _formModel.TotalValue =dataModel.Total= dataModel.Minutes.mlt(dataModel.HourlyRate).div(60);
                _formModel.Total = _formModel.TotalValue.toMoney();


                service.SummaryModel.OverTime.OverTimeHour += dataModel.Hour;
                service.SummaryModel.OverTime.OverTimeDay += dataModel.Count;
                service.SummaryModel.OverTime.OverTimeTotal += dataModel.Total;
            };
        }).call(this.OverTime = {});
        (function () {
            function getBonus(model, container) {
                var elm = $('<div>' +
                    getColumn({ Items: true }, 'Items', 'items') +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.empty().append(elm);
            };
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Bonus;
                dataModel.FormModel = _formModel;
                getBonus(dataModel, container);

                _formModel.Items = dataModel.Count + ' Bonuses';
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();

                service.SummaryModel.Bonus.BonusCount += dataModel.Count;
                service.SummaryModel.Bonus.BonusTotal += dataModel.Total;
            };
        }).call(this.Bonus = {});
        (function () {
            function getBonus(model, container) {
                var elm = $('<div>' +
                    getColumn({ Items: true }, 'Items', 'items') +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.empty().append(elm);
            };
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Loan;
                dataModel.FormModel = _formModel;
                getBonus(dataModel, container);

                _formModel.Items = dataModel.Count + ' Loans';
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();

                service.SummaryModel.Loan.LoanCount += dataModel.Count;
                service.SummaryModel.Loan.LoanTotal += dataModel.Total;
            };
        }).call(this.Loan = {});
        (function () {
            function getBonus(model, container) {
                var elm = $('<div>' +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.empty().append(elm);
            };
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Advance;
                dataModel.FormModel = _formModel;
                getBonus(dataModel, container);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();

                service.SummaryModel.Advance.AdvanceTotal += dataModel.Total;
            };
        }).call(this.Advance = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Allowance;
                dataModel.FormModel = _formModel;
                getAllowance(container, dataModel, this, model);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();

                service.SummaryModel.Allowance.AllowanceTotal += dataModel.Total;
            };
        }).call(this.Allowance = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Deduction;
                dataModel.FormModel = _formModel;
                getAllowance(container, dataModel, this, model);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();

                service.SummaryModel.Deduction.DeductionTotal += dataModel.Total;
            };
        }).call(this.Deduction = {});
        (function () {
            this.Create = function (model, container) {
                var dataModel, _formModel = {};
                dataModel = model.Payable = { Total: 0 };
                dataModel.FormModel = _formModel;
                var elm = $('<div>' +
                                '<div class="input-group">' +
                                        '<span data-binding="Total" class="field auto_bind"></span>' +
                                    '</div>' +
                            '</div>');
                dataModel.Elm = elm;
                dataModel.FormModel = _formModel;
                Global.Form.Bind(dataModel.FormModel, elm)
                container.empty().append(elm);
                _formModel.Total = dataModel.Total;
                service.SummaryModel.Payable.PayableTotal += dataModel.Total;
            };
        }).call(this.Payable = {});
        function rowBound(elm) {
            var td = elm.find('td');
            service.View.WorkingDay.Create(this, $(td[2]));
            service.View.Attendance.Create(this, $(td[3]));
            service.View.LeaveItem.Create(this, $(td[4]));
            service.View.LateEntry.Create(this, $(td[5]));
            service.View.Absent.Create(this, $(td[6]));
            service.View.OverTime.Create(this, $(td[7]));
            service.View.Bonus.Create(this, $(td[8]));
            service.View.Loan.Create(this, $(td[9]));
            service.View.Advance.Create(this, $(td[10]));
            service.View.Allowance.Create(this, $(td[11]));
            service.View.Deduction.Create(this, $(td[12]));
            service.View.Payable.Create(this, $(td[13]));
            onChange({},this,false);
        };
        function set(list) {
            Global.Grid.Bind({
                elm: windowModel.View.find('#data_container'),
                columns: [
                    { field: 'Index', title: 'Sr', sorting: false, width: 30 },
                    { field: 'Name', title: 'Employee' },
                    { field: 'WorkingDays', title: 'Working Days', autobind: false },
                    { field: 'Attendance', title: 'Attendance', autobind: false },
                    { field: 'Leave', title: 'Leave', autobind: false },
                    { field: 'LateEntry', title: 'Late Entry', autobind: false },
                    { field: 'Absent', title: 'Absent', autobind: false },
                    { field: 'OverTime', title: 'Over Time', autobind: false },
                    { field: 'ScheduledBonus', title: 'Bonus', autobind: false },
                    { field: 'Loan', title: 'Loan', autobind: false },
                    { field: 'AdvanceSalary', title: 'Advance', autobind: false },
                    { field: 'Allowance', title: 'Allowance', autobind: false },
                    { field: 'Deduction', title: 'Deduction',  autobind: false },
                    { field: 'Payable', title: 'Payable', autobind: false }
                ],
                dataSource: list,
                dataBinding: function (response) {
                    dataSource = response;
                },
                rowBound: rowBound,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 999999 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: false,
                onCreated: function () {
                    populateSummary();
                }
            });
        };
        this.Create = function (list) {
            if (gridModel) {
                gridModel.dataSource = list;
                gridModel.Reload();

            } else {
                set(list);
            }
        };
    }).call(service.View = {});
};

