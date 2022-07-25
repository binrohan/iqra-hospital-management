var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "ScheduleId", "value": "", Operation: 0 },
        buttons = [{
            click: OnChangeStatus,
            html: '<a style="margin-right:8px;" title="Change TP"><i class="glyphicon glyphicon-edit" aria-hidden="true"></i></a>'
        }, {
            click: OnAddCharge,
            html: '<a style="margin-right:8px;" title="Change TP"><i class="glyphicon glyphicon-plus" aria-hidden="true"></i></a>'
        }];


    function OnChangeStatus(data, grid) {
        Global.Add({
            name: 'onEditStatus',
            model: { Id: data.Id, Status: data.Status },
            title: 'On Edit Status',
            columns: [
                { field: 'Remarks', add: { type: 'textarea', sibling: 1 } }
            ],
            dropdownList: [
                {
                    Id: 'Status',
                    dataSource: [
                        { value: 'Arrived', text: 'Arrived' },
                        { value: 'Completed', text: 'Completed' }
                    ], position: 1
                }
            ],
            onSubmit: function (formModel, data, model) {
                formModel.Id = data.Id;
                formModel.ActivityId = window.ActivityId;
            },
            onSaveSuccess: function () {
                grid.Reload();
            },
            savechange: '/DoctorsArea/AppointmentTime/ChangeStatus'
        });
    };
    function OnAddCharge(data, grid) {
        Global.Add({
            name: 'onAddCharge',
            model: { DoctorFees: callarOptions.DoctorFees, },
            title: 'On Add Charge',
            columns: [
                { field: 'DoctorFees', title:'Doctor Fees', add: { datatype: 'int' } },
                { field: 'Remarks', add: { type: 'textarea', sibling: 1 } }
            ],
            onSubmit: function (formModel) {
                formModel.ScheduleId = callarOptions.ScheduleId;
                formModel.PatientId = data.PatientId;
                formModel.DoctorId = callarOptions.DoctorId;
                formModel.PaidStatus = 'paid';
                formModel.ActivityId = window.ActivityId;
            },
            onSaveSuccess: function () {
                grid.Reload();
            },
            savechange: '/BillingArea/AppointmentCharge/Create'
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.ScheduleId;
        Global.Add({
            title: 'Schedule Details',
            selected: 0,
            Tabs: [
                {
                    title: 'Referesh',
                    Grid: [{
                        Id: '2B389D99-93E2-432E-81E3-D87608BE83E7',
                        Header: 'Referesh',
                        filter: [filter],
                        Columns: [
                            { field: 'PatientType', title: 'Patient Type', },
                            { field: 'DateOfAppointment', title: 'Date Of Appointment', dateFormat: 'dd mmm-yyyy' },
                            { field: 'Patient' },
                            { field: 'Code', selected: false },
                            { field: 'Mobile', },
                            { field: 'Status', },
                            { field: 'DoctorFees', title:'Fees' },
                            { field: 'ArrivedAt', title: 'Arrived At', dateFormat: 'dd mmm-yyyy hh:mm'},
                            { field: 'CompletedAt', title: 'Completed At', dateFormat: 'dd mmm-yyyy hh:mm'},
                            { field: 'ArrivalTime', title: 'Arrival Time', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'Remarks', },
                        ],
                        actions: buttons,
                        action: { width: 100 },
                        Url: '/DoctorsArea/AppointmentTime/Get',
                        onDataBinding: function (response) {
                            response.Data.Data.each(function () {
                                this.DoctorFees = this.DoctorFees === null ? '' : this.DoctorFees;
                            });
                        }
                    }],
                }
            ],
            name: 'OnScheduleDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=ScheduleDetails',
        });
    };
};