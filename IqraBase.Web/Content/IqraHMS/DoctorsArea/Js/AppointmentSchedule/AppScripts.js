(function () {
    var that = this, service = {}, model = {}, gridModel, formModel = {}, filter = [];
    function onDetails(model) {
        Global.Add({
            name: 'On_Schedule_Details',
            url: '/Content/IqraHMS/DoctorsArea/Js/AppointmentSchedule/OnScheduleDetails.js',
            ScheduleId: model.Id,
            DoctorFees: model.DoctorFee,
            DoctorId: model.DoctorId
        });
    };
    function onDoctorDetails(model) {
        Global.Add({
            DoctorId: model.DoctorId,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    function onUserDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };

    function onDataBinding(data) {

    };


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
                        { value: 'Comming', text: 'Comming' },
                        { value: 'Running', text: 'Running' },
                        { value: 'Canceled', text: 'Canceled' },
                        { value: 'Ended', text: 'Ended' },
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
            savechange: '/DoctorsArea/AppointmentSchedule/ChangeStatus'
        });
    };

    function getVoucherWise() {
        return {
            Id: '522A5D31-4561-4D21-BA4D-0B17E9C2D0D5',
            Name: 'Referesh',
            title: 'Referesh',
            Url: 'Get',
            columns: [
                { field: 'Doctor', filter: true, click: onDoctorDetails },
                { field: 'DoctorFee', title: 'Doctor Fee', type: 2 },
                { field: 'ScheduleStartAtTime', title: 'Start At', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'ScheduleEndAtTime', title: 'End At', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'AppointmentCounter', title: 'Total Patient', },
                { field: 'Status', title: 'Status' },
                { field: 'TotalAppointment', title: 'Max Patient', type: 2 },
                { field: 'AppointmentDone', title: 'Appointment Done', type: 2 },
                { field: 'Remarks', filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Creator', filter: true, click: onUserDetails }
            ],
            binding: onDataBinding,
            action: { width: 60 },
            ondetails: onDetails,
            actions: [{
                click: OnChangeStatus,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            }, {
                    click: onDetails,
                    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
                }],
        }
    };


    model = service.Model = {
        container: $('#page_container'),
        Base: {
            Url: '/DoctorsArea/AppointmentSchedule/',
        },
        items: [
            getVoucherWise()
        ],
        periodic: {
            container: '.filter_container',
            filter: filter,
            format: 'yyyy-MM-dd HH:mm'
        },
        Summary: {
            Container: '.filter_container',
            Items: [
                //{ field: 'PayableTP', title: 'PayableTP', type: 2 },
                //{ field: 'SalvageValue', title: 'Salvage Value', type: 2 },
                ////{ field: 'ReceivedValue', title: 'Received Value', type: 2 },
            ]
        }
    };
    Global.Tabs(model);
    model.items[0].set(model.items[0]);

    (function () {

    })();
})();
