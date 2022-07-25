
(function () {
    var opts = {
        name: 'Employee',
        url: '/Content/Js/Employee/AddCategoryController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function getTypeFileter() {
        return {
            Operation: 0,
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Active', value: '0' },
                    { text: 'Deleted', value: '1' }
                ]
            }
        };
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
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
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
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
    function updatePassword(model) {
        Global.Add({
            name: 'UpdatePassword',
            save: '/EmployeeArea/Employee/UpdatePassword',
            columns: [{ field: 'PasswordText',title:'Password', add: { type: 'password' } }],
            onsavesuccess: function () {

            },
            onsubmit: function (postModel) {
                postModel.employeeId = model.Id;
            }
        });
    };
    function onUpdateAttendanceId(model) {
        Global.Add({
            name: 'UpdateAttendanceId',
            save: '/EmployeeArea/Employee/UpdateAttendanceId',
            columns: [{ field: 'attendanceId', title: 'Attendance ID', add: { datatype: 'int' } }],
            onsavesuccess: function () {
                gridModel && gridModel.Reload();
            },
            onsubmit: function (postModel) {
                postModel.employeeId = model.Id;
            }
        });
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Employee',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: { Operation: 5 }, Operation: 5, position: 1, Click: onDetails },
                { field: 'UserName', filter: { Operation: 5 }, Operation: 5, Add: false, selected: false, },
                { field: 'Designation', filter: true, Add: false, Click: onDesignationDetails },
                { field: 'DesignationSalary', Add: false },
                { field: 'OwnSalary', Add: false },
                { field: 'Phone', filter: true, position: 3 },
                { field: 'Email', filter: true, position: 4 },
                { field: 'AttendanceId', add: false },
                { field: 'IsDeleted', add: false, selected: false, filter: getTypeFileter(), Operation: 0, }
            ],
            url: '/Employee/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Employees ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onUpdateAttendanceId,
                html: '<span class="hide_on_mobile icon_container" title="Update Attendance ID" style="margin-right: 5px;"><span class="glyphicon glyphicon-save"></span></span>'
            },{
                click: updatePassword,
                html: '<span class="hide_on_mobile icon_container" title="Update Password" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            onShow: function (model, formInputs, dropDownList, IsNew, windowModel, formModel) {
                if (IsNew) {
                    $(formInputs['UserName']).prop('disabled', false);
                    $(formInputs['Password']).prop('disabled', false);
                } else {
                    $(formInputs['UserName']).prop('disabled', true).val('********');
                    $(formInputs['Password']).prop('disabled', true).val('********');
                }
            },
            save: '/Employee/Create',
            saveChange: '/Employee/Edit',
            dropdownList: [
                { Id: 'DesignationId', url: '/Designation/AutoComplete', position: 2, type: 'AutoComplete' },
            ],
            additionalField: [
                { field: 'Password', Add: { type: 'password' }, position: 6 },
                { field: 'PAddress', title: 'Permanent Address', Add: { type: 'textarea' }, required: false, position: 7 },
                { field: 'CAddress', title: 'Current Address', Add: { type: 'textarea' }, required: false, position: 8 },
                { field: 'UserName', filter: true, position: 5 }
            ],
            details: function (data) {
                console.log(data);
                return '/EmployeeArea/Employee/Details?Id=' + data.Id
            }
        },
        remove: { save: '/Employee/Delete' }
    });
})();

Global.Error.Show = function (re) {
    alert(re.Msg);
};
