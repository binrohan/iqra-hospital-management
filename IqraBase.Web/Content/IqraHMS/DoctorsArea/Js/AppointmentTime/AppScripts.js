
(function () {
    var that = this, gridModel, accessModel = {};
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            AppointmentTimeId: model.Id,
            name: 'AppointmentTimeDetails',
            url: '/Areas/DoctorsArea/Content/AppointmentTime/AppointmentTimeDetails.js',
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
    Global.List.Bind({
        Name: 'AppointmentTime',
        Grid: {
            elm: $('#grid'),
            columns: [
                
                    { field: 'PatientType', title: 'Patient Type', filter: true, sorting: false, position: 1, Add: false },
                    { field: 'DateOfAppointment', title: 'Date Of Appointment', dateFormat: 'dd mmm-yyyy' },
                    { field: 'Name', title: 'Name', filter: true, sorting: false },
                    { field: 'Remarks', title: 'Remarks', filter: true, sorting: false },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/DoctorsArea/AppointmentTime/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} AppointmentTimes ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/DoctorsArea/AppointmentTime/Create',
            saveChange: '/DoctorsArea/AppointmentTime/Edit',
            dropdownList: [
                            {
                                Id: 'PatientType', position: 1, 
                                dataSource: [
                                    { text: 'InPatient', value: 'InPatient' },
                                    { text: 'OutPatient', value: 'OutPatient' },
                                ]
                            }
            ],
            additionalField: [
                //{ field: 'UserName', title: 'User Name', position: 2 },
                //{ field: 'Password', title: 'Password', position: 2, Add: { type: 'password' } }
            ]
        },
        remove: { save: '/DoctorsArea/AppointmentTime/Delete' }
    });

})();;
                