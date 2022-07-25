
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
                { field: 'Rate' },
                { field: 'Description' },
                { field: 'Components', title: 'Component Count' },
                { field: 'Status', Add: false },
                { field: 'Creator', filter: true, className: 'creator' },
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
            saveChange: '/AccountantArea/AppAccount/Edit'
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
        Name: 'TaxRate',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/TaxRate/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} TaxRates ' },
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
        Add: false,
        Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'AddTaxRate',
            url: '/Content/IqraPharmacy/AccountantArea/Content/TaxRate/AddNew.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();
