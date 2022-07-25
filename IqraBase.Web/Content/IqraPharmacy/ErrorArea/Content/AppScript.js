



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
                //{ field: 'Code', filter: true, Add: false, Click: onDetails },
                { field: 'Name', title: 'Trade Name', filter: true, position: 1, Click: onDetails, width: 250 },
                { field: 'Category', filter: true, Add: false },
                { field: 'Strength', required: false, filter: true, position: 3, Add: { sibling: 4 } },
                { field: 'Suplier', filter: true, Add: false, Click: onSuplierDetails },
                { field: 'TotalStock', title: 'Stock', width: 60 },
                { field: 'UnitConversion', title: 'Pack Size', width: 80 },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/ErrorArea/DataError/TPPriceData',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Pharmacy Items' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onEdit,
                html: '<a style="margin-right:8px;" class="icon_container" title="Edit"><span class="glyphicon glyphicon-edit"></span></a>'
            }],

        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();












