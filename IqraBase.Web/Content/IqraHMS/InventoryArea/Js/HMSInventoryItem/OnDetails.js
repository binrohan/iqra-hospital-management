var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "HMSInventoryItemId", "value": "", Operation: 0 };

    function onInvestigationDetails(model) {
        Global.Add({
            InvestigationId: model.InvestigationId,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnDetails.js',
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.HMSInventoryItemId;
        Global.Add({
            title: 'HMSInventory Item Details',
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Name', filter: true },
                        { field: 'UnitName', title: 'Unit', filter: true },
                        { field: 'UnitPrice', title: 'Unit Price', type: 2 },
                        { field: 'MinStockToAlert', title: 'Min Stock To Alert' },
                        { field: 'UsedDaysForPurchaseRequired', title: 'Used Days For Purchase Required' },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                        { field: 'Remarks', title: 'Remarks' }
                    ],
                    DetailsUrl: function () {
                        console.log(['DetailsUrl: function () {', '/InventoryArea/HMSInventoryItem/Details?Id=' + callarOptions.HMSInventoryItemId, callarOptions.HMSInventoryItemId, callarOptions]);
                        return '/InventoryArea/HMSInventoryItem/Details?Id=' + callarOptions.HMSInventoryItemId;
                    }
                },
                {
                    title: 'Purchase Items',
                    Grid: [{
                        Header: 'Items',
                        filter: [filter],
                        Columns: [
                            { field: 'Name', filter: true },
                            { field: 'UnitName', filter: true },
                            { field: 'Quantity', },
                            { field: 'UnitPrice', type: 2 },
                            { field: 'TotalPrice', type: 2 },
                            { field: 'Discount', type: 2 },
                            { field: 'PayablePrice', type: 2 },
                            { field: 'Position' },
                            { field: 'CreatedAt', title: 'Created-At', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'Creator', filter: true }
                        ],
                        Url: '/InventoryArea/InventoryItemPurchase/Get',
                    }],
                },
                {
                    title: 'Change History',
                    Grid: [{
                        Header: 'ChangeHistory',
                        filter: [filter],
                        Columns: [
                            { field: 'HMSInventoryItemName', title: 'Item Name', filter: true },
                            { field: 'QuantityBefore', title: 'Stock Before', type: 2 },
                            { field: 'QuantityChanged', title: 'Quantity Changed', type: 2 },
                            { field: 'QuantityAfter', title: 'Stock After', type: 2 },
                            { field: 'StockType', title: 'Changed Type', filter: true },
                            { field: 'RelativeType', title: 'Source Type', filter: true },
                            { field: 'HMSInventoryItemName', title: 'Item Name', filter: true },
                            { field: 'CreatedAt', title: 'Changed At', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'Remarks', title: 'Remarks' }
                        ],
                        Url: '/InventoryArea/InventoryStockChangeHistory/Get',
                    }],
                },
                {
                    title: 'Investigations',
                    Grid: [{
                        Header: 'Investigation',
                        filter: [filter],
                        Columns: [
                            { field: 'InvestigationName', title: 'Investigation Name', filter: true, Add: false, click: onInvestigationDetails },
                            { field: 'HMSInventoryItemName', title: 'Inventory Item Name', filter: true, Add: false },
                            { field: 'Quantity', title: 'Quantity', filter: true, Add: { dataType: 'float' } },
                            { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                            { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                            { field: 'Remarks', title: 'Remarks', required: false, Add: { type: 'textarea', sibling: 1 } }
                        ],
                        Url: '/InventoryArea/InvestigationInventory/Get',
                    }],
                }
            ],
            name: 'OnInvestigationDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=HMSInventoryItemDetails',
        });
    };
};
