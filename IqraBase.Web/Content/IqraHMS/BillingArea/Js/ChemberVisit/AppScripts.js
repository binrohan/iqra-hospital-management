

(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            ChemberVisitId: model.Id,
            name: 'ChemberVisitDetails',
            url: '/Areas/BillingArea/Content/ChemberVisit/ChemberVisitDetails.js',
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
        Name: 'ChemberVisit',
        Grid: {
            elm: $('#grid'),
            columns: [
                
                    { field: 'Fees', title: 'Fees' },
                    { field: 'DefaultFees', title: 'Default Fees' },
                    { field: 'MeetingAt', title: 'Meeting At', dateFormat: 'dd mmm-yyyy' },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/BillingArea/ChemberVisit/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ChemberVisits ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/BillingArea/ChemberVisit/Create',
            saveChange: '/BillingArea/ChemberVisit/Edit',
            //details: function (data) {
                //return '/BillingArea/ChemberVisit/Details?Id=' + data.Id;
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
        remove: { save: '/BillingArea/ChemberVisit/Delete' }
    });

})();;
                