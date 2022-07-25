var Controller = new function () {
    var callarOptions, filter = { "field": "SaleInfoId", "value": "", Operation: 0 };
    function onDetails(model) {
        Global.Add({
            ItemId: model.ItemId,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
        });
    };
    function rowBound(elm) {
        if (this.NetTaka <= this.TradePrice) {
            elm.css({ color: 'red' });
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.SaleInfoId;
        Global.Add({
            title: 'Sale Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Sale Basic Info',
                    Columns: [
                        { field: 'VoucherNo', title: 'Voucher', filter: true },
                        { field: 'Customer', filter: true },
                        { field: 'ItemCount', title: 'Items', width: 60, type: 2 },
                        { field: 'SalePrice', type: 2 },
                        { field: 'TradePrice', type: 2 },
                        { field: 'Discount', width: 70, type: 2 },
                        { field: 'Computer' },
                        { field: 'Creator', filter: true, Add: false },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                    ],
                    model: model.model,
                    Id: model.SaleInfoId,
                    DetailsUrl: function () {
                        return '/ItemSalesArea/ItemSales/Details?Id=' + model.SaleInfoId;
                    }
                },
                {
                    title: 'Sale Items',
                    Grid: [{
                        Header: 'SaleItems',
                        filter: [filter],
                        Columns: [
                    { field: 'Name', title: 'Trade Name', filter: true, click: onDetails },
                    { field: 'Category', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Qnty', type: 2 },
                    { field: 'UnitTradePrice', title: 'Unit TP', type: 2 },
                    { field: 'UnitSalePrice', title: 'Unit MRP', type: 2 },
                    { field: 'Discount', type: 2 },
                    { field: 'TradePrice', title: 'Total TP', type: 2 },
                    { field: 'NetTaka', title: 'Payable MRP', type: 2 }
                        ],
                        Url: '/ItemSalesArea/ItemSales/GetByItem/Get',
                        summary: {
                            items: [
                                { field: 'Discount', title: 'Discount', type: 2 },
                                { field: 'NetTaka', title: 'Net Taka', type: 2 },
                                { field: 'TradePrice', title: 'Trade Price', type: 2 },
                                { field: 'UnitQuentity', title: 'Quentity', type: 2 },
                            ]
                        }
                    }],
                }
            ],
            name: 'OnSaleDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=SaleDetails',
        });
    };
};