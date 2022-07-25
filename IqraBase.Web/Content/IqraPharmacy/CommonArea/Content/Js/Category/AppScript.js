
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
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Category',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Type', filter: true, Add: false },
                { field: 'Name', filter: true },
                { field: 'Description', required: false, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/Category/Get',
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
            save: '/Category/Create',
            saveChange: '/Category/Edit',
            dropdownList: [
                {
                    Id: 'TypeId',
                    url: '/ItemType/DropDown'
                }
            ]
        },
        remove: { save: '/Category/Delete' }
    });

})();
