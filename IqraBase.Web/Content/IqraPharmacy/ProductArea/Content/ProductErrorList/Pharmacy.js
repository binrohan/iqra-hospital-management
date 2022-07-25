
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
            model: model,
            name: 'EditPharmacy',
            url: '/Content/IqraPharmacy/ProductArea/Content/Edit.js',
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
    function onDuplicate(model) {
        //opts.model = model;
        //Global.Add(opts);
        onAdd(model);
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
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'PharmacyItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                //{ field: 'Code', filter: true, Add: false, Click: onDetails },
                { field: 'Name', title: 'Trade Name', filter: true, position: 1, Click: onDetails, width: 250 },
                { field: 'Category', filter: true, Add: false },
                { field: 'Strength', required: false, filter: true, position: 3, Add: { sibling: 4 } },
                { field: 'Suplier', filter: true, Add: false, Click: onSuplierDetails },
                { field: 'TotalStock', title: 'Stock', width: 60 },
                { field: 'OrginalStock', title: 'Orginal Stock' },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/ProductArea/ProductErrorList/GetPharmacyData',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories' },
            onDataBinding: onDataBinding,
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

        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        Edit: false,
        remove: { save: '/ProductArea/Product/DeActivate' }
    });
    Global.Click($('#btn_add_new'), onAdd);
})();
