
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
        return [{ field: 'CreatedAt', title: 'Date' }, { field: 'PaidAmount' }]
    };
    function getSuplierColumns(name, func) {
        return [{ field: name, filter: true,click:func }, { field: 'PaidAmount' }]
    };
    function onDataBinding(response) {
        formModel.PaidAmount = (response.Data.Total.PaidAmount || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            this.PaidAmount = this.PaidAmount.toMoney();
        });
    };
    function getDate(date) {
        
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
        this.Approver && elm.find('.approver').append(getDate(this.ApprovedAt));
        if (this.Approver) {
            elm.find('.btn_approve').remove();
        }
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
            Url: 'ByItem',
            filter: filters.slice(),
            columns: [
                { field: 'Suplier', filter: true },
                { field: 'VoucherNo', filter: true },
                { field: 'PaidAmount', title: 'Amount' },
                { field: 'PurchaseAmount' },
                { field: 'Description', filter: true },
                { field: 'Creator', className: 'creator' },
                { field: 'Approver', className: 'approver' }
            ],
            binding: onDataBinding,
            bound: onRowBound,
            actions: [{
                click: onApprove,
                html: '<a style="margin-right:8px;" class="icon_container btn_approve" title="Approve Payment"><span class="glyphicon glyphicon-open"></span></a>'
            }],
        }
    };
    function setTemplate() {
        $('#filter_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>PaidAmount</label></div>' +
        '<div><span data-binding="PaidAmount" class="form-control auto_bind" /></div>' +
    '</div>');
    };
    var model = {},formModel = {}, filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        type: 'ThisMonth',
        onchange: function (filter) {
            if (model.gridModel) {
                model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    });
    model = {
        Base: {
            Url: '/ExpenseArea/SuplierPayment/',
        },
        items: [
            getDaily('Daily', 'GetDaily'),
            getDaily('Monthly', 'GetMonthly'),
            getDaily('Suplier-Wise', 'BySuplier', getSuplierColumns('Suplier',noop)),
            getDaily('Counter-Wise', 'ByCounter', getSuplierColumns('Counter', noop)),
            getItemWise()
        ]
    };
    setTemplate();
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[3].set(model.items[3]);
})();

