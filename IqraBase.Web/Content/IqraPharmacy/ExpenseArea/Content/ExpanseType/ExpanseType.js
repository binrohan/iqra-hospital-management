
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
            formModel.GroupId = data.GroupId
            formModel.AccountCode = data.AccountCode
            formModel.IncreaseType = data.IncreaseType
        }
    };
    function onDetails(model) {
        Global.Add({
            SuplierId: model.Id,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onUserDetails(Id) {
        Global.Add({
            UserId: Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onUpdatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onDataBinding(data) {
        var types = ['Pharmacy', 'Pharmacy', 'None-Pharmacy'];
        data.Data.Data.each(function () {
            this.TypeText = types[this.Type] || 'Pharmacy';
        });
    };
    function onRowBound(elm) {
        if (!this.IsEditable) {
            elm.find('.icon_container').remove();
        }
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'ExpenseType',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'AccountName', title: 'Name', filter: true, position: 1 },
                { field: 'AccountDescription', required: false, title: 'Description', filter: true, position: 2, Add: { sibling: 1, type: 'textarea' } },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/ExpenseArea/ExpenseType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Expenses ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/ExpenseArea/ExpenseType/AddExpensType',
            saveChange: '/ExpenseArea/ExpenseType/Edit'
        },
        remove: { save: '/ExpenseArea/ExpenseType/Delete' }
    });
})();
