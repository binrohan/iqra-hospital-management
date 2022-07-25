(function () {
    function onDetails(model) {
        Global.Add({
            name: 'PurchaseByReturnDetails',
            url: '/Content/IqraPharmacy/ProductReturnArea/Content/PurchaseByReturnDetails.js',
            model: model,
            tab: 'ReturnItems'
        });
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'PurchaseByReturn',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'VoucharNo', filter: true, width: 120, click: onDetails },
                { field: 'SaleVoucherNo', title: 'Sale Voucher', filter: true, width: 120 },
                { field: 'ItemReturn', title: 'items', width: 55 },
                { field: 'SoldPrice', title: 'Sale Price', width: 80 },
                { field: 'ReturnPrice', title: 'Return Amount' },
                { field: 'Discount', width: 70 },
                { field: 'Vat', width: 70 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false },
                //{ field: 'Computer', required: false, filter: true, Add: false }
            ],
            url: '/ProductReturnArea/PurchaseByReturn/Get',
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
        function onAdd(model) {
            Global.Add({
                model: model,
                name: 'AddPurchaseByReturnController',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/AddPurchaseByReturnController.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onAddReturnByItem(model) {
            Global.Add({
                model: model,
                name: 'AddReturnByItemController',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/AddReturnByItem.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        Global.Click($('#btn_add_by_voucher'), onAdd);
        Global.Click($('#btn_add_by_items'), onAddReturnByItem);
    })();
})();
