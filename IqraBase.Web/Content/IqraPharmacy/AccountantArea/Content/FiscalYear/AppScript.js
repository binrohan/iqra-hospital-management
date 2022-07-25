
(function () {
    var that = this, gridModel,status=['Year Ended','Active Year'];
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.FYStatus = status[this.FYStatus] || '';
        });
    };
    Global.List.Bind({
        Name: 'FiscalYear',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name',filter:true },
                { field: 'FYBegin', dateFormat: 'dd/MM/yyyy',add:false },
                { field: 'FYEnd', dateFormat: 'dd/MM/yyyy', add: false },
                { field: 'FYStatus', add: false, className:'status' },
                { field: 'TotalCredit', add: false },
                { field: 'TotalDebit', add: false }
            ],
            url: '/AccountantArea/FiscalYear/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Fiscal Years ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: { save: '/AccountantArea/FiscalYear/Delete' }
    });
    (function () {
        Global.Click($('#btn_add_new'), function () {
            Global.Add({
                name: 'OnAddFiscalYear',
                url: '/Content/IqraPharmacy/AccountantArea/Content/FiscalYear/AddFiscalYear.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        });
    })();
})();
