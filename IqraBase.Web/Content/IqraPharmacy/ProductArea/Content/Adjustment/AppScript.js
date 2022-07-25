
//(function () {
//    function onDetails(model) {
//        //Global.Add({
//        //    SuplierId: model.Id,
//        //    name: 'SuplierDetails',
//        //    url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
//        //});
//    };
//    function onDataBinding(data) {
//    };
//    var that = this, gridModel;
//    Global.List.Bind({
//        Name: 'Counter',
//        Grid: {
//            elm: $('#grid'),
//            columns: [
//                { field: 'Name', filter: true,title:'Trade Name' },
//                { field: 'GenericName', filter: true, title: 'Generic Name' },
//                { field: 'Category', filter: true },
//                { field: 'Suplier', filter: true },
//                { field: 'TotalStock', title:'Current Stock' },
//                { field: 'UnitQuentity', title: 'Adjust Quentity' },
//                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
//                { field: 'Creator', required: false, filter: true }
//            ],
//            url: '/ProductArea/ProductAdjustment/Get',
//            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Adjustment ' },
//            onDataBinding: onDataBinding,
//        }, onComplete: function (model) {
//            gridModel = model;
//        }, Add: false,
//        Edit:false,
//        remove: false
//    });
//})();

var Controller = {};
(function () {
    var that = this, gridModel, service = {}, unitConvertion = 0, accessModel, callarOptions = {};
    function onProductDetails(model) {
        Global.Add({
            ItemId: model.ItemId,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
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
    function onAdjustmentDetails(model) {
        Global.Add({
            AdjustHistoryId: model.Id,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/Adjustment/OnDetails.js',
        });
    };
    function getDailyColumns() {
        return [
            { field: 'CreatedAt', title: 'Date' },
            { field: 'UnitQuentity', title: 'Stock When Adjusted', type: 2 },
            { field: 'UnitQuentityChanged', title: 'Adjust Quentity', type: 2 },
            { field: 'TotalTradePrice', title: 'Payable TP(Before)', type: 2 },
            { field: 'TotalSalePrice', title: 'MRP(Before)', type: 2 },
            { field: 'TotalPurchasePrice', title: 'Purchase Price(Before)', type: 2, selected: false },
            { field: 'TotalPurchaseDiscount', title: 'Discount(Before)', type: 2, selected: false },
            { field: 'TotalPurchaseVat', title: 'VAT(Before)', type: 2, selected: false },
            { field: 'SalePrice', title: 'MRP(Changing)', type: 2 },
            { field: 'PurchasePrice', title: 'Purchase Price(Changing)', type: 2, selected: false },
            { field: 'PurchaseDiscount', title: 'Discount(Changing)', type: 2, selected: false },
            { field: 'PurchaseVat', title: 'VAT(Changing)', type: 2, selected: false }
        ]
    };
    function getDaily(name, dataUrl, columns) {
        columns = columns || getDailyColumns();
        return {
            Name: name,
            Url: dataUrl,
            filter: filters.slice(),
            columns: columns,
            //binding: onDataBinding
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'Name', filter: true, title: 'Trade Name', click: onProductDetails },
                { field: 'GenericName', filter: true, title: 'Generic Name', selected: false },
                { field: 'Strength', filter: true,selected:false },
                { field: 'Category', filter: true, selected: false },
                { field: 'Suplier', filter: true, click: onSuplierDetails },
                { field: 'TotalStock', title: 'Current Stock',type:2 },
                { field: 'UnitQuentity', title: 'Stock When Adjusted', selected: false, type: 2 },
                { field: 'UnitQuentityChanged', title: 'Adjust Quentity', type: 2 },
                { field: 'TotalTradePrice', title: 'Payable TP(Before)', type: 2 },
                { field: 'TotalSalePrice', title: 'MRP(Before)', selected: false, type: 2 },
                { field: 'TotalPurchasePrice', title: 'Purchase Price(Before)', selected: false, type: 2 },
                { field: 'TotalPurchaseDiscount', title: 'Discount(Before)', selected: false, type: 2 },
                { field: 'TotalPurchaseVat', title: 'VAT(Before)', selected: false,type:2 },
                { field: 'SalePrice', title: 'MRP(Changing)', selected: false,type:2 },
                { field: 'PurchasePrice', title: 'TP(Changing)', type: 2 },
                { field: 'PurchaseDiscount', title: 'Discount(Changing)', selected: false, type: 2 },
                { field: 'PurchaseVat', title: 'VAT(Changing)', selected: false, type: 2 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Creator', required: false, filter: true, click: onUserDetails }
            ],
            actions: [{
                click: onAdjustmentDetails,
                html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-open" aria-hidden="true"></i></a>'
            }],
        }
    };
    function getSummary() {
        return [
            { field: 'UnitQuentity', title: 'Stock When Adjusted',type:2 },
            { field: 'UnitQuentityChanged', title: 'Adjust Quentity', type: 2 },
            { field: 'TotalTradePrice', title: 'Payable TP(Before)', type: 2 },
            { field: 'TotalSalePrice', title: 'MRP(Before)', type: 2 },
            { field: 'TotalPurchasePrice', title: 'Purchase Price(Before)', type: 2 },
            { field: 'TotalPurchaseDiscount', title: 'Discount(Before)', type: 2 },
            { field: 'TotalPurchaseVat', title: 'VAT(Before)', type: 2 },
            { field: 'SalePrice', title: 'MRP(Changing)', type: 2 },
            { field: 'PurchasePrice', title: 'Purchase Price(Changing)', type: 2 },
            { field: 'PurchaseDiscount', title: 'Discount(Changing)', type: 2 },
            { field: 'PurchaseVat', title: 'VAT(Changing)', type: 2 }
        ];
    };
    var model = {}, formModel = {}, filters;
    function setFilter(container, filter) {
        filters = Global.Filters().Bind({
            container: container.find('#filter_container'),
            formModel: formModel,
            filter: filter,
            type: 'ThisMonth',
            onchange: function (filter) {
                if (model.gridModel) {
                    model.gridModel.page.filter = filter;
                    model.gridModel.Reload();
                }
            }
        });
    };
    function setTabs(container) {
        model = {
            container: container,
            Base: {
                Url: '/ProductArea/ProductAdjustment/',
            },
            items: [
                getDaily('Daily', 'GetDaily'),
                getDaily('Monthly', 'GetMonthly'),
                getItemWise()
            ],
            Summary: {
                container: container.find('#summary_container'),
                Items: getSummary()
            }
        };
        Global.Form.Bind(formModel, container.find('#filter_container'));
        Global.Tabs(model);
        callarOptions.BaseModel.Reload = function () {
            model.items[2].set(model.items[2]);
        };
    };
    function setDefaultOpt(opt) {
        opt = opt || {};
        callarOptions = opt;
        opt.container = opt.container || $('#page_container');
        opt.BaseModel = opt.BaseModel || {};
        return opt;
    };
    Controller.Show = function (opt) {
        opt = setDefaultOpt(opt);
        var container = opt.container || $('#page_container'), filter = opt.filter;
        setFilter(container, filter);
        setTabs(container, filter);
        opt.OnLoaded && !service.Loaded && opt.OnLoaded(model);
        service.Loaded = true;
    };
})();


