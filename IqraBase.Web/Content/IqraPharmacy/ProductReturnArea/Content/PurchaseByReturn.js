(function () {
    var that = this, gridModel, model = {}, formModel = {}, filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        onchange: function (filter) {
            if (model.gridModel) {
                model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    });;
    function onDetails(model) {
        Global.Add({
            name: 'PurchaseByReturnDetails',
            url: '/Content/IqraPharmacy/ProductReturnArea/Content/PurchaseByReturnDetails.js',
            model: model,
            tab: 'ReturnItems'
        });
    };
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }, { field: 'PaidAmount' }]
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
            Name: 'Voucher-Wise',
            Url: 'ByItem',
            filter: filters.slice(),
            columns: [
                { field: 'VoucharNo', filter: true, width: 120, click: onDetails },
                { field: 'SaleVoucherNo', title: 'Sale Voucher', filter: true, width: 120 },
                { field: 'ItemReturn', title: 'items', width: 55 },
                { field: 'SoldPrice', title: 'Sale Price', width: 80 },
                { field: 'ReturnPrice', title: 'Return Amount' },
                { field: 'Discount', width: 70 },
                { field: 'Vat', width: 70 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false },
                //{ field: 'Computer', required: false, filter: true, Add: false }
            ],
            binding: onDataBinding,
            actions: [{
                click: onDetails,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }],
        }
    };
    function setTemplate() {
        $('#filter_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>ItemReturn</label></div>' +
        '<div><span data-binding="ItemReturn" class="form-control auto_bind" /></div>' +
    '</div><div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>SoldPrice</label></div>' +
        '<div><span data-binding="SoldPrice" class="form-control auto_bind" /></div>' +
    '</div><div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>ReturnPrice</label></div>' +
        '<div><span data-binding="ReturnPrice" class="form-control auto_bind" /></div>' +
    '</div>');
    };
    (function () {
        function onAdd(model) {
            Global.Add({
                model: model,
                name: 'AddPurchaseByReturnController',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/AddPurchaseByReturnController.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onAddReturnByItem(model) {
            Global.Add({
                model: model,
                name: 'AddReturnByItemController',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/AddReturnByItem.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        Global.Click($('#btn_add_by_voucher'), onAdd);
        Global.Click($('#btn_add_by_items'), onAddReturnByItem);
    })();
    (function () {
        model = {
            Base: {
                Url: '/ProductReturnArea/PurchaseByReturn/',
            },
            items: [
                getDaily('Daily', 'Daily'),
                getDaily('Monthly', 'Monthly'),
                getItemWise()
            ]
        };
        setTemplate();
        Global.Form.Bind(formModel, $('#filter_container'));
        Global.Tabs(model);
        model.items[2].set(model.items[2]);
    })();
})();
