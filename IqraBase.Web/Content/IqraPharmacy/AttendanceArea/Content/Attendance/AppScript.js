
(function () {

    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'AttendanceDetails',
            url: '/Content/IqraPharmacy/AttendanceArea/Content/Attendance/AttendanceDetails.js',
        });
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Attendance',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, Add: false },
                { field: 'InterAt', dateFormat: 'dd/MM/yyyy hh:mm',Position:1 },
                { field: 'OutAt', dateFormat: 'dd/MM/yyyy hh:mm', Position: 2 },
                { field: 'LogInAt', dateFormat: 'dd/MM/yyyy hh:mm', Position: 3 },
                { field: 'LogOutAt', dateFormat: 'dd/MM/yyyy hh:mm', Position: 4 },
                { field: 'Comments', required: false, filter: true, Position: 6, Add: {type:'textarea',sibling:1} },
                { field: 'Creator', filter: true, Add: false, Click: onCreatorDetails },
                { field: 'Updator', filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/AttendanceArea/Attendance/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/AttendanceArea/Attendance/Create',
            saveChange: '/AttendanceArea/Attendance/Edit',
            dropdownList: [
                {
                    Id: 'EmployeeId',
                    url: '/EmployeeArea/Employee/AutoComplete',
                    Type: 'AutoComplete',
                    Position: 5
                }
            ]
        },
        remove: { save: '/AttendanceArea/Attendance/Delete' }
    });

})();
