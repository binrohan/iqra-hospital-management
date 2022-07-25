
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        //Global.Add({
        //    SuplierId: model.Id,
        //    name: 'SuplierDetails',
        //    url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        //});
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
        Name: 'SuplierOrderCategory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, position: 1, Click: onDetails },
                { field: 'Description', required: false, filter: true, Add: { type: 'textarea' }, position: 11 },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/SuplierArea/SuplierOrderCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/SuplierArea/SuplierOrderCategory/Create',
            saveChange: '/SuplierArea/SuplierOrderCategory/Edit',
            details: function (data) {
                return '/SuplierArea/SuplierOrderCategory/Details?Id=' + data.Id;
            }
        },
        remove: { save: '/SuplierArea/SuplierOrderCategory/Delete' }
    });

})();
