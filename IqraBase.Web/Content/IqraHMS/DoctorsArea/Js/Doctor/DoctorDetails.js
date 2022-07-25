
var Controller = new function ()
{
    var service = {}, windowModel, callerOptions,
        filter = { "field": "DoctorId", "value": "", Operation: 0 };

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
        callerOptions = model;
        filter.value = model.DoctorId;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/DoctorsArea/Templates/DoctorDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, doctorId;
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
            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
        };
        function load() {
            Global.CallServer('/Doctor/Details?Id=' + callerOptions.DoctorId, function (response) {
                if (!response.IsError) {
                    populate(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (doctorId === callerOptions.DoctorId) {
                return;
            }
            load();
            doctorId = callerOptions.DoctorId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, doctorId, wDataSource = [{ text: 'Sunday', value: '0' },
                               { text: 'Monday', value: '1' },
                               { text: 'Tuesday', value: '2' },
                               { text: 'Wednesday', value: '3' },
                               { text: 'Thursday', value: '4' },
                               { text: 'Friday', value: '5' },
                               { text: 'Saturday', value: '6' },
                               mwDataSource = [{ text: '1st', value: '1' },
                            { text: '2nd', value: '2' },
                            { text: '3rd', value: '3' },
                            { text: '4th', value: '4' },
                            { text: '5th', value: '5' },
                               ],
        ], formInputes = {},
        periodTypes = ['Weekly', 'Monthly', 'MonthlyWeekly'],
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        function bind() {
            if (!gridModel) {
                doctorId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#visiting_time').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onSubmit(formModel, data,model) {

            formModel.DoctorId = filter.value;
            formModel.week = formModel.Day =='2' ? formModel.week || 0 : 0;
            if (data) {
                formModel.Id = data.Id
            }
            if (formModel.PeriodType == 2 && formModel.week<1) {
                alert('sasa');
                return false;
            }
            formModel.ActiveFromDate = model.ActiveFromDate;
            formModel.StartAtTime = model.StartAtTime;
            formModel.EndAtTime = model.EndAtTime;

            console.log(['formModel, data,model', formModel, data, model]);
        };
        function rowBound(elm) {
            if (this.ActiveTo<new Date()) {
                elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
                elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
                elm.find('.action a').remove();
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.weekStr = 'N/A';
                this.PeriodTypeStr = periodTypes[this.PeriodType] || '';
                if (this.PeriodType != 1) {
                    this.DayStr = wDataSource[this.Day] ? wDataSource[this.Day].text : 'N/A';
                    if (this.PeriodType == 2) {
                        this.weekStr = mwDataSource[this.week] ? mwDataSource[this.week].text : 'N/A';
                    }
                } else {
                    this.DayStr = this.Day;
                }
                this.StartAtTime = this.StartAtTime.getDate();
                this.EndAtTime = this.EndAtTime.getDate();
                this.Duration = this.EndAtTime.getTime() - this.StartAtTime.getTime();
                this.Duration = parseInt(this.Duration / 3600000) + ':' + parseInt((this.Duration % 3600000) / 60000);
                this.ActiveTo = this.ActiveToDate.getDate();
                if (this.StartAtTime.getDate() == this.EndAtTime.getDate()) {
                    this.StartAtTime = this.StartAtTime.format('hh:mm');
                    this.EndAtTime = this.EndAtTime.format('hh:mm');
                } else {
                    this.StartAtTime = days[this.StartAtTime.getDay()]+'-'+ this.StartAtTime.format('hh:mm');
                    this.EndAtTime = days[this.EndAtTime.getDay()] + '-' + this.EndAtTime.format('hh:mm');
                }
            });
        };
        function getPeriodFilter() {
            return {
                DropDown: {
                    dataSource: [
                            { text: 'Select Type', value: '' },
                            { text: 'Weekly', value: '0' },
                            { text: 'Monthly', value: '1' },
                            { text: 'MonthlyWeekly', value: '2' }
                    ]
                }
            }
        };
        function getDropdown() {
            var mDataSource = [{ text: '1', value: '1' },
                                 { text: '2', value: '2' },
                                 { text: '3', value: '3' },
                                 { text: '4', value: '4' },
                                 { text: '5', value: '5' },
                                 { text: '6', value: '6' },
                                 { text: '7', value: '7' },
                                 { text: '8', value: '8' },
                                 { text: '9', value: '9' },
                                 { text: '10', value: '10' },
                                 { text: '11', value: '11' },
                                 { text: '12', value: '12' },
                                 { text: '13', value: '13' },
                                 { text: '14', value: '14' },
                                 { text: '15', value: '15' },
                                 { text: '16', value: '16' },
                                 { text: '17', value: '17' },
                                 { text: '18', value: '18' },
                                 { text: '19', value: '19' },
                                 { text: '20', value: '20' },
                                 { text: '21', value: '21' },
                                 { text: '22', value: '22' },
                                 { text: '23', value: '23' },
                                 { text: '24', value: '24' },
                                 { text: '25', value: '25' },
                                 { text: '26', value: '26' },
                                 { text: '27', value: '27' },
                                 { text: '28', value: '28' },
                                 { text: '29', value: '29' },
                                 { text: '30', value: '30' },
                                 { text: '31', value: '31' }
                 ];
            var dayDpr={
                Id: 'Day', position: 5,
                dataSource: [],
            };
            var weekDpr = {
                Id: 'week',
                position: 6,
                required: false,
                dataSource: [],
            };
            return [{
                Id: 'PeriodType', position: 3, Add: { sibling: 3 },
                dataSource: [
                    { text: 'Weekly', value: '0' },
                    { text: 'Monthly', value: '1' },
                    { text: 'MonthlyWeekly', value: '2' }
                ],
                onChange: function (data) {
                    dayDpr.datasource = [];
                    weekDpr.datasource = [];
                    if (data) {
                        if (data.value === '0') {
                            dayDpr.datasource = wDataSource;
                            $(formInputes.week).closest('.col').hide();
                        } else if (data.value === '1') {
                            dayDpr.datasource = mDataSource;
                            $(formInputes.week).closest('.col').hide();
                        } else if (data.value === '2') {
                            dayDpr.datasource = mwDataSource;
                            weekDpr.datasource = mwDataSource;
                            $(formInputes.week).closest('.col').show();
                        }
                    }
                    dayDpr.Reload && dayDpr.Reload();
                    weekDpr.Reload && weekDpr.Reload();
                }
            }, dayDpr, weekDpr
            ];
        };
        function onEndVisitingTime(model) {
            Global.DatePicker.ServerFormat = 'dd/MM/yyyy hh:mm';
            var opts = {
                name: 'EndVisitingTime',
                columns: [{ field: 'ActiveToDate', title: 'Active To Date', required: false, filter: true, dateFormat: 'dd/MM/yyyy hh:mm' } ],
                model: model,
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                saveChange: '/DoctorsArea/DoctorAvailability/OnActiveToDate',
            };
            Global.Add(opts);
            //Global.Add({
            //    model: model,
            //    name: 'EndVisitingTime',
            //    url: '/Areas/DoctorsArea/Content/Js/Doctor/EndVisitTime.js',
            //});
        };
        function onRemove(model) {
            var opts = {
                name: 'VisitingTime',
                data: { Id: model.Id },
                msg: 'Are you sure?',
                save: '/DoctorsArea/DoctorAvailability/OnActiveToDate',
                onsavesuccess: function () {
                    gridModel.Reload();
                }
            };
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: opts
            });
        };
        function getOptions() {
            var opts = {
                Name: 'VisitingTime',
                Grid: {
                    elm: windowModel.View.find('#visiting_time_grid'),
                    columns: [
                            { field: 'StartAtTime', title: 'Start At Time', Add: false, },
                            { field: 'EndAtTime', title: 'End At Time', Add: false, },
                            { field: 'Duration', title: 'Duration', sorting: false, Add: false, selected: false },
                            { field: 'ActiveFromDate', title: 'Active From Date', filter: true, dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'ActiveToDate', title: 'Active To Date', required: false, filter: true, dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                            { field: 'MaximumPatient', title: 'Max Patient', required: false, position: 3, width: 90 },
                            { field: 'ExtraPatientAppointment', title: 'Extra PA', required: false, position: 4, width: 80 },
                            { field: 'PeriodTypeStr', title: 'Period Type', ActionField: 'PeriodType', filter: getPeriodFilter(), Add: false, width: 130 },
                            { field: 'DayStr', title: 'Day', ActionField: 'Day', required: false, filter: true, position: 5, Add: false, width: 60 },
                            { field: 'weekStr', title: 'Week', ActionField: 'week', required: false, Add: false, filter: true, position: 6, width: 60,selected:false },
                            { field: 'UpdatedAt', title: 'Updated At', dateFormat: 'dd/MM/yyyy hh:mm', Add: false, selected: false },
                            
                    ],
                    Actions: [{
                        click: onEndVisitingTime,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Set Active To Date"><span class="glyphicon glyphicon-open"></span></a>'
                    },{
                        click: onRemove,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Delete"><span class="glyphicon glyphicon-trash"></span></a>'
                    }],
                    url: '/DoctorsArea/DoctorAvailability/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Visiting Times', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Action:{width:90},
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#visiting_time #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: {
                    elm: windowModel.View.find('#btn_add_new_visiting_time'),
                    onSubmit: onSubmit,
                    onShow: function (formModel, inputs) {
                        if (!formInputes.week) {
                            formInputes = inputs;
                            $(formInputes.week).closest('.col').hide();
                        }
                    },
                    save: '/DoctorsArea/DoctorAvailability/Create',
                    saveChange: '/DoctorsArea/DoctorAvailability/Edit',
                    dropdownList: getDropdown(),
                    additionalField: [
                        { field: 'StartAtTime', title: 'Start At Time', filter: true, position: 1, dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'EndAtTime', title: 'End At Time', filter: true, position: 2, dateFormat: 'dd/MM/yyyy hh:mm' },
                    ]
                },
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != doctorId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            doctorId = filter.value;
        }
    }).call(service.VisitingTime = {});
    (function () {
        var gridModel, doctorId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                doctorId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#doctor_fees').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        };
        function onEdit(model) {
            Global.Add({
                onSubmit: onSubmit,
                Name: 'DoctorFee',
                title: 'Edit Doctor Fee',
                columns: [
                            { field: 'Name', filter: true, position: 1 },
                            { field: 'IsDefault', required: false, position: 3, add: { Type: 'checkbox' } },
                            { field: 'Remarks', required: false, filter: true, position: 10, add: { type: 'textarea', sibling: 1 }, selected: false }
                ],
                model: model,
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                saveChange: '/BillingArea/DoctorFees/Update'
            });
        };
        function onEndVisitingTime(model) {
            var opts = {
                name: 'DoctorFeesActiveTo',
                title: 'Set Doctor Fees Active To',
                columns: [{ field: 'ActiveTo', title: 'Active To', required: false, filter: true, dateFormat: 'dd/MM/yyyy hh:mm' }],
                model: model,
                onSaveSuccess: function () {
                    gridModel.Reload();
                },
                saveChange: '/BillingArea/DoctorFees/OnActiveToDate',
            };
            Global.Add(opts);
        };
        function onRemove(model) {
            var opts = {
                name: 'DoctorFeesDeActive',
                data: { Id: model.Id },
                msg: 'Are you sure you want to de-activate?',
                save: '/BillingArea/DoctorFees/OnActiveToDate',
                onsavesuccess: function () {
                    gridModel.Reload();
                }
            };
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: opts
            });
        };
        function onSubmit(formModel, data) {
            formModel.DoctorId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };
        function rowBound(elm) {
            if (this.ActiveToDate < new Date()) {
                elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
                elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
                elm.find('.action a').remove();
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.ActiveToDate = this.ActiveTo.getDate();
                this.IsDefaultStr = this.IsDefault ? 'Yes' : 'No';
            });
        };
        function getOptions() {
            var opts = {
                Name: 'DoctorFees',
                Grid: {
                    elm: windowModel.View.find('#doctor_fees_grid'),
                    columns: [
                            { field: 'Name', filter: true, position: 1, Add: { sibling: 3 } },
                            { field: 'Doctor', filter: true, Add: false },
                            { field: 'FeeType', title: 'Fee Type', filter: true, Add: false },
                            { field: 'Fee', title: 'Fee', position: 4,width:60 },
                            { field: 'ActiveFrom', title: 'Active From Date', dateFormat: 'dd/MM/yyyy hh:mm', position: 5 },
                            { field: 'ActiveTo', title: 'Active To Date', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                            { field: 'IsDefaultStr', title: 'Is Default?', Add: false },
                            { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm', Add: false, selected: false },
                            { field: 'Creator', filter: true, Add: false, selected: false },
                            { field: 'UpdatedAt', title: 'Updated At', dateFormat: 'dd/MM/yyyy hh:mm', Add: false, selected: false },
                            { field: 'Updator', filter: true, Add: false, selected: false },
                            { field: 'Remarks', required: false, filter: true, position: 10, Add: { Type: 'textarea', sibling: 1 }, selected: false }
                    ],
                    url: '/BillingArea/DoctorFees/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Doctor Fees', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [{
                        click: onEndVisitingTime,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Set Active To Date"><span class="glyphicon glyphicon-open"></span></a>'
                    }, {
                        click: onRemove,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Delete"><span class="glyphicon glyphicon-trash"></span></a>'
                    }, {
                        click: onEdit,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Edit"><span class="glyphicon glyphicon-edit"></span></a>'
                    }],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#doctor_fees #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: {
                    elm: windowModel.View.find('#btn_add_new_fee'),
                    onSubmit: onSubmit,
                    save: '/BillingArea/DoctorFees/Add',
                    dropdownList: [
                        {
                            Id: 'FeeType', position: 2, Add: { sibling: 3 },
                            dataSource: [
                                { text: 'Chember', value: 'Chember' },
                                { text: 'Ward', value: 'Ward' },
                                { text: 'Medical Bord', value: 'Medical Bord' },
                                { text: 'Other', value: 'Other' }
                            ]
                        }
                    ],
                    additionalField: [
                        { field: 'IsDefault', required: false, position: 3, add: { type: 'checkbox', sibling: 3 } },
                    ]
                },
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != doctorId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            doctorId = filter.value;
        };
    }).call(service.DoctorFees = {});
    (function () {
        var tabModel;
        function bind() {
            reset();
            windowModel.View.find('#appointment').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[3]).addClass('active');
        };
        this.Bind = function () {
            bind();
            if (tabModel) {
                tabModel.gridModel.Reload()
            } else {
                var model = {};
                Global.Add({
                    container: windowModel.View.find('#appointment'),
                    BaseModel: model,
                    filter: [filter],
                    tabs:[0,2,3],
                    name: 'DoctorDetails.Appointment',
                    url: '/Content/IqraHMS/AppointmentArea/Js/Appointment.js',
                    OnLoaded: function (tab) {
                        tabModel = tab;
                        model.Reload();
                    }
                });
            }
        };
    }).call(service.Appointment = {});
    (function () {
        var tabModel;
        function bind() {
            reset();
            windowModel.View.find('#commission').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[4]).addClass('active');
        };
        this.Bind = function () {
            bind();
            if (tabModel) {
                tabModel.gridModel.Reload()
            } else {
                var model = {};
                Global.Add({
                    container: windowModel.View.find('#commission'),
                    BaseModel: model,
                    filter: [filter],
                    name: 'DoctorDetails.Commission',
                    url: '/Content/IqraHMS/CommissionArea/Js/Commission/AppScripts.js',
                    OnLoaded: function (tab) {
                        tabModel = tab;
                        model.Reload();
                    }
                });
            }
        };
    }).call(service.Commission = {});
};