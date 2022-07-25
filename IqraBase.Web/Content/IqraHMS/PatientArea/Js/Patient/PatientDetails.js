var Controller = new function () {
    var service = {}, windowModel, callerOptions,
        filter = { "field": "PatientId", "value": "", Operation: 0 };
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
        filter.value = model.PatientId;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/PatientDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    function onAppointmentCharge(model) {
        Global.Add({
            AppointmentChargeId: model.Id,
            name: 'AppointmentChargeDetails',
            url: '/Content/IqraHMS/BillingArea/Js/AppointmentCharge/AppointmentCharge.js',
        });
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, patientId,self=this;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
                self.Events.Bind();
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            formModel.ServerData = model;
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
            formModel.LastDateOfAppointment = model.LastDateOfAppointment.getDate().format('dd/MM/yyyy hh:mm');
            formModel.LastDateOfAdmission = model.LastDateOfAdmission.getDate().format('dd/MM/yyyy hh:mm');
            formModel.LastDateOfRealese = model.LastDateOfRealese==="\/Date(-2209010400000)\/"?"": model.LastDateOfRealese.getDate().format('dd/MM/yyyy hh:mm');
        };
        function load() {
            formModel.Loading = true;
            Global.CallServer('/Patient/Details?Id=' + callerOptions.PatientId, function (response) {
                formModel.Loading = false;
                if (!response.IsError) {
                    populate(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                formModel.Loading = false;
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (patientId === callerOptions.PatientId) {
                return;
            }
            load();
            patientId = callerOptions.PatientId;
        };
        (function () {

            function onPayment() {
                Global.Add({
                    DueAmount: formModel.ServerData.DueAmount,
                    PatientId: callerOptions.PatientId,
                    url: '/Content/IqraHMS/BillingArea/Js/DuePayment/AddPayment.js',
                    onSaveSuccess: function (response) {
                        load();
                    }
                });
            };

            this.Bind = function () {
                windowModel.View.find('#btn_add_payment').click(function () {
                    if (formModel.Loading) {
                        alert('Data is loading. Please wait....');
                    } else{
                        onPayment();
                    }
                });
            };
        }).call(self.Events = {})
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#patient_history').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onSubmit(formModel, data) {
            formModel.PatientId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onDetails(model) {
            var scriptUrl = '';
            switch (model.HistoryType) {
                case "Appointment":
                    scriptUrl = '/Content/IqraHMS/PatientArea/Js/Patient/AppointmentTimeDetails.js';
                    break;
                case "Admission":
                    scriptUrl = '/Content/IqraHMS/PatientArea/Js/Patient/BedAllocationDetails.js';
                    break;

            }
            Global.Add({
                Id: model.Id,
                url: scriptUrl,
            });
        };
        function rowBound(elm) {
            //Global.Click(elm, onDetails, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {

            });
        };
        function getOptions() {
            var opts = {
                Name: 'PatientHistory',
                Grid: {
                    elm: windowModel.View.find('#patient_history_grid'),
                    columns: [
                            { field: 'Name', filter: true, Add: false },
                            { field: 'Remarks', filter: true, Add: false },
                            { field: 'HistoryType', filter: true, Add: false },
                            { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                            { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false }
                    ],
                    url: '/PatientArea/PatientHistory/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Patient History', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#patient_history #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false

            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.PatientHistory = {});
    (function () {
        var gridModel, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#appointment_time').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function onSubmit(formModel, data) {

            formModel.PatientId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };

        function rowBound(elm) {
          
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                if (this.ArrivedAt > "/Date(203402279199997)/") {
                    this.ArrivedAt = '';
                }
                if (this.CompletedAt > "/Date(203402279199997)/") {
                    this.CompletedAt = '';
                }
            });
        };
        function getOptions() {
            var opts = {
                Name: 'AppointmentTime',
                Grid: {
                    elm: windowModel.View.find('#appointment_time_grid'),
                    columns: [
                        { field: 'DoctorName', title: 'Doctor Name', filter: true },
                            { field: 'SerialNo', title: 'Serial No' },
                            { field: 'WatingNo', title: 'Wating No',selected:false },
                            { field: 'ArrivalTime', title: 'Arrival Time', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'ArrivedAt', title: 'Arrived At', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'CompletedAt', title: 'Completed At', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'PatientType', filter: true, selected: false }
                    ],
                    url: '/DoctorsArea/Appointment/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Appointment Time', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#appointment_time #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false

            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.AppointmentTime = {});
    (function () {
        var gridModel, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#prescription').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[3]).addClass('active');
        }
        function onSubmit(formModel, data) {

            formModel.PatientId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onPresDetails(model) {
 
            Global.Add({
                PrescriptionId: model.Id,
                name: 'PrescriptionDetails',
                url: '/Content/IqraHMS/PatientArea/Js/Patient/PrescriptionDetails.js',
            });
        };

        function rowBound(elm) {
            Global.Click(elm, onPresDetails, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {

            });
        };
        function getOptions() {
            var opts = {
                Name: 'Prescription',
                Grid: {
                    elm: windowModel.View.find('#prescription_grid'),
                    columns: [
                            { field: 'Patient', Add: false },
                            { field: 'Doctor', filter: true, Add: false },
                            { field: 'Complain', filter: true, Add: false },
                            { field: 'PreviousInformation', title: 'Previous Info', filter: true, Add: false },
                            { field: 'AdditionalInformation', title: 'Additional Info', filter: true, Add: false },
                            { field: 'Advice', filter: true, Add: false },
                            { field: 'Remarks', Add: false },
                            { field: 'Time', title: 'Date-Time', dateFormat: 'dd/MM/yyyy hh:mm', filter: true, Add: false },
                            { field: 'NextMeetingDate', title: 'Next Meeting', dateFormat: 'dd/MM/yyyy hh:mm', filter: true, Add: false },

                    ],
                    url: '/PrescriptionArea/Prescription/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Prescriptions', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#pescription #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false

            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.Prescription = {});
    (function () {
        var gridModel, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#totalBills').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[4]).addClass('active');
        }
        function onSubmit(formModel, data) {

            formModel.PatientId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };

        function onInvDetails(model) {
            Global.Add({
                PatientInvestigationId: model.RelationTypeId,
                name: 'InvestigationDetails',
                url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoice.js',
               
            });
           
        };

        function rowBound(elm) {
            Global.Click(elm, onInvDetails, this);
          
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {

            });
        };
        function getOptions() {
            var opts = {
                Name: 'TotalBills',
                Grid: {
                    elm: windowModel.View.find('#totalBills_grid'),
                    columns: [
                        { field: 'TotalBillNo', title: 'TotalBillNo' },
                        { field: 'RelationType', title: 'RelationType' },
                        { field: 'Amount', title: 'Total' },
                        { field: 'Vat', title: 'Vat ' },
                        { field: 'Discount', title: 'Discount(BDT)' },
                        { field: 'PayableAmount', title: 'Payable' },
                        { field: 'PaidAmount', title: 'Paid' },
                        { field: 'DueAmount', title: 'Due' },
                        { field: 'Remarks', title: 'Remarks', filter: true },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    ],
                    url: '/BillingArea/TotalBills/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  TotalBills', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#totalBills #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    Responsive: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false

            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.TotalBills = {});
    (function () {
        var gridModel,dataSource=[], formModel = {}, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
                Global.Form.Bind(formModel, windowModel.View.find('#patient_transection'));
                setEvents();
            }
            reset();
            windowModel.View.find('#patient_transection').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[5]).addClass('active');
        };
        function rowBound(elm) {
           // Global.Click(elm, onDetails, this);
        };
        function onDataBinding(response) {
            Global.Copy(formModel, response.Data.Total, true);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {

            });
            dataSource = response.Data.Data;
        };
        function getFilter() {
            filters = Global.Filters().Bind({
                container: windowModel.View.find('#patient_transection .summary_container'),
                formModel: formModel,
                filter: [filter],
                //type: 'ThisMonth',
                //field: 'DateOfAppointment',
                onchange: function (filter) {
                    if (gridModel) {
                        gridModel.page.filter = filter;
                        gridModel.Reload();
                    }
                }
            });
            return filters;
        };
        function setEvents() {
            windowModel.View.find('#patient_transection .btn_print').click(function () {
                console.log(['gridModel', gridModel, formModel]);
                Global.Add({
                    dataSource: dataSource,
                    formModel: formModel,
                    PatientId: callerOptions.PatientId,
                    name: 'PrintSummaryPatTrans',
                    url: '/Content/IqraHMS/BillingArea/Js/PatientTransection/PrintSummaryPatTrans.js',
                });
            });
        };
        function getOptions() {
            var opts = {
                Name: 'PatientTransection',
                Grid: {
                    elm: windowModel.View.find('#patient_transection_grid'),
                    columns: [
                        { field: 'TransectionType', filter: true, Add: false },
                        { field: 'Remarks', Add: false },
                        { field: 'BillAmount', Add: false },
                        { field: 'PaidAmount', Add: false },
                        { field: 'Discount', Add: false },
                        { field: 'Balance', Add: false },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                        { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false }
                    ],
                    url: '/TransectionArea/PatientTransection/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Patient Transection', filter: getFilter() },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Responsive: false,
                    Printable: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                //gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.PatientTransection = {});
    (function () {
        var gridModel, dataSource = [], formModel = {}, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
                Global.Form.Bind(formModel, windowModel.View.find('#patient_picture'));
                setEvents();
            }
            reset();
            windowModel.View.find('#patient_picture').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[6]).addClass('active');
        };
        function rowBound(elm) {
            // Global.Click(elm, onDetails, this);
        };
        function onDataBinding(response) {
            Global.Copy(formModel, response.Data.Total, true);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {

            });
            dataSource = response.Data.Data;
        };
        function getFilter() {
            filters = Global.Filters().Bind({
                container: windowModel.View.find('#patient_picture .summary_container'),
                formModel: formModel,
                filter: [filter],
                //type: 'ThisMonth',
                onchange: function (filter) {
                    if (gridModel) {
                        gridModel.page.filter = filter;
                        gridModel.Reload();
                    }
                }
            });
            return filters;
        };
        function setEvents() {
            console.log(['patient_picture .btn_add_picture', windowModel.View.find('#patient_picture .btn_add_picture')]);
            windowModel.View.find('#patient_picture .btn_add_picture').click(function () {
                console.log(['callerOptions', callerOptions]);
                Global.Add({
                    PatientId: callerOptions.PatientId,
                    name: 'AddPatientPicture',
                    url: '/Content/IqraHMS/PatientArea/Js/PatientPicture/AddPicture.js',
                    onSaveSuccess: function () {
                        gridModel && gridModel.Reload();
                    }
                });
            });
        };
        function bindImage(td) {
            td.html('<img src="' + this.IconPath +'" style="max-width: 100%;max-height: 200px;">');
        };
        function getOptions() {
            var opts = {
                Name: 'PatientPicture',
                Grid: {
                    elm: windowModel.View.find('#patient_picture_grid'),
                    columns: [
                        { field: 'Image',  bound: bindImage },
                        { field: 'Name' },
                        { field: 'Size' },
                        { field: 'MimeType' },
                        { field: 'Patient' },
                        { field: 'Remarks' },
                        { field: 'Creator' },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    ],
                    url: '/PatientArea/PatientPicture/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Patient Picture', filter: getFilter() },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Responsive: false,
                    Printable: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.PatientPicture = {});
    (function () {
        var gridModel, dataSource = [], formModel = {}, patientId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                patientId = filter.value;
                Global.List.Bind(getOptions());
                Global.Form.Bind(formModel, windowModel.View.find('#patient_id_card'));
                setEvents();
            }
            reset();
            windowModel.View.find('#patient_id_card').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[7]).addClass('active');
        };
        function rowBound(elm) {
            // Global.Click(elm, onDetails, this);
        };
        function onDataBinding(response) {
            Global.Copy(formModel, response.Data.Total, true);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {

            });
            dataSource = response.Data.Data;
        };
        function getFilter() {
            filters = Global.Filters().Bind({
                container: windowModel.View.find('#patient_id_card .summary_container'),
                formModel: formModel,
                filter: [filter],
                //type: 'ThisMonth',
                onchange: function (filter) {
                    if (gridModel) {
                        gridModel.page.filter = filter;
                        gridModel.Reload();
                    }
                }
            });
            return filters;
        };
        function setEvents() {
            windowModel.View.find('#patient_id_card .btn_add_id_card').click(function () {
                Global.Add({
                    PatientId: callerOptions.PatientId,
                    name: 'AddPatientPicture',
                    url: '/Content/IqraHMS/PatientArea/Js/IdPrinted/AddIdCard.js',
                    onSave: function () {
                        gridModel && gridModel.Reload();
                    }
                });
            });
        };
        function bindDeActiveAt(td) {
            this.IsActive && td.html('');
        };
        function getOptions() {
            var opts = {
                Name: 'PatientIdCard',
                Grid: {
                    elm: windowModel.View.find('#patient_id_card_grid'),
                    columns: [
                        { field: 'Patient' },
                        { field: 'Reason' },
                        { field: 'Amount' },
                        { field: 'Account' },
                        { field: 'IsActive' },
                        { field: 'DeActiveAt', dateFormat: 'dd/MM/yyyy hh:mm', bound: bindDeActiveAt},
                        { field: 'Remarks' },
                        { field: 'Creator' },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    ],
                    url: '/PatientArea/IdPrinted/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Patient Id', filter: getFilter() },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Responsive: false,
                    Printable: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Edit: false,
                Add: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != patientId) {
                gridModel.Reload();
            }
            patientId = filter.value;
        }
    }).call(service.PatientIdCard = {});
};