
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.Position = formModel.Position || 0;
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
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Category',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, Add: { sibling: 3 } },
                { field: 'Url', filter: true, required: false, Add: { sibling: 3 } },
                { field: 'Position', required: false, Add: { sibling: 3 } },
                { field: 'CssId', filter: true, required: false },
                { field: 'CssClass', filter: true, required: false },
                { field: 'Description', required: false, filter: true, Add: { type: 'textarea', sibling: 1 } },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
                
            ],
            url: '/MenuArea/MenuCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/MenuArea/MenuCategory/Create',
            saveChange: '/MenuArea/MenuCategory/Edit'
        },
        remove: { save: '/MenuArea/MenuCategory/Delete' }
    });
})();
