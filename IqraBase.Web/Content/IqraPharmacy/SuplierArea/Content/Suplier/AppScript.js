
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.Vat = formModel.Vat || 0;
        formModel.Discount = formModel.Discount || 0;
        formModel.PurchaseDiscount = formModel.PurchaseDiscount || 0;
        formModel.MarginDiscount = formModel.MarginDiscount || 0;
    };
    function onDetails(model) {
        Global.Add({
            SuplierId: model.Id,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onAddOrderCategory(model) {
        Global.Add({
            model: model,
            name: 'OrderCategory',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/AddOrderCategoryController.js',
        });
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
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Suplier',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, position: 1, Click: onDetails },
                { field: 'Counter', filter: true, Add: false },
                { field: 'OrderCategory', filter: true, position: 1, Add: false },
                { field: 'Phone', filter: true, required: false, position: 3 },
                { field: 'Email', required: false, filter: true, position:4 },
                { field: 'WebSite', required: false, filter: true, position:4 },
                { field: 'Address', required: false, filter: true, Add: { type: 'textarea' }, position:11 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            Actions: [{
                click: onAddOrderCategory,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            }],
            url: '/SuplierArea/Suplier/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,

        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/SuplierArea/Suplier/Create',
            saveChange: '/SuplierArea/Suplier/Edit',
            details: function (data) {
                return '/SuplierArea/Suplier/Details?Id=' + data.Id;
            },
            dropdownList: [
                {
                    Id: 'CounterId', position: 1, url: '/ProductArea/Counter/AutoComplete', Type: 'AutoComplete'
                }
            ],
            additionalField: [
                { field: 'AccountNo', required: false, title: 'Payable Account No', position: 2 },
                { field: 'AccountName', required: false, title: 'Payable Account Name', position: 2 },
                { field: 'Fax', required: false, position: 5 },
                { field: 'Vat', required: false, position: 8 },
                { field: 'Discount', required: false, position: 9 },
                { field: 'PurchaseDiscount', required: false, position: 10 },
                { field: 'MarginDiscount', required: false, position: 10 },
                { field: 'Remarks', required: false, position: 12, Add: { type: 'textarea' } }
            ]
        },
        remove: { save: '/SuplierArea/Suplier/Delete' }
    });

})();
