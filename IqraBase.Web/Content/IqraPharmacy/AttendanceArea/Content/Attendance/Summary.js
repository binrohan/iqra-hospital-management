
(function () {
    var selfService = {}, views = {}, max = 0,maxShift=0, dataModels = [];
    function getHours() {
        return [
            {title:'12 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '1 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '2 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '3 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '4 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '5 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '6 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '7 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '8 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '9 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '10 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '11 AM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '12 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '1 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '2 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '3 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '4 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '5 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '6 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '7 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '8 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '9 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '10 PM', Sales: 0, Shift: 0, Attendent: 0 },
            { title: '11 PM', Sales: 0, Shift: 0, Attendent: 0 },
        ];
    };
    function setSales(model) {
        var str = '',index=0,prevStr;
        model.Data[0].each(function () {
            str = this[5].substring(0, 10);
            index = parseInt(this[5].substring(11));
            if (views[str] && views[str].Data[index]) {
                views[str].Data[index].Sales = this[1].toFloat();
                views[str].Data[index].List = this;
                if(this[1]>views[str].Max.Sales){
                    views[str].Max.Sales=this[1];
                }
                if (this[1] > max) {
                    max = this[1];
                }
                if (index===0&&prevStr) {
                    views[prevStr].Data.push(views[str].Data[index]);
                }
                prevStr = str;
            } 
        });
        var elm,grpHtml='<div class="graph_container"></div>';
        selfService.Weekend.Set(model.Data[2]);
        selfService.EmployeeShift.Set(model.Data[1]);
        for (var key in views) {
            if (maxShift > 0 && max > 0) {
                var ratio = max / maxShift;
                views[key].Data.each(function () {
                    this.Shift = this.Shift * ratio;
                });
            }
        }
        for(var key in views){
            elm = $(grpHtml);
            views[key].View.ViewPort.children( ".text" ).css({ left: '10px', top: '20px','font-size':'0.6em' });
            views[key].View.ViewPort.append(elm);
            LineChart.Bind({
                container: elm[0],
                data: views[key].Data,
                sections: [
                    { valueField: 'Sales', title: 'Sales', color: '#FF0000', textColor: '#fefefe' },
                    { valueField: 'Shift', title: 'Shift', color: '#0000FF', textColor: '#fefefe' }
                ],
                width: views[key].View.ViewPort.width(),
                height: views[key].View.ViewPort.height(),
                max: max
            });
        }
    };
    (function () {
        var leaveItem;
        function setView(viewItem, leaveModel) {
            viewItem.Attendance = viewItem.Attendance || [];
            viewItem.Attendance.push(leaveModel);
            var elm = $('<div class="attendance">');
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
                if (this.InterAt > this.OutAt) {
                    var copyPro = Global.Copy({}, this);
                    copyPro.InterAt = copyPro.Date = new Date(this.Date.getFullYear(), this.OutAt.getMonth(), this.OutAt.getDate() + 1);
                    this.OutAt.setDate(this.OutAt.getDate() + 1);
                    copyPro.OutAt = this.OutAt;
                    this.OutAt = copyPro.InterAt;
                    checkView(copyPro, ln);
                    console.log([copyPro, this]);
                }
                checkView(leaveItem, ln);
            });
            viewItems.pop();
        };
    }).call(selfService.Attendance = {});
    (function () {
        var weekends = {}, weekend = {},view;
        function setWeekend(list) {
            for (var key in views) {
                view = views[key];
                weekend = weekends[view.View.Date.getDay()];
                weekend && weekend.each(function () {
                    if (this.From <= view.View.Date && this.To >= view.View.Date) {
                        view.Weekend[this.EmployeeId] = this;
                    }
                });
            }
        };
        this.Set = function (list) {
            weekends = {};
            //["Id","EmployeeId","From","To","DayOfWeek","Status"]
            list.each(function () {
                weekend = { Id: this[0], Status: this[5], DayOfWeek:this[4] };
                weekend.EmployeeId = this[1];
                weekend.From = this[2].getDate();
                weekend.To = this[3].getDate();
                weekends[this[4]] = weekends[this[4]] || [];
                weekends[this[4]].push(weekend);
            });
            setWeekend(list);
        };
    }).call(selfService.Weekend = {});
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
            list.each(function () {
                //["Id","EmployeeId","ActivateAt","ActiveTo","StartAt","EndAt","Duration","StartDayOfMonth","EndDayOfMonth","Status"]
                shiftModel = {
                    Id: this[0],
                    EmployeeId: this[1],
                    ActivateAt: this[2].getDate(),
                    ActiveTo: this[3].getDate(),
                    StartAt: Global.DateTime.GetObject(this[4], 'HH:mm'),
                    EndAt: Global.DateTime.GetObject(this[5], 'HH:mm'),
                    StartDayOfMonth: this[7],
                    EndDayOfMonth: this[8]
                };
                shiftModel.StartAt.setFullYear(shiftModel.ActivateAt.getFullYear());
                shiftModel.EndAt.setFullYear(shiftModel.ActivateAt.getFullYear());
                for(var key in views) {
                    view = views[key];
                    if (!view.Weekend[shiftModel.EmployeeId] && view.View.Date >= shiftModel.ActivateAt && view.View.Date <= shiftModel.ActiveTo && view.View.Date.getDate() >= shiftModel.StartDayOfMonth && view.View.Date.getDate() <= shiftModel.EndDayOfMonth) {
                        for (var i = new Date(shiftModel.StartAt) ; i < shiftModel.EndAt;) {
                            view.Data[i.getHours()].Shift++;
                            if (view.Data[i.getHours()].Shift > view.Max.Shift) {
                                view.Max.Shift = view.Data[i.getHours()].Shift;
                                if (view.Max.Shift > maxShift) {
                                    maxShift = view.Max.Shift;
                                }
                            }
                            //
                            i.setHours(i.getHours()+1);
                        }
                    }
                }
            });
        };
    }).call(selfService.EmployeeShift = {});
    Global.Add({
        model: { Date: new Date() },
        url: '/Content/IqraPharmacy/EmployeeArea/Content/Calendar.js',
        Container: $('#clndr'),
        modules: [],
        OnViewSet: function (viewItems, from, to) {
            views = {}, dataModels = [];
            viewItems.each(function () {
                views[this.String] = this.DataModel = { View: this, Data: getHours(), Max: { Sales: 0, Shift: 0, Attendent: 0 }, Weekend: {} };
            });
            var model = {
                From: from,
                To: to
            };
            Global.CallServer('/AttendanceArea/Attendance/GetMonthSummary', function (response) {
                if (!response.IsError) {
                    setSales(response.Data);
                } else {
                    alert('Errors.');
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors.');
            }, model, 'POST');
        },
        onDateSelect: function (viewModel) {
            Global.Add({
                View: viewModel.Elm.html(),
                Data: viewModel.DataModel.Data,
                url: '/Content/IqraPharmacy/AttendanceArea/Content/Attendance/DaySummaryDetails.js',
                Max:max
            });
        }
    });
})();
