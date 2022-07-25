var Controller = new function () {
    var callarOptions, filter = { "field": "AdjustHistoryId", "value": "", Operation: 0 };
    function setGrid(container, model) {
        var gridModel, view = $('<div class="grid_container">');
        container.append(view);
        model.Reload = function () {
            model.Reload = function () {
                gridModel && gridModel.Reload();
            };
            Global.Grid.Bind({
                elm: view,
                columns: [
                    { field: 'UnitQuentity', title: 'Quentity' },
                    { field: 'TotalSalePrice', title: 'MRP' },
                    { field: 'TotalTradePrice', title: 'Payable TP' },
                    { field: 'TotalVAT', title: 'VAT' },
                    { field: 'TotalDiscount', title: 'Discount' }
                ],
                url: '/ProductArea/ProductAdjustment/GetItems',
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter] },
                Printable: false,
                onComplete: function (model) {
                    gridModel = model;
                },
                selector:false
            });
        };
    };
    function getTab(title, name) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                setGrid(container, model);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = callarOptions.AdjustHistoryId;
        Global.Add({
            title: 'Stock Adjust Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                { field: 'Name', filter: true, title: 'Trade Name' },
                { field: 'GenericName', filter: true, title: 'Generic Name', selected: false },
                { field: 'Strength', filter: true, selected: false },
                { field: 'Category', filter: true, selected: false },
                { field: 'Suplier', filter: true },
                { field: 'SalesUnit', filter: true, selected: false },
                { field: 'PurchaseUnit', filter: true, selected: false },
                { field: 'TotalStock', title: 'Current Stock', type: 2 },
                { field: 'UnitQuentity', title: 'Stock When Adjusted', selected: false, type: 2 },
                { field: 'UnitQuentityChanged', title: 'Adjust Quentity', type: 2 },
                { field: 'TotalTradePrice', title: 'Payable TP(Before)', type: 2 },
                { field: 'TotalSalePrice', title: 'MRP(Before)', selected: false, type: 2 },
                { field: 'TotalPurchasePrice', title: 'Purchase Price(Before)', selected: false, type: 2 },
                { field: 'TotalPurchaseDiscount', title: 'Discount(Before)', selected: false, type: 2 },
                { field: 'TotalPurchaseVat', title: 'VAT(Before)', selected: false, type: 2 },
                { field: 'SalePrice', title: 'MRP(Changing)', selected: false, type: 2 },
                { field: 'PurchasePrice', title: 'TP(Changing)', type: 2 },
                { field: 'PurchaseDiscount', title: 'Discount(Changing)', selected: false, type: 2 },
                { field: 'PurchaseVat', title: 'VAT(Changing)', selected: false, type: 2 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Creator', required: false, filter: true }
                    ],
                    model: model.model,
                    Id: callarOptions.BillId,
                    DetailsUrl: function () {
                        return '/ProductArea/ProductAdjustment/Details/' + callarOptions.AdjustHistoryId;
                    }
                },
                getTab('Items', 'Items')
            ],
            name: 'OnStockAdjustDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=StockAdjustDetails',
        });
    };
};