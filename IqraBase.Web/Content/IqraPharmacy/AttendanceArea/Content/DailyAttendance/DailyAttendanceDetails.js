
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "DailyAttendanceId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ', filter: [filter] };
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
        filter.value = callerOptions.model.Id;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AttendanceArea/Templates/DailyAttendanceDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, dailyAttendanceId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
        };
        function load() {
            Global.CallServer('/AttendanceArea/DailyAttendance/Details?Id=' + callerOptions.model.Id, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.model.Id] = response.Data;
                    populate(response.Data);
                } else {
                    alert('Errors');
                }
            }, function (response) {
                response.Id = -8;
                alert('Network Errors');
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (dailyAttendanceId === callerOptions.model.Id) {
                return;
            }
            if (dataSource[callerOptions.model.Id]) {
                populate(dataSource[callerOptions.model.Id]);
            } else {
                load();
            }
            dailyAttendanceId = callerOptions.model.Id;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
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
            model.InterAt =model.Date+ ' '+ formModel.InterAt;
            model.OutAt = model.Date + ' ' + formModel.OutAt;
            console.log(model);
        };
        function rowBound(elm) {

        };
        function onDataBinding(response) {

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
                        { field: 'Comments',required:false, filter: true, Add: { type: 'textarea', sibling: 1 } },
                    ],
                    url: '/AttendanceArea/Attendance/Get',
                    page: page,
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
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        };
    }).call(service.Attendance = {});
};