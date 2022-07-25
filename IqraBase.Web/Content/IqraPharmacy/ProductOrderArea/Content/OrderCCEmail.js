
(function () {
    var opts = {
        name: 'ItemType',
        url: '/Content/Js/ItemType/AddCategoryController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onRowBound(elm) {
         
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('a').css({ color: 'red' });
            elm.find('.glyphicon-trash').closest('span').css({ opacity: 0.4, cursor: 'default' });
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'OrderEmails',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, Add: false },
                { field: 'Email', required: false, filter: true, Add: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false }
            ],
            url: '/ProductOrderArea/OrderEmails/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Emails ' },
            rowBound: onRowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/ProductOrderArea/OrderEmails/AddNew',
            saveChange: '/ProductOrderArea/OrderEmails/Update',
            dropdownList: [{
                Id: 'UserId', url: '/EmployeeArea/Employee/DropDown',
            }]
        },
        remove: { save: '/ProductOrderArea/OrderEmails/Delete' }
    });
})();
