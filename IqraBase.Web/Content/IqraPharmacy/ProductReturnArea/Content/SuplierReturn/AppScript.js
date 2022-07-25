(function () {
    function onDetails(model) {
        Global.Add({
            name: 'SuplierReturnDetails',
            url: '/Content/IqraPharmacy/ProductReturnArea/Content/SuplierReturn/Details.js',
            model: model,
            tab: 'ReturnItems'
        });
    };
    function onSuplierDetails(model) {
        Global.Add({
            SuplierId: model.SuplierId,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onUserDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'SuplierReturn',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'VoucharNo', filter: true, click: onDetails },
                { field: 'Suplier', filter: true, click: onSuplierDetails },
                { field: 'ItemPurchased', title: 'Item Purchased', type: 2, selected: false },
                { field: 'ItemReturn', title: 'Item Return', type: 2 },
                { field: 'PurchasedPrice', title: 'Payable TP', type: 2 },
                { field: 'PurchasePrice', title: 'TP', type: 2, selected: false },
                { field: 'ReturnPrice', title: 'Return Amount', type: 2 },
                { field: 'ReturnDiscount', title: 'Return Discount(%)', type: 2, selected: false },
                { field: 'TotalReturnDiscount', title: 'Return Discount(T)', type: 2 },
                { field: 'PurchaseVAT', title: 'Purchase VAT', type: 2, selected: false },
                { field: 'PurchaseDiscount', title: 'Purchase Discount', type: 2, selected: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', selected: false },
                { field: 'Creator', filter: true, click: onUserDetails }
            ],
            url: '/ProductReturnArea/SuplierReturn/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Returns ' },
            onDataBinding: onDataBinding,
            action: { width: 60 },
            Actions: [{
                click: onDetails,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,Edit:false,
        remove: false
    });
    (function () {
        function onAddByVoucher(model) {
            Global.Add({
                model: model,
                name: 'AddReturnByVoucher',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/SuplierReturn/AddByVoucher.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onAddByItem(model) {
            Global.Add({
                model: model,
                name: 'AddSupplierReturnByItem',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/SuplierReturn/AddByItem.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        Global.Click($('#btn_add_by_voucher'), onAddByVoucher);
        Global.Click($('#btn_add_by_items'), onAddByItem);
    })();
})();
