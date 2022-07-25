
(function () {
    var opts = {
        name: 'PharmacyItem',
        url: '/Content/IqraPharmacy/ProductArea/Content/ProductDuplicateController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id;
        }
        formModel.Vat = formModel.Vat === '' ? -1 : formModel.Vat;
        formModel.Discount = formModel.Discount === '' ? -1 : formModel.Discount;
        formModel.PurchaseDiscount = formModel.PurchaseDiscount === '' ? -1 : formModel.PurchaseDiscount;
    };
    function onAdd(model) {
        Global.Add({
            Type: 0,
            ItemType: 0,
            model: model,
            name: 'AddPharmacy',
            url: '/Content/IqraPharmacy/ProductArea/Content/Add.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onEdit(model) {
        Global.Add({
            Type: 1,
            ItemType: 0,
            model: model,
            name: 'EditPharmacy',
            url: '/Content/IqraPharmacy/ProductArea/Content/Add.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDuplicate(model) {
        Global.Add({
            Type: 2,
            ItemType: 0,
            model: model,
            name: 'AddPharmacy',
            url: '/Content/IqraPharmacy/ProductArea/Content/Add.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onBarCodeChange(model) {
        Global.Add({
            model: model,
            name: 'Barcode',
            url: '/Content/IqraPharmacy/ProductArea/Content/BarcodeChangeController.js',
            onSaveSuccess: function (barcode) {

            }
        });
    };
    function onChangeUnitType(model) {
        //opts.model = model;
        //Global.Add(opts);
    };
    function onChangeSalePrice(model) {
        //opts.model = model;
        //Global.Add(opts);
    };
    function onDataBinding(data) {
        
    };
    function onDetails(model) {
        Global.Add({
            ItemId: model.Id,
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
    function onCounterDetails(model) {
        Global.Add({
            model: model,
            name: 'CounterDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/Counter/CounterDetails.js',
        });
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    };
    function onChangeStock(model) {
        Global.Add({
            model: model,
            name: 'StockChange',
            url: '/Content/IqraPharmacy/ProductArea/Content/StockChangeController.js',
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {

            elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
            elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'PharmacyItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', filter: true, Add: false, Click: onDetails, selected:false },
                { field: 'Name', title: 'Trade Name', filter: true, position: 1, Click: onDetails, width: 250 },
                { field: 'GenericName', title: 'Generic Name', filter: true, selected: false },
                { field: 'Category', filter: true, Add: false },
                { field: 'Strength', required: false, filter: true, position: 3, Add: { sibling: 4 } },
                { field: 'Counter', filter: true, Add: false, Click: onCounterDetails },
                { field: 'Suplier', filter: true, Add: false, Click: onSuplierDetails },
                { field: 'TotalStock', title: 'Stock', selected: false, type: 2 },
                { field: 'TotalTradePrice', title: 'Stock Payable TP', selected: false, type: 2 },
                { field: 'TotalSalePrice', title: 'Stock MRP', selected: false, type: 2 },
                { field: 'TotalPurchaseDiscount', title: 'Stock Purchase Discount', selected: false, type: 2 },
                { field: 'UnitConversion', title: 'Pack Size', width: 80, type: 2 },
                { field: 'UnitPurchasePrice', title: 'TP', width: 70, type: 2 },
                { field: 'PurchaseVat', title: 'Purchase VAT(%)', selected: false, type: 2 },
                { field: 'PurchaseDiscount', title: 'Purchase Discount(%)', selected: false, type: 2 },
                { field: 'UnitTradePrice', title: 'Payable TP', selected: false, type: 2 },
                { field: 'UnitSalePrice', title: 'MRP', width: 70, type: 2 },
                { field: 'Vat', title: 'Sale VAT(%)', selected: false, type: 2 },
                { field: 'Discount', title: 'Sale Discount(%)', selected: false, type: 2 },
                { field: 'MaxSaleDiscount', title: 'Max Sale Discount(%)', selected: false, type: 2 },
                { field: 'MinStockToAlert', title: 'Min Stock To Alert', selected: false, type: 2 },
                { field: 'SoldDaysForParchaseRequired', title: 'Sold Days For Parchase Required', selected: false, type: 2 },
                { field: 'IsDeleted', title: 'Is Deleted?', selected: false },
                { field: 'Creator', filter: true, selected: false, Click: onCreatorDetails },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false, selected: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false, selected: false }
            ],
            url: '/PharmacyItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Pharmacy Items' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onBarCodeChange,
                html: '<a style="margin-right:8px;" title="Change Barcode"><i class="fa fa-barcode" aria-hidden="true"></i></a>'
            }, {
                click: onDuplicate,
                html: '<a style="margin-right:8px;" title="Duplicate"><i class="fa fa-clone" aria-hidden="true"></i></a>'
            }, {
                click: onEdit,
                html: '<a style="margin-right:8px;" class="icon_container" title="Edit"><span class="glyphicon glyphicon-edit"></span></a>'
            }, {
                click: onChangeStock,
                html: '<a style="margin-right:8px;" class="icon_container" title="Change Stock"><span class="fa fa-database"></span></a>'
            }],
            selector: {},
            responsive:true
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: { save: '/ProductArea/Product/DeActivate' }
    });
    Global.Click($('#btn_add_new'), onAdd);
})();












