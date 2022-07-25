
var Controller = new function () {
    var service = {}, windowModel, callerOptions, selectedModel, gridModel, formModel = {};
    function save() {
        if (selectedModel) {
            callerOptions.onSaveSuccess(selectedModel);
            close();
        } else {
            alert('Please select an order');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductPurchaseArea/Templates/Selector.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function (none) {
        var selectedElm;
        function onSelect(model) {
            if (selectedModel) {
                selectedModel.Selected = false;
                selectedElm.removeClass('i-state-selected');
            }
            selectedModel = model;
            selectedElm = $(this);

            selectedModel.Selected = true;
            selectedElm.addClass('i-state-selected');
        };
        function rowBound(elm) {
            var data = this;
            Global.Click(elm, onSelect, this);
            elm.dblclick(function () {
                selectedModel = data;
                save();
            });
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TradePriceStr = (this.TradePrice || 0).toMoney();
                this.ItemCountStr = (this.ItemCount || 0).toMoney();
                this.TotalDiscountStr = (this.TotalDiscount || 0).toMoney();
                this.SalePriceStr = (this.SalePrice || 0).toMoney();
            });
            response.Data.Total = response.Data.Total.Total;
        };
        function onDetails(model) {
            Global.Add({
                PurchaseId: model.Id,
                name: 'PurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/PurchaseDetails.js',
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onUserDetails(model) {
            Global.Add({
                UserId: model.CreatedBy,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function getFilter(){
            return Global.Filters().Bind({
                container: windowModel.View.find('.filter_container'),
                formModel: formModel,
                filter:callerOptions.filter,
                Type: 'ThisMonth',
                onchange: function (filter) {
                    if (gridModel) {
                        gridModel.page.filter = filter;
                        gridModel.Reload();
                    }
                }
            });
        };
        this.Bind = function () {
            Global.Grid.Bind({
                Name: 'Purchases',
                elm: windowModel.View.find('#purchase_selector_grid'),
                columns: [
                    { field: 'VoucherNo', title: 'Voucher', filter: true, Click: onDetails },
                    { field: 'Suplier', filter: true, Click: onSuplierDetails },
                    { field: 'Creator', filter: true, Click: onUserDetails },
                    { field: 'ItemCountStr' },
                    { field: 'ItemCountStr', title: 'Items' },
                    { field: 'Discount', title: 'Discount(%)' },
                    { field: 'VAT', title: 'VAT(%)' },
                    { field: 'TradePriceStr', title: 'TP Price' },
                    { field: 'SalePriceStr', title: 'MRP Price' },
                    { field: 'MarginDiscount', title: 'Margin Discount' },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ProductPurchaseArea/Purchase/Selector',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Purchase ', filter: getFilter() },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
        this.Reload = function (list) {
            if (gridModel) {
                gridModel.Reload();
            }
        };
    }).call(service.Grid = {});
};