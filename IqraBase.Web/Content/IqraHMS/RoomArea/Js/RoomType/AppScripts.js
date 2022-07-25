
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
            formModel.IsDeleted = false;
        }
    };
    function onDetails(model) {
        Global.Add({
            RoomTypeId: model.Id,
            name: 'RoomTypeDetails',
            url: '/Areas/RoomArea/Content/RoomType/RoomTypeDetails.js',
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
        Name: 'RoomType',
        Grid: {
            elm: $('#grid'),
            columns: [
                
                    { field: 'Name', title: 'Name', filter: true },
                    { field: 'IsDeleted', title: 'IsDeleted',Add:false },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                    { field: 'CreatedAt', title: 'CreatedAt',Add:false, dateFormat: 'dd mmm-yyyy' },
                    { field: 'UpdatedAt', title: 'UpdatedAt', Add:false, dateFormat: 'dd mmm-yyyy' },
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/RoomArea/RoomType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} RoomTypes ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/RoomArea/RoomType/Create',
            saveChange: '/RoomArea/RoomType/Edit',
            //details: function (data) {
                //return '/RoomArea/RoomType/Details?Id=' + data.Id;
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
        remove: { save: '/RoomArea/RoomType/Delete' }
    });

})();;
                