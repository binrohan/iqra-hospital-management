
(function () {
    function onSubmit(model, data, formModel) {
        if (data) {
            model.Id = data.Id
        }
        model.Date = formModel.Date;
        model.InterAt = formModel.Date+" "+formModel.InterAt;
        model.OutAt = formModel.Date + " " + formModel.OutAt;
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
    function onAttendantUserDetails(model) {
        onUserDetails(model.EmployeeId);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'DailyAttendanceDetails',
            url: '/Content/IqraPharmacy/AttendanceArea/Content/DailyAttendance/DailyAttendanceDetails.js',
        });
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'DailyAttendance',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee', title: 'Name', filter: true, Add: false, click: onAttendantUserDetails },
                { field: 'Date', dateFormat: 'dd/MM/yyyy', Position: 1, click: onDetails },
                { field: 'InterAt', Position: 1, dateFormat: 'HH:mm' },
                { field: 'OutAt', Position: 2, dateFormat: 'HH:mm' },
                { field: 'Duration', Position: 3, Add: false },
                { field: 'AllowedDuration', Position: 4, Add: false },
                { field: 'LateDuration', Position: 4, Add: false },
                { field: 'Comments', required: false, filter: true, Position: 6, Add: {type:'textarea',sibling:1} },
                { field: 'Creator', filter: true, Add: false, Click: onCreatorDetails },
                { field: 'Updator', filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/AttendanceArea/DailyAttendance/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ' },
            onDataBinding: onDataBinding
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AttendanceArea/DailyAttendance/OnCreate',
            saveChange: '/AttendanceArea/DailyAttendance/Edit',
            dropdownList: [
                {
                    Id: 'EmployeeId',
                    url: '/EmployeeArea/Employee/AutoComplete',
                    Type: 'AutoComplete',
                    Position: 5
                }
            ]
        },
        remove: { save: '/AttendanceArea/DailyAttendance/Delete' }
    });

})();
