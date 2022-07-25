
(function () {
    function onApprove(dataModel) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'Approve Payment',
                msg: 'Do you want to Approve this Payment?',
                save: '/ExpenseArea/SuplierPayment/Approve',
                data: { Id: dataModel.Id },
                onsavesuccess: function () {
                    model.gridModel.Reload();
                }, onerror: function (response) {
                    if (response.Msg) {
                        alert(response.Msg);
                    } else {
                        Global.Error.Show(response);
                    }
                },
            }
        });
    };
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }, { field: 'Amount' }]
    };
    function onDataBinding(response) {
        //formModel.Amount = (response.Data.Total.Amount || 0).toMoney(4);
        //response.Data.Total = response.Data.Total.Total;
    };
    function getDate(date) {
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
    };
    function getDaily(name, dataUrl, columns) {
        columns = columns || getDailyColumns();
        return {
            Name: name,
            Url: dataUrl,
            filter: filters.slice(),
            columns: columns,
            binding: onDataBinding
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'AssetAccount', filter: true },
                { field: 'AccumulatedDepreciationAccount', title: 'Depreciation Account', filter: true },
                { field: 'DepreciationExpenseAccount', title: 'Expense Account', filter: true },
                { field: 'Amount', type: 2,width:100 },
                { field: 'From', dateFormat: 'dd-mmm yyyy' },
                { field: 'To', dateFormat: 'dd-mmm yyyy' },
                { field: 'Creator', required: false, filter: true, className: 'creator' }
            ],
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    var model = {},formModel = {}, filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        type: 'LastOneYear',
        onchange: function (filter) {
            if (model.gridModel) {
                model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    });
    model = {
        Base: {
            Url: '/AccountantArea/Depreciation/',
        },
        items: [
            getDaily('Daily', 'GetDaily'),
            getDaily('Monthly', 'GetMonthly'),
            getItemWise()
        ],
        Summary: {
            container: $('#filter_container'),
            Items: [{ field: 'Amount', title: 'Amount', type: 2 }]
        }
    };
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[2].set(model.items[2]);
    Global.Click($('#btn_run_depreciation'), function () {
        Global.Add({
            name: 'AddDepreciation',
            url: '/Content/IqraPharmacy/AccountantArea/Content/Depreciation/AddNew.js',
            OnSuccess: function () {
                model.gridModel&&model.gridModel.Reload();
            }
        });
    });
})();

