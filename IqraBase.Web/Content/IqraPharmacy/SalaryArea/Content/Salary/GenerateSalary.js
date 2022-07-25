var Controller = new function () {
    var that = this, service = {}, mntDPR, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {};
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
        model.WorkingHour =  service.Model.WorkingDay.Minutes.div(60);
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
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/SalaryArea/SalaryPayment/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    options.onSaveSuccess(response);
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

            windowModel.Wait();
            service.Loader.Load(from, to, function () {
                windowModel.Free();
                formModel.From = from.format('yyyy/MM/dd 00:00');
                formModel.To = to.format('yyyy/MM/dd 00:00');
                formModel.Year = from.getFullYear();
                formModel.Month = from.getMonth() + 1;
                formModel.AutoPayment = getModel();
            });
        }
    };
    function bindAutoComplete() {
        mntDPR = {
            url: function () {
                return '/SalaryArea/Salary/AvailableMonth?userId=' + options.UserId;
            },
            onDataBinding: function (response) {
                var from = response.Data.LastSalary.getDate().Date(), to = response.Data.CurrentDate.getDate().Date();
                from.setDate(2);
                to.setDate(1);
                response.Data = []; console.log([to, from, to > from]);
                var i = 0;
                for (; to > from  ;) {
                    response.Data.push({ Id: to.format('dd/MM/yyyy'), Name: to.format('mmm-yyyy'), Date: new Date(to) });
                    to.setMonth(to.getMonth() - 1);
                    i++
                    if (i > 2000) {
                        console.log([to, from, to > from]);
                        break;
                    }
                }
                this.OrginalData = response.Data;
            },
            onLoad: function (opt) {
                if (opt.OrginalData && opt.page.filter[0]) {
                    var anme = opt.page.filter[0].value;
                    opt.datasource = opt.OrginalData.where('itm=>itm.Name.substring(0,' + anme.length + ').toLowerCase()==' + "'" + anme + "'");
                } else {
                    opt.datasource = none;
                }
            },
            elm: $(formInputs['SalaryOfMonth']).empty(),
            change: onDropDownChange
        };
        Global.AutoComplete.Bind(mntDPR);
    };
    function show(model) {
        windowModel.Show();
        if (mntDPR) {
            mntDPR.data = none;
            mntDPR.Reload();
        }
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        windowModel.View.find('.btn_save').click(save);
        show(options.model);
        bindAutoComplete();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/SalaryArea/Templates/Salary/GenerateSalary.html', function (response) {
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
            var startAt, endAt, model;
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
        };
        function setWorkingDay(employee) {
            var weekends = {};
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
        };
        function setAbsentDay(employee) {
            var weekends = {}, duration = 0, data = { Attendance: 0, LeaveItem: 0, LateEntry :0};
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
            console.log(['data', data, employee.Absent.Minutes, employee]);
        };
        function setData(model, from, to) {
            model.Days = getDates(from, to);
            setWeekend(model);
            setEmployeeShift(model);
            setWorkingDay(model);
            selfService.LeaveItem.Set(model);
            selfService.OverTime.Set(model);
            selfService.LateEntry.Set(model);
            selfService.Attendance.Set(model);
            selfService.Bonus.Set(model);
            selfService.Advance.Set(model);
            setAbsentDay(model);
            console.log(model);
            service.View.Create(model);
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
            this.Set = function (employee) {
                var ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
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
                        if (!item.IsWeekend) {
                            item.Attendance = item.Attendance || { Item: [], Duration: 0 };
                            if (item.Date <= attendance.InterAt && employee.Days[i + 1].Date > attendance.InterAt) {
                                setData(employee, attendance, item);
                            }
                        }
                    }
                });
                employee.Days.pop();
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
            this.Set = function (employee) {
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
                        set(employee, overTime, item, employee.Days[i + 1])
                    }
                });
                employee.Days.pop();
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
            this.Set = function (employee) {
                var ln = employee.Days.length, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) };
                item.Date.setDate(item.Date.getDate() + 1);
                employee.Days.push(item);
                employee.LeaveItem.Count = 0
                employee.LeaveItem.List.each(function () {
                    leaveItem = this;
                    this.StartAt = this.StartAt.getDate();
                    this.EndAt = this.EndAt.getDate();
                    this.StartAtTime = this.StartAt.getTime();
                    this.EndAtTime = this.EndAt.getTime();
                    for (var i = 0; i < ln; i++,i) {
                        item = employee.Days[i];
                        set(employee, leaveItem, item, employee.Days[i + 1]);
                    }
                });
                employee.Days.pop();
            };
        }).call(selfService.LeaveItem = {});
        (function () {
            var setting = { SlotCount: 0 };

            function setHourlyRate(employee, lateEntry, day) {
                lateEntry.Amount = 0;
                employee.LateEntrySetting.List.each(function () {
                    if (!lateEntry.Setting && this.StartAt < lateEntry.EndAt && this.EndAt > lateEntry.StartAt) {
                        lateEntry.Setting = this;
                    }
                });
                if (lateEntry.Setting) {
                    lateEntry.Setting.RoundBy = lateEntry.Setting.RoundBy == 0 ? 1 : lateEntry.Setting.RoundBy;
                    lateEntry.Duration = (Math.ceil((lateEntry.Duration - (lateEntry.Setting.Duration||0)) / lateEntry.Setting.RoundBy) * lateEntry.Setting.RoundBy);
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
            function set(employee, lateEntry, day,nextDay) {
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
            this.Set = function (employee) {
                setting = { SlotCount: 0 };
                var ln = employee.Days.length, duration = 0, item = { Date: new Date(employee.Days[employee.Days.length - 1].Date) }, dics = {};
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
                            if (!item.IsWeekend) {
                                set(employee, lateEntry, item, employee.Days[i + 1]);
                            }
                        }
                    }
                });
                employee.Days.pop();
            };
        }).call(selfService.LateEntry = {});
        (function () {
            this.Set = function (employee) {
                employee.Bonus.Count = 0;
                employee.Bonus.List.each(function () {
                    bonus = this;
                    if (this.Status == 0) {
                        employee.Bonus.Count++;
                        employee.Bonus.Total += this.Amount;
                        employee.Bonus.Items.push(this);
                    }
                });
            };
        }).call(selfService.Bonus = {});
        (function () {
            this.Set = function (employee) {
                employee.Advance.Count = 0;
                employee.Advance.List.each(function () {
                    bonus = this;
                    if (this.Status < 2) {
                        employee.Advance.Count++;
                        employee.Advance.Total += (this.Amount - this.RePayment);
                        employee.Advance.Items.push(this);
                    }
                });
            };
        }).call(selfService.Advance = {});
        this.Load = function (from, to,func) {
            Global.CallServer('/SalaryArea/Salary/UserSheet?userId=' + options.UserId + '&from=' + from.format('yyyy-MM-dd 00:00') + '&to=' + to.format('yyyy-MM-dd 00:00'), function (response) {
                if (!response.IsError) {
                    var model = service.Model = {
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
                        EmployeeLoanRepayment: { List: [], Items: [], Count: 0, Total: 0 }
                    };
                    response.Data[0].each(function () {
                        model.Weekend.List.push(this);
                    });
                    response.Data[1].each(function () {
                        model.LeaveItem.List.push(this);
                    });
                    response.Data[2].each(function () {
                        model.EmployeeShift.List.push(this);
                    });
                    response.Data[3].each(function () {
                        model.Attendance.List.push(this);
                    });
                    response.Data[4].each(function () {
                        model.OverTime.List.push(this);
                    });
                    response.Data[5].each(function () {
                        model.LateEntry.List.push(this);
                    });
                    response.Data[6].each(function () {
                        model.Bonus.List.push(this);
                    });
                    response.Data[7].each(function () {
                        model.Advance.List.push(this);
                    });
                    response.Data[8].each(function () {
                        model.Loan.List.push(this);
                    });
                    model.EmployeeDetails = response.Data[9][0];
                    response.Data[10].orderBy('IsDefault', true).each(function () {
                        this.StartDate = this.StartAt = this.StartDate.getDate();
                        this.EndDate = this.EndAt = this.EndDate.getDate();
                        model.LateEntrySetting.List.push(this);
                    });
                    response.Data[11].each(function () {
                        model.OverTimeApplication.List.push(this);
                    });
                    response.Data[12].each(function () {
                        model.EmployeeLoanRepayment.List.push(this);
                    });
                    setData(model, from, to);
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
        var container, changer = { onDayChange: onDayChange, onHourChange: onHourChange, onHourlyRateChange: onHourlyRateChange, onTotalChange: onTotalChange };
        function getFloat(value) {
            return parseFloat(value || '0') || 0;
        };
        function setAbsent() {
            var model = service.Model,
                hour = (getFloat(model.WorkingDay.FormModel.Hour || '0') -
                (getFloat(model.Attendance.FormModel.Hour || '0') +
                getFloat(model.LeaveItem.FormModel.Hour || '0') +
                getFloat(model.LateEntry.FormModel.Hour || '0'))),
                formModel = model.Absent.FormModel;

            formModel.Hour = hour;
            formModel.TotalValue = getFloat(model.Absent.HourlyRate || '0').mlt(hour);
            formModel.Total = formModel.TotalValue.toMoney();
        };
        function onChange(formModel) {
            var model = service.Model;
            setAbsent();
            model.Payable.FormModel.Total = model.Payable.Total = Math.ceil(model.EmployeeDetails.Salary -
                model.LateEntry.FormModel.TotalValue -
                model.Absent.FormModel.TotalValue +
                model.Bonus.FormModel.TotalValue +
                model.OverTime.FormModel.TotalValue +
                model.Allowance.FormModel.TotalValue -
                model.Deduction.FormModel.TotalValue -
                model.Advance.FormModel.TotalValue -
                model.Loan.FormModel.TotalValue);
        };
        function isValid() {
            var model = service.Model
            return (getFloat(model.Attendance.FormModel.Hour) +
                getFloat(model.LeaveItem.FormModel.Hour) +
                getFloat(model.LateEntry.FormModel.Hour)) < getFloat(model.WorkingDay.FormModel.Hour);
        };
        function getMaxHours(hours) {
            var model = service.Model
            return getFloat(model.WorkingDay.FormModel.Hour)- ((getFloat(model.Attendance.FormModel.Hour) +
                getFloat(model.LeaveItem.FormModel.Hour) +
                getFloat(model.LateEntry.FormModel.Hour))-hours);
        };
        function onTotalChange(formModel, handler) {
            formModel.TotalValue = (getFloat(formModel.Total || '0') || 0).toFloat();
            //formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel);
        };
        function onDayChange(formModel, handler) {
            var rate = getFloat(formModel.HourlyRate || '0') || 0,
                day = getFloat(formModel.Day || '0') || 0,
                hour = parseInt(day.mlt(service.Model.WorkingDay.DailyHours)),
                    prevHour = formModel.Hour;
            formModel.Hour = hour;
            if (!isValid()) {
                hour = getMaxHours(hour);
                formModel.Hour = hour;
                formModel.Day = parseInt(hour.div(service.Model.WorkingDay.DailyHours),10);
            }
            formModel.TotalValue = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel);
        };
        function onHourlyRateChange(formModel, handler) {
            var rate = getFloat(formModel.HourlyRate || '0') || 0,
                hour = getFloat(formModel.Hour || '0') || 0;

            formModel.TotalValue = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel);
        };
        function onHourChange(formModel, handler) {
            var rate = getFloat(formModel.HourlyRate || '0') || 0,
                hour = getFloat(formModel.Hour || '0') || 0;
            console.log([rate, hour]);
            if (!isValid()) {
                hour = getMaxHours(hour);
                formModel.Hour = hour;
                //alert('Invalid Val');
            }
            formModel.TotalValue = (rate * hour).toFloat();
            formModel.Total = formModel.TotalValue.toMoney();
            onChange(formModel);
        };
        function setFunc(key, inputs, formModel, handler) {
            handler = handler || {};
            handler.PrevModel = handler.PrevModel || {};
            $(inputs[key]).keydown(function () {
                handler.PrevModel[key] = this.value;
            }).keyup(function () {
                if (formModel[key] != handler.PrevModel[key]) {
                    (handler['on' + key + 'Change'] || changer['on' + key + 'Change']).call(this, formModel, handler);
                }
            });
        };
        function getColumn(dic,name,cls) {
            return '<section class="col-sm-12 col col-md-2">' +
                    '<div class="input-group ' + cls + '">' +
                        (dic[name] ?
                        '<span data-binding="' + name + '" class="form-control auto_bind"></span>' :
                        '<input required type="text" data-binding="' + name + '" class="form-control">') +
                    '</div>' +
                '</section>'
        };
        function getRow(model, name, handler, dic) {
            dic = dic || { Total :true};
            var elm = $('<div class="row">' +
                '<section class="col-sm-12 col col-md-4">' +
                    '<label>' + name + '</label>' +
                '</section>' +
                getColumn(dic, 'Day','day_container') +
                getColumn(dic, 'Hour', 'hour_container') +
                getColumn(dic, 'HourlyRate', 'hourly_rate_container') +
                getColumn(dic, 'Total', 'total_container') +
            '</div>');
            model.Elm = elm;
            model.FormModel = model.FormModel || {};
            var inputs = Global.Form.Bind(model.FormModel, elm);
            for (var key in inputs) {
                //(key === 'Day' || key === 'Hour') &&
                setFunc(key, inputs, model.FormModel, handler);
            }
            //console.log(inputs);
            container.append(elm);
            return inputs;
        };
        function getAllowance(model, name, handler) {
            var elm = $('<div class="row">' +
                '<section class="col-sm-12 col col-md-10">' +
                    '<label>' + name + '</label>' +
                '</section>' +
                '<section class="col-sm-12 col col-md-2">' +
                    '<div class="input-group">' +
                        '<input required type="text" data-binding="Total" class="form-control">' +
                    '</div>' +
                '</section>' +
            '</div>');
            model.Elm = elm;
            model.FormModel = model.FormModel || {};
            //Global.Form.Bind(model.FormModel, elm)
            var inputs = Global.Form.Bind(model.FormModel, elm);
            for (var key in inputs) {
                //(key === 'Day' || key === 'Hour') &&
                setFunc(key, inputs, model.FormModel, handler);
            }
            container.append(elm);
        };
        (function () {
            var dataModel, _formModel = {};
            //(employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes)
            this.Create = function (model) {
                dataModel = model.WorkingDay;
                dataModel.FormModel = _formModel;
                var inputs = getRow(dataModel, 'Working Days', this, { Day: true, Hour: true, HourlyRate: true, Total: true });
                _formModel.Day = dataModel.Count;
                _formModel.Hour = parseInt(dataModel.Minutes / 60);
                _formModel.Total = model.EmployeeDetails.Salary.toMoney();
                if (model.WorkingDay.Minutes>0){
                    _formModel.HourlyRate = ((model.EmployeeDetails.Salary.div(model.WorkingDay.Minutes)).mlt(60)).toMoney();
                }
                else {
                    _formModel.HourlyRate = 0;
                }
            };
        }).call(this.WorkingDay = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.Attendance;
                dataModel.FormModel = _formModel;
                getRow(dataModel, 'Attendance', this);

                var hours = parseInt(dataModel.Minutes / 60);
                _formModel.Day = dataModel.Count.toFloat();
                _formModel.Hour = hours;
                if (model.WorkingDay.Minutes > 0) {
                    dataModel.HourlyRate = model.EmployeeDetails.Salary.div(model.WorkingDay.Minutes).mlt(60);
                    _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                    _formModel.TotalValue = ((model.EmployeeDetails.Salary / model.WorkingDay.Minutes) * hours * 60).toFloat();
                    _formModel.Total = _formModel.TotalValue.toMoney();
                } else {
                    dataModel.HourlyRate = 0;
                    _formModel.HourlyRate = 0;
                    _formModel.TotalValue = 0;
                    _formModel.Total = 0;
                }
            };
        }).call(this.Attendance = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.LeaveItem;
                dataModel.FormModel = _formModel;
                getRow(dataModel, 'Leave',this);
                var hours = parseInt(dataModel.Minutes / 60);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = parseInt(dataModel.Minutes / 60);
                if (model.WorkingDay.Minutes > 0) {
                    _formModel.HourlyRate = ((model.EmployeeDetails.Salary / model.WorkingDay.Minutes) * 60).toMoney();
                    _formModel.TotalValue = ((model.EmployeeDetails.Salary / model.WorkingDay.Minutes) * hours * 60).toFloat();
                    _formModel.Total = _formModel.TotalValue.toMoney();
                } else {
                    _formModel.HourlyRate = 0;
                    _formModel.TotalValue = 0;
                    _formModel.Total = 0;
                }
            };
        }).call(this.LeaveItem = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.LateEntry;
                dataModel.FormModel = _formModel;
                getRow(dataModel, 'Late Entry',this);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = parseInt(dataModel.Minutes / 60);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = _formModel.TotalValue.toMoney();
                if (dataModel.Minutes > 0) {
                    _formModel.HourlyRate = (dataModel.Total / parseInt(dataModel.Minutes / 60)).toMoney();
                } else {
                    _formModel.HourlyRate = model.WorkingDay.Minutes > 0 ? ((model.EmployeeDetails.Salary / model.WorkingDay.Minutes) * 60).toMoney() : 0;
                }
                
            };
        }).call(this.LateEntry = {});
        (function () {
            var dataModel, _formModel = { TotalValue :0};
            this.Create = function (model) {
                dataModel = model.Absent;
                dataModel.FormModel = _formModel;
                getRow(dataModel, 'Absent', this, { Day: true, Hour: true, HourlyRate: true, Total: true });
                var hours = parseInt(dataModel.Minutes / 60);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = hours;
                dataModel.HourlyRate = model.WorkingDay.Minutes > 0 ? model.EmployeeDetails.Salary.div(model.WorkingDay.Minutes).mlt(60) : 0;
                _formModel.TotalValue = dataModel.HourlyRate.mlt(hours);
                _formModel.HourlyRate = dataModel.HourlyRate.toMoney();
                _formModel.Total = _formModel.TotalValue.toMoney();
            };
        }).call(this.Absent = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.OverTime;
                dataModel.FormModel = _formModel;
                getRow(dataModel, 'Over Time',this);
                _formModel.Day = dataModel.Count;
                _formModel.Hour = parseInt(dataModel.Minutes / 60);

                //if (dataModel.Minutes > 0) {
                //    _formModel.HourlyRate = (dataModel.Total / parseInt(dataModel.Minutes / 60)).toMoney();
                //} else {
                dataModel.HourlyRate = model.WorkingDay.Minutes > 0 ? model.EmployeeDetails.Salary.div(model.WorkingDay.Minutes).mlt(60) : 0;
                _formModel.HourlyRate = dataModel.HourlyRate.toMoney();

                _formModel.TotalValue = dataModel.Minutes.mlt(dataModel.HourlyRate).div(60);
                _formModel.Total = _formModel.TotalValue.toMoney();
                //}
            };
        }).call(this.OverTime = {});
        (function () {
            var dataModel, _formModel = {};
            //(employee.EmployeeDetails.Salary / employee.WorkingDay.Minutes)

            function getBonus(model) {
                var elm = $('<div class="row">' +
                    '<section class="col-sm-12 col col-md-8">' +
                        '<label>Scheduled Bonus</label>' +
                    '</section>' +
                    getColumn({ Items: true }, 'Items', 'items') +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.append(elm);
            };

            this.Create = function (model) {
                dataModel = model.Bonus;
                dataModel.FormModel = _formModel;
                getBonus(dataModel);

                _formModel.Items = dataModel.Count+' Bonuses';
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();
            };
        }).call(this.Bonus = {});
        (function () {
            var dataModel, _formModel = {};
            function getBonus(model) {
                var elm = $('<div class="row">' +
                    '<section class="col-sm-12 col col-md-8">' +
                        '<label>Loan</label>' +
                    '</section>' +
                    getColumn({ Items: true }, 'Items', 'items') +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.append(elm);
            };
            this.Create = function (model) {
                dataModel = model.Loan;
                dataModel.FormModel = _formModel;
                getBonus(dataModel);

                _formModel.Items = dataModel.Count + ' Loans';
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();
            };
        }).call(this.Loan = {});
        (function () {
            var dataModel, _formModel = {};
            function getBonus(model) {
                var elm = $('<div class="row">' +
                    '<section class="col-sm-12 col col-md-10">' +
                        '<label>Advance Salary</label>' +
                    '</section>' +
                    getColumn({ Total: true }, 'Total', 'total') +
                '</div>');
                model.Elm = elm;
                model.FormModel = model.FormModel || {};
                Global.Form.Bind(model.FormModel, elm);
                container.append(elm);
            };
            this.Create = function (model) {
                dataModel = model.Advance;
                dataModel.FormModel = _formModel;
                getBonus(dataModel);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();
            };
        }).call(this.Advance = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.Allowance;
                dataModel.FormModel = _formModel;
                getAllowance(dataModel, 'Another Allowance/Bonus',this);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();
            };
        }).call(this.Allowance = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.Deduction;
                dataModel.FormModel = _formModel;
                getAllowance(dataModel, 'Another Deduction',this);
                _formModel.TotalValue = dataModel.Total;
                _formModel.Total = dataModel.Total.toMoney();
            };
        }).call(this.Deduction = {});
        (function () {
            var dataModel, _formModel = {};
            this.Create = function (model) {
                dataModel = model.Payable = { Total :0};
                dataModel.FormModel = _formModel;
                var elm = $('<div class="row" style="text-align:right; border-top:2px solid silver;">' +
                                '<section class="col-sm-12 col col-md-10">' +
                                    '<label>Net Payable</label>' +
                                '</section>' +
                                '<section class="col-sm-12 col col-md-2">' +
                                    '<div class="input-group">' +
                                        '<span data-binding="Total" class="form-control auto_bind"></span>' +
                                    '</div>' +
                                '</section>' +
                            '</div>');
                dataModel.Elm = elm;
                dataModel.FormModel = _formModel;
                Global.Form.Bind(dataModel.FormModel, elm)
                container.append(elm);
                _formModel.Total = dataModel.Total;
            };
        }).call(this.Payable = {});
        this.Create = function (model) {
            container = container || windowModel.View.find('#data_container');
            container.empty();
            this.WorkingDay.Create(model);
            this.Attendance.Create(model);
            this.LeaveItem.Create(model);
            this.LateEntry.Create(model);
            this.Absent.Create(model);
            this.OverTime.Create(model);
            this.Bonus.Create(model);
            this.Loan.Create(model);
            this.Advance.Create(model);
            this.Allowance.Create(model);
            this.Deduction.Create(model);
            this.Payable.Create(model);
            onChange({});
        };
    }).call(service.View = {});
};

