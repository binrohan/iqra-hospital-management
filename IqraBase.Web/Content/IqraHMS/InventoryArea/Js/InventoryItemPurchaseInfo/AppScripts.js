
(function () {
    var that = this, gridModel, service = {};
    function onAdd() {
        Global.Add({
            name: 'OnInventoryItemPurchaseCreate',
            url: '/Content/IqraHMS/InventoryArea/Js/InventoryItemPurchaseInfo/OnCreate.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDetails(model) {
        Global.Add({
            PurchaseInfoId: model.Id,
            name: 'InventoryItemPurchaseInfoDetails',
            url: '/Content/IqraHMS/InventoryArea/Js/InventoryItemPurchaseInfo/OnDetails.js',
        });
    };
    function onRemove(model) {
        if (this.Status != 0) {
            return;
        }
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OrderRemoved',
                save: '/ProductOrderArea/Order/Cancel?Id=' + model.Id,
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }, onerror: function (response) {
                    switch (response.Id) {
                        case -3:
                            alert('No Order Found.');
                            break;
                        case -5:
                            alert('This order is already received.');
                            break;
                        case -8:
                            alert('Network Error');
                            break;
                    }
                },
            }
        });
    };
    function onRowBound(elm) {
        //this.Status == 11 && elm.css({ color: 'red' }).find('a').css({ color: 'red' });
        //if (this.Status != 0) {
        //    elm.find('.fa-trash').closest('a').css({ opacity: 0.6, cursor: 'default' });
        //}
    };
    function onDataBinding(data) {

    };
    Global.List.Bind({
        Name: 'Order',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Voucher', filter: true, Click: onDetails },
                { field: 'TotalPrice', title: 'Total Price', type: 2 },
                { field: 'Discount', title: 'Discount', type: 2 },
                { field: 'Reduce', title: 'Reduce', type: 2 },
                //{ field: 'TotalDiscount', title: 'Total Discount', type: 2 },
                { field: 'PayableAmount', title: 'Payable Amount', type: 2 },
                { field: 'PaidAmount', title: 'Paid Amount', type: 2 },
                { field: 'DueAmount', title: 'DueAmount', type: 2 }
            ],
            action: { width: 80 },
            //Actions: [{
            //    click: onPrint,
            //    html: '<a style="margin-right:8px;"><i class="fa fa-print" aria-hidden="true"></i></a>'
            //}, {
            //    click: onRemove,
            //    html: '<a style="margin-right:8px;"><i class="fa fa-trash" aria-hidden="true"></i></a>'
            //}],
            url: '/InventoryArea/InventoryItemPurchaseInfo/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Purchase ' },
            onDataBinding: onDataBinding,
            rowBound: onRowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();