
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            TotalBillsId: model.Id,
            name: 'TotalBillsDetails',
            url: '/Areas/BillingArea/Content/TotalBills/TotalBillsDetails.js',
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
        Name: 'TotalBills',
        Grid: {
            elm: $('#grid'),
            columns: [

                { field: 'RelationType', title: 'Bill From' },
                { field: 'Amount', title: 'Amount', type: 2 },
                { field: 'Discount', title: 'Discount', type: 2 },
                { field: 'PayableAmount', title: 'Net Amount', type: 2 },
                { field: 'PaidAmount', title: 'Paid Amount', type: 2 },
                { field: 'DueAmount', title: 'Due Amount', type: 2 },
                //{ field: 'Remarks', title: 'Remarks', filter: true, width: 60 },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy'},

            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/BillingArea/TotalBills/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} TotalBillss ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 60 },
            Periodic: {
                container: $('#filter_container'),
                type: 'ThisMonth',
            },
            Summary: {
                Container: $('#summary_container'),
                Items: [
                    { field: 'Amount', title: 'Amount', type: 2 },
                    { field: 'Discount', title: 'Discount', type: 2 },
                    { field: 'PayableAmount', title: 'Net Amount', type: 2 },
                    { field: 'PaidAmount', title: 'Paid Amount', type: 2 },
                    { field: 'DueAmount', title: 'Due Amount', type: 2 },
                ]
            },
        }, onComplete: function (model) {
            gridModel = model;
        },

        Add: false,
        Edit: false,
        remove: false,

    });
})();;
                