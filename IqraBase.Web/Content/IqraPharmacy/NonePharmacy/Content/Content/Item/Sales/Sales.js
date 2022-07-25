(function () {
    var that = this, gridModel;
    var opts = {
        name: 'Received',
        url: '/Content/IqraPharmacy/Pharmacy/Content/Item/Sales/AddSale.js',
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
    Global.List.Bind({
        Name: 'PharmacyItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', filter: true, Add: false },
                { field: 'Category', filter: true, Add: false },
                { field: 'Name', title: 'Trade Name', filter: true, position: 1 },
                { field: 'Suplier', filter: true, Add: false },
                { field: 'Strength', required: false, filter: true, position: 3 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'CreatedBy', required: false, filter: true, Add: false },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'UpdatedBy', required: false, filter: true, Add: false }
            ],
            url: '/PharmacyItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false, Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();
