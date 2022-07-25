
(function () {
    Global.DatePicker.ServerFormat='dd/MM/yyyy HH:mm'
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
        //Global.Add({
        //    model: model,
        //    name: 'AttendanceDetails',
        //    url: '/Content/IqraPharmacy/AttendanceArea/Content/Attendance/AttendanceDetails.js',
        //});
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Attendance',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'StartDate', dateFormat: 'dd/MM/yyyy hh:mm', },
                { field: 'EndDate', dateFormat: 'dd/MM/yyyy hh:mm', Position: 1 },
                { field: 'Duration', Position: 2 },
                { field: 'SlotLimit',  Position: 3 },
                { field: 'Type', Position: 4 },
                { field: 'Value', Position: 6 },
                { field: 'Creator', Click: onCreatorDetails, Add: false }
            ],
            url: '/AttendanceArea/LateEntrySetting/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ' },
            onDataBinding: onDataBinding
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/AttendanceArea/LateEntrySetting/Create',
            saveChange: '/AttendanceArea/LateEntrySetting/Edit'
        },
        remove: { save: '/AttendanceArea/LateEntrySetting/Delete' }
    });
})();
