
(function () {
    var opts = {
        name: 'EmployeeType',
        url: '/Content/Js/EmployeeType/AddCategoryController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
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

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'EmployeeType',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true },
                { field: 'Description', filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', required: false, filter: true, Add: false },
                { field: 'CreatedBy', required: false, filter: true, Add: false },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', required: false, filter: true, Add: false },
                { field: 'UpdatedBy', required: false, filter: true, Add: false }
            ],
            url: '/EmployeeType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} EmployeeTypes ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/EmployeeType/Create',
            saveChange: '/EmployeeType/Edit'
        },
        remove: { save: '/EmployeeType/Delete' }
    });

})();
