
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            name: 'DesignationDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Designation/DesignationDetails.js',
            DesignationId: model.Id
        });
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onUpdatorDetails(model) {
        Global.Add({
            UserId: model.Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(data) {

    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
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
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Designation',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, click: onDetails },
                { field: 'Salary' },
                { field: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } },
                { field: 'CreatedBy', filter: true, Add: false },
                { field: 'CreatedAt', Add: false, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'UpdatedBy', filter: true, Add: false },
                { field: 'UpdatedAt', Add: false, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'IsDeleted', add: false, selected: false, filter: getTypeFileter(), Operation: 0, }
            ],
            url: '/Designation/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Designations ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            onShow: function (model, formInputs, dropDownList, IsNew, windowModel, formModel) {
                if (IsNew) {
                    $(formInputs['UserName']).prop('disabled', false);
                    $(formInputs['Password']).prop('disabled', false);
                } else {
                    $(formInputs['UserName']).prop('disabled', true);
                    $(formInputs['Password']).prop('disabled', true);
                }
            },
            save: '/Designation/AddNew',
            saveChange: '/Designation/Update',
        },
        remove: { save: '/Designation/Delete' }
    });

})();
