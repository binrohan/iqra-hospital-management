
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'LeaveCategory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true },
                { field: 'Description', filter: true, required: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', required: false, filter: true, Add: false },
                { field: 'Creator', required: false, filter: true, Add: false },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', required: false, filter: true, Add: false },
                { field: 'Updator', required: false, filter: true, Add: false }
            ],
            url: '/HRIS/LeaveCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} LeaveCategories ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/HRIS/LeaveCategory/Create',
            saveChange: '/HRIS/LeaveCategory/Edit'
        },
        remove: { save: '/HRIS/LeaveCategory/Delete' }
    });

})();
