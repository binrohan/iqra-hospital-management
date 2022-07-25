var Controller = new function () {
    var callarOptions, filter = { "field": "SuplierReturnId", "value": "", Operation: 0 };
    function onDetails(model) {
        Global.Add({
            ItemId: model.ItemId,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.model.Id;
        Global.Add({
            title: 'Suplier Return Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'VoucharNo', filter: true },
                        { field: 'Suplier', filter: true },
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
                        { field: 'Creator', filter: true }
                    ],
                    model: model.model,
                    DetailsUrl: function () {
                        return '/ProductReturnArea/SuplierReturn/Details?Id=' + model.model.Id;
                    }
                },
                {
                    title: 'Items',
                    Grid: [{
                        Header: 'Suplier Return',
                        filter: [filter],
                        ondatabinding: function (response) {

                        },
                        //Summary: [
                        //    { field: 'ReturnQnt', title: 'Return Qnt', type: 2 },
                        //    { field: 'ReturnAmount', title: 'Return Amount', type: 2 },
                        //    { field: 'TotalPurchasePrice', title: 'Total TP', type: 2 },
                        //    { field: 'TotalTradePrice', title: 'Total Payable TP', type: 2 }
                        //],
                        Columns: [
                            { field: 'Name', filter: true, click: onDetails },
                            { field: 'Category', filter: true, selected: false },
                            { field: 'GenericName', title: 'Generic Name', selected: false },
                            { field: 'Strength', title: 'Strength' },
                            { field: 'ReturnQnt', title: 'Return Qnt', type: 2 },
                            { field: 'ReturnAmount', title: 'Return Amount', type: 2 },
                            { field: 'UnitPurchasePrice', title: 'TP', type: 2, selected:false },
                            { field: 'UnitTradePrice', title: 'Payable TP', type: 2 },
                            { field: 'TotalPurchasePrice', title: 'Total TP', type: 2, selected: false },
                            { field: 'TotalTradePrice', title: 'Total Payable TP', type: 2 }
                        ],
                        Url: '/ProductReturnArea/SuplierReturn/GetItems',
                    }],
                }
            ],
            name: 'OnLoanStructureDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js',
        });
    };
};
