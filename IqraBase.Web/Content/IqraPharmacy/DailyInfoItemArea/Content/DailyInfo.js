
(function () {
    var opts = {
        name: 'DailyInfo',
        url: '/Content/Js/DailyInfo/AddCategoryController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
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
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
        });
    };
    function onDailyInfoDetails(model) {
        Global.Add({
            DailyInfoId: model.Id,
            name: 'DailyInfoDetails',
            url: '/Content/IqraPharmacy/DailyInfoItemArea/Content/DailtyInfoDetails.js',
        });
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'DailyInfo',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'CreatedAt', title: 'Date', dateFormat: 'dd/MM/yyyy', Click: onDailyInfoDetails },
                { field: 'Computer', filter: true, position: 1, Click: onComputerDetails },
                { field: 'SoldAmount', filter: true, Add: false },
                { field: 'ReturnAmount', Add: false },
                { field: 'StartAmount', Add: false },
                { field: 'EndAmount', filter: true, position: 3 },
                { field: 'AdjustAmount', filter: true, position: 4 },
                { field: 'Status', filter: true, position: 4 }
            ],
            url: '/DailyInfo/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Employees ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
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
            save: '/DailyInfo/Create',
            saveChange: '/DailyInfo/Edit',
            dropdownList: [
                { Id: 'DesignationId', url: '/Designation/DropDown', position: 2 },
            ],
            additionalField: [
                { field: 'Password', Add: { type: 'password' }, position: 6 },
                { field: 'PAddress', title: 'Current Address', Add: { type: 'textarea' }, position: 7 },
                { field: 'CAddress', title: 'Current Address', Add: { type: 'textarea' }, position: 8 },
                { field: 'UserName', filter: true, position: 5 }
            ]
        },
        remove: { save: '/DailyInfo/Delete' }
    });

})();
