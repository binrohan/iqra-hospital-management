
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            DesignationId: model.Id,
            name: 'DesignationDetails',
            url: '/Areas/CommonArea/Content/Designation/DesignationDetails.js',
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
        Name: 'Designation',
        Grid: {
            elm: $('#grid'),
            columns: [

                    { field: 'Name', filter: true, position: 1, sorting: false },
                    { field: 'EmployeeType', title: 'Stuff Category', sorting: false, filter: true, Add: false },
                    { field: 'CreatedAt',  dateFormat: 'dd/MM/yyyy', Add: false },
                    { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy', Add: false },
                    { field: 'Remarks', title: 'Description', sorting: false, position: 3, required: false, Add: { sibling: 1, type: 'textarea' } },

            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/CommonArea/Designation/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Designations ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/CommonArea/Designation/Create',
            saveChange: '/CommonArea/Designation/Edit',
            dropdownList: [
                            {
                                Id: 'EmployeeTypeId',
                                position: 2,
                                url: '/CommonArea/EmployeeType/AutoComplete',
                                TYPE:'AutoComplete'
                            }
            ],
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
        remove: { save: '/CommonArea/Designation/Delete' }
    });

})();
                