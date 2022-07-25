
(function () {
    function onDetails(data) {
        Global.Add({
            AssetId: data.Id,
            model: data,
            name: 'FixedAssetDetails',
            url: '/Content/IqraPharmacy/AccountantArea/Content/FixedAsset/OnDetails.js',
            OnChange: function () {
                model.gridModel && model.gridModel.Reload && model.gridModel.Reload();
            }
        });
    };
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
        //formModel.PaidAmount = (response.Data.Total.PaidAmount || 0).toMoney(4);
        response.Data.Total.BookValue = response.Data.Total.Amount - response.Data.Total.DepreciationCost;
        response.Data.Data.each(function () {
            this.BookValue = this.Amount - this.DepreciationCost;
        });
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
                { field: 'Name', filter: true, click: onDetails },
                { field: 'Number', filter: true },
                { field: 'PurchaseAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Amount', title: 'Purchase Price',type:2 },
                { field: 'BookValue', title: 'Book Value', type: 2,sorting:false },
                { field: 'Rate', type: 2 },
                { field: 'DepreciationLife' },
                { field: 'Creator', required: false, filter: true, className: 'creator' },
            ],
            binding: onDataBinding,
            bound: onRowBound,
            actions: [
                //{
                //click: onApprove,
                //html: '<a style="margin-right:8px;" class="icon_container btn_approve" title="Approve Payment"><span class="glyphicon glyphicon-open"></span></a>'
                //}
            ],
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
            Url: '/AccountantArea/FixedAsset/',
        },
        items: [
            getDaily('Daily', 'GetDaily'),
            getDaily('Monthly', 'GetMonthly'),
            getItemWise()
        ],
        Summary: {
            container: $('#filter_container'),
            Items: [{ field: 'Amount', title: 'Purchase Price', type: 2 },
                { field: 'DepreciationCost', title: 'Depreciation Cost', type: 2 },
                { field: 'BookValue', title: 'Book Value', type: 2 }]
        }
    };
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[2].set(model.items[2]);

    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'AddFixedAsset',
            url: '/Content/IqraPharmacy/AccountantArea/Content/FixedAsset/AddNew.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();

