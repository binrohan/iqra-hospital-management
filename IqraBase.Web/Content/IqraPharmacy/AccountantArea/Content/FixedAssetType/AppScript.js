
(function () {
    var that = this, gridModel,
        methods = ['No Depreciation', 'Straight Line', 'Declining Balance', 'Declining Balance (150%)', 'Declining Balance (200%)', 'Full Depreciation at Purchase'],
        avgMethod = ['Full Month', 'Actual Days'];
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.AccountDepreciationLife = formModel.AccountDepreciationLife || 0;
        formModel.AccountDepreciationSalvageValue = formModel.AccountDepreciationSalvageValue || 0;
    };
    function getDate(date) {
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function getColumns() {
        return [
                { field: 'Name', filter: true },
                { field: 'AssetAccount', title: 'Account', filter: true },
                { field: 'AccumulatedDepreciationAccount', title: 'AD Account', filter: true},
                { field: 'DepreciationExpenseAccount', title: 'DE Account', filter: true },
                { field: 'DepreciationMethodStr', title: 'Method' },
                { field: 'AvaragingMethodStr', title: 'Avaraging' },
                { field: 'RateStr', Add: { dataType: 'float|null' } },
                { field: 'DepreciationLifeStr', title: 'Life'},
                { field: 'Creator',  filter: true, className: 'creator' },
        ]


        //,[DepreciationMethod]
        //,[AvaragingMethod]
        //,[DepreciationRateType]
        //,acttp.[Rate]
        //,[DepreciationLife]
        //,[DepreciationEndtAt]
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
        console.log([response, Global.Copy({},response,true)]);
        response.Data.Data.each(function () {
            this.DepreciationMethodStr = methods[this.DepreciationMethod];
            this.AvaragingMethodStr = avgMethod[this.AvaragingMethod];
            this.RateStr = this.Rate === 0 ? '' : this.Rate + '(%)';
            this.DepreciationLifeStr = this.DepreciationLife === 0 ? '' : this.DepreciationLife + '(Yrs)';
        });
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
    };
    Global.List.Bind({
        Name: 'Account',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/FixedAssetType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Fixed Asset Types ' },
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
            name: 'AddFixedAssetType',
            url: '/Content/IqraPharmacy/AccountantArea/Content/FixedAssetType/AddNew.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();
