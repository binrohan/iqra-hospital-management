
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id;
            formModel.Editable = data.Editable;
        } else {
            formModel.Editable = 1;
        }
    };
    function getDate(date) {
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            
        });
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'BalanceSheetSettingDetails',
            url: '/Content/IqraPharmacy/AccountantArea/Content/BalanceSheetSetting/Details.js',
        });
    };
    Global.List.Bind({
        Name: 'Account',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, click: onDetails },
                { field: 'Editable', title: 'Is Editable', add: false },
                { field: 'Creator', filter: true, className: 'creator', Add: false },
            ],
            url: '/AccountantArea/BalanceSheetSetting/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Account Reports ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AccountantArea/BalanceSheetSetting/Create',
            saveChange: '/AccountantArea/BalanceSheetSetting/Edit'
        },
        remove: { save: '/AccountantArea/BalanceSheetSetting/Delete' }
    });
})();



