
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            DoctorAvailabilityId: model.Id,
            name: 'DoctorAvailabilityDetails',
            url: '/Areas/DoctorsArea/Content/DoctorAvailability/DoctorAvailabilityDetails.js',
        });
    };
    function onAddOrderCategory(model) {
        Global.Add({
            model: model,
            name: 'OrderCategory',
            url: '/Areas/SuplierArea/Content/Suplier/AddOrderCategoryController.js',
        });
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'DoctorAvailability',
        Grid: {
            elm: $('#grid'),
            columns: [
                
                    { field: 'PeriodType', title: 'PeriodType' },
                    { field: 'StartAtTime', title: 'StartAtTime', dateFormat: 'dd mmm-yyyy' },
                    { field: 'EndAtTime', title: 'EndAtTime', dateFormat: 'dd mmm-yyyy' },
                    { field: 'ActiveFromDate', title: 'Active From Date', dateFormat: 'dd mmm-yyyy' },
                    { field: 'ActiveToDate', title: 'Active To Date', required: false, dateFormat: 'dd mmm-yyyy' },
                    { field: 'MaximumPatient', title: 'MaximumPatient' },
                    { field: 'ExtraPatientAppointment', title: 'ExtraPatientAppointment' },
                    { field: 'Day', title: 'Day' },
                    { field: 'week', title: 'Week' },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy' },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy' },
                    { field: 'IsDeleted', title: 'IsDeleted' },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                    { field: 'ChangeLog', title: 'ChangeLog', filter: true },
                    
            ],
            Actions: [{
                click: onAddOrderCategory,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            }],
            url: '/DoctorsArea/DoctorAvailability/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} DoctorAvailabilitys ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/DoctorsArea/DoctorAvailability/Create',
            saveChange: '/DoctorsArea/DoctorAvailability/Edit',
            //details: function (data) {
                //return '/DoctorsArea/DoctorAvailability/Details?Id=' + data.Id;
            //},
            additionalField: [
                //{ field: 'AccountNo', required: false, title: 'Payable Account No', position: 2 },
                //{ field: 'AccountName', required: false, title: 'Payable Account Name', position: 2 },
                //{ field: 'Fax', required: false, position: 5 },
                //{ field: 'Vat', position: 8 },
                //{ field: 'Discount', position: 9 },
                //{ field: 'PurchaseDiscount', position: 10 },
                //{ field: 'Remarks', required: false, position: 12, Add: { type: 'textarea' } }
            ]
        },
        remove: { save: '/DoctorsArea/DoctorAvailability/Delete' }
    });

})();;
                