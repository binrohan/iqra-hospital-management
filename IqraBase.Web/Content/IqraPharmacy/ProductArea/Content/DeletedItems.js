(function () {
    var that = this, gridModel;
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
    function onActivate(model) {
        var elm = $(this);
        if (model.Loading) {
            alert('This Item is being activated. Please wait while activating.');
            return;
        } if (model.IsDeleted === 0) {
            alert('This Item is already activated.');
            return;
        }
        model.Loading = true;
        elm.find('span').removeClass('glyphicon-ok').addClass('glyphicon-repeat fast-left-spinner');
        Global.CallServer('/ProductArea/Product/Activate?id=' + model.Id, function (response) {
            elm.find('span').addClass('glyphicon-ok').removeClass('glyphicon-repeat fast-left-spinner');
            model.Loading = false;
            if (!response.IsError) {
                elm.closest('tr').css({ color: '#333' }).find('.product_name a, .updator a').css({ color: '#333' });
                model.IsDeleted = 0;
                elm.remove();
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            response.Id = -8;
            alert('Network Errors.');
        }, {}, 'POST');
    };
    function onDataBinding(data) {

    };
    function rowBound(elm) {
        if (this.IsDeleted) {

            elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
            elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
        }
    };
    Global.List.Bind({
        Name: 'DeletedItems',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', filter: true, Add: false, Click: onDetails, selected: false },
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
            url: '/ProductArea/Product/GetDeletedItems',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Deleted Items' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onActivate,
                html: '<a title="Activate This Item"><span class="glyphicon glyphicon-ok"></span></a>'
            }],
            Responsive: true,
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
})();
