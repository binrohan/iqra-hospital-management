
(function () {
    var that = this, gridModel;
    function onDesignationDetails(model) {
        Global.Add({
            name: 'DesignationDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Designation/DesignationDetails.js',
            DesignationId: model.DesignationId
        });
    };
    function onDetails(model) {
        Global.Add({
            UserId: model.Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.HasOwnSalary = !!this.OwnSalary;
            this.OwnSalary = this.OwnSalary || this.DesignationSalary;
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onConnect(model) {
        Global.Add({
            name: 'User',
            model:model,
            savechange: '/AttendanceArea/Attendance/ConnectUser',
            columns: [{ field: 'Name' }],
            dropdownList: [{
                Id: 'attendanceId', url: '/AttendanceArea/Attendance/AutoComplete', Type: 'AutoComplete',
                page: { 'PageNumber': 1, 'PageSize': 500 }
            }],
            onSaveSuccess: function () {
                gridModel.Reload();
            },
            onsubmit: function (postModel) {
                postModel.UserId = postModel.Id;
            }
        });
    };
    function onRemove(model) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                Msg:'Do you want to disconnect?',
                name: 'Attendance',
                save: '/AttendanceArea/Attendance/ConnectUser',
                data: { UserId:model.Id, attendanceId:0 },
                onsavesuccess: function () {
                    gridModel.Reload();
                }
            }
        });
    };
    Global.List.Bind({
        Name: 'Users',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, Click: onDetails },
                { field: 'Info',title:'Attendance Name', filter: true, Click: onDetails },
                { field: 'Designation', filter: true, Click: onDesignationDetails },
                { field: 'DesignationSalary', title: 'Designation Salary' },
                { field: 'OwnSalary',title: 'Own Salary' },
                { field: 'Phone', filter: true },
                { field: 'Email', filter: true }
            ],
            url: '/EmployeeArea/Employee/ListWithAttendanceName',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Employees ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onConnect,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }, {
                click: onRemove,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-remove"></span></span>'
            }]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit:false,
        remove: false
    });
})();

Global.Error.Show = function (re) {
    alert(re.Msg);
};
