var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "InventoryItemPurchaseInfoId", "value": "", Operation: 0 };

    function onHMSInventoryItemDetails(model) {
        console.log(['onHMSInventoryItemDetails(model)', model]);
        Global.Add({
            HMSInventoryItemId: model.HMSInventoryItemId,
            name: 'HMSInventoryItemDetails',
            url: '/Content/IqraHMS/InventoryArea/Js/HMSInventoryItem/OnDetails.js',
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.PurchaseInfoId;
        Global.Add({
            title: 'Purchase Info Details',
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Voucher' },
                        { field: 'TotalPrice', title: 'Total Price', type: 2 },
                        { field: 'Discount', title: 'Discount', type: 2 },
                        { field: 'Reduce', title: 'Reduce', type: 2 },
                        { field: 'PayableAmount', title: 'Payable Amount', type: 2 },
                        { field: 'PaidAmount', title: 'Paid Amount', type: 2 },
                        { field: 'DueAmount', title: 'DueAmount', type: 2 },
                        { field: 'Creator', filter: true }
                    ],
                    DetailsUrl: function () {
                        return '/InventoryArea/InventoryItemPurchaseInfo/Details?Id=' + callarOptions.PurchaseInfoId;
                    }
                },
                {
                    title: 'Items',
                    Grid: [{
                        Header: 'Items',
                        filter: [filter],
                        Columns: [
                            { field: 'Name', filter: true, click: onHMSInventoryItemDetails },
                            { field: 'UnitName', filter: true },
                            { field: 'Quantity', },
                            { field: 'UnitPrice', type: 2 },
                            { field: 'TotalPrice', type: 2 },
                            { field: 'Discount', type: 2 },
                            { field: 'PayablePrice', type: 2 },
                            { field: 'Position' },
                            { field: 'CreatedAt', title: 'Created-At', dateFormat: 'dd mmm-yyyy hh:mm'},
                            { field: 'Creator', filter: true }
                        ],
                        Url: '/InventoryArea/InventoryItemPurchase/Get',
                    }],
                }
            ],
            name: 'OnInvestigationDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=InventoryItemPurchaseInfoDetails',
        });
    };
};