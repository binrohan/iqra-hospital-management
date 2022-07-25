
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }

    };
    function getDate(date) {
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function getColumns() {
        return [
                { field: 'Name', filter: true },
                { field: 'Rate'},
                { field: 'IsRecoverable', title: 'Is Recoverable',required:false, Add: { type: 'checkbox' } },
                { field: 'Description', required: false, Add: { type: 'textarea', sibling: 1 } },
                { field: 'Status',Add:false },
                { field: 'Creator',  filter: true, className: 'creator', Add: false },
        ]
    };
    function onEdit(model) {
        Global.Add({
            onSubmit: onSubmit,
            name: 'Account',
            columns: getColumns(),
            dropdownList: getDropdown(),
            model: model,
            onSaveSuccess: function () {

            },
            saveChange: '/AccountantArea/TaxComponent/Edit'
        });
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            
        });
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
    };
    Global.List.Bind({
        Name: 'TaxComponent',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/TaxComponent/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Tax Components ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [{
                click: onEdit,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            }]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AccountantArea/TaxComponent/Create'
        },
        Edit: false,
        remove: false
    });
    //Global.Click($('#btn_add_new'), function () {
    //    Global.Add({
    //        name: 'TaxComponent',
    //        url: '/Content/IqraPharmacy/AccountantArea/Content/TaxComponent/AddNew.js',
    //        OnSuccess: function () {
    //            gridModel.Reload();
    //        }
    //    });
    //});
})();
