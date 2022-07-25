
(function () {
    var opts = {
        name: 'Customer',
        url: '/Content/Js/Customer/AddCustomerController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Customer',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'CustomerId', filter: true, position: 1 },
                { field: 'Name', filter: true, position: 3 },
                { field: 'Sex', filter: true, Add: false },
                { field: 'Address1', filter: true, required: false, position: 20, Add: { type: 'textarea' } },
                { field: 'CellPhone', filter: true, position: 5 },
                { field: 'Discount', position: 4, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false }
            ],
            url: '/Customer/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/Customer/Create',
            saveChange: '/Customer/Edit',
            dropdownList: [
                {
                    Id: 'Sex',
                    dataSource: [{ value: 'Male', text: 'Male' }, { value: 'Female', text: 'Female' }],
                    position: 2
                }
            ],
            additionalField: [
                { field: 'Address2', required: false, title: 'Permanent Address', position: 21, Add: { type: 'textarea' } },
                { field: 'PostCode', required: false, title: '', position: 9 },
                { field: 'PostOffice', required: false, title: '', position: 10 },
                { field: 'Thana', title: '', required: false, position: 11 },
                { field: 'Zilla', title: '', required: false, position: 12 },
                { field: 'LandPhone', title: '', required: false, position: 6 }
            ]
        },
        remove: { save: '/Customer/Delete' }
    });
})();
