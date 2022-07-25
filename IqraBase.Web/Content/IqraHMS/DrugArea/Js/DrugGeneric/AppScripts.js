
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            DrugGenericId: model.Id,
            name: 'DrugGenericDetails',
            url: '/Areas/DrugArea/Content/DrugGeneric/DrugGenericDetails.js',
        });
    };
    function onAddOrderCategory(model) {
        Global.Add({
            model: model,
            name: 'OrderCategory',
            url: '/Areas/SuplierArea/Content/Suplier/AddOrderCategoryController.js',
        });
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'DrugGeneric',
        Grid: {
            elm: $('#grid'),
            columns: [
                
                    { field: 'GenericName', title: 'GenericName', filter: true },
                    { field: 'Precaution', title: 'Precaution', filter: true },
                    { field: 'Indication', title: 'Indication', filter: true },
                    { field: 'ContraIndication', title: 'ContraIndication', filter: true },
                    { field: 'Dose', title: 'Dose', filter: true },
                    { field: 'SideEffect', title: 'SideEffect', filter: true },
                    { field: 'ModeOfAction', title: 'ModeOfAction', filter: true },
                    { field: 'Interaction', title: 'Interaction', filter: true },
                    { field: 'Remarks', title: 'Remarks', filter: true, required: false },
                    { field: 'Name', title: 'Name', filter: true },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/DrugArea/DrugGeneric/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} DrugGenerics ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/DrugArea/DrugGeneric/Create',
            saveChange: '/DrugArea/DrugGeneric/Edit',
            //details: function (data) {
                //return '/DrugArea/DrugGeneric/Details?Id=' + data.Id;
            //},
            additionalField: [
                //{ field: 'AccountNo', required: false, title: 'Payable Account No', position: 2 },
                //{ field: 'AccountName', required: false, title: 'Payable Account Name', position: 2 },
                //{ field: 'Fax', required: false, position: 5 },
                //{ field: 'Vat', position: 8 },
                //{ field: 'Discount', position: 9 },
                //{ field: 'PurchaseDiscount', position: 10 },
                //{ field: 'Remarks', required: false, position: 12, Add: { type: 'textarea' } }
            ]
        },
        remove: { save: '/DrugArea/DrugGeneric/Delete' }
    });

})();;
                