
var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {};
    function save() {
        selected.model&&callerOptions.onSaveSuccess(selected.model);
        close();
    };
    function close() {
        //dataSource = [];
        windowModel && windowModel.Hide();
    };
    function show(options) {
        var model;
        selected = {};
        added = {};
        dataSource.each(function () {
            this.Selected = false;
        });
        windowModel.Show();
        gridModel && gridModel.views.tBody.find('.i-state-selected').removeClass('i-state-selected');
        gridModel && gridModel.Reload();
    };
    this.Show = function (model) {
        selected = {};
        //dataSource = [];
        callerOptions = model;
        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/Selector.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                show(callerOptions);
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var types = ['Purchase', 'Return', 'Adjust', 'Purchase By Return'];
        function onSelect(model) {
            gridModel.views.tBody.find('.i-state-selected').removeClass('i-state-selected');
            model.Selected = true;
            selected = { model: model, elm: this };
            $(this).addClass('i-state-selected');
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
            var model = this;
            elm.dblclick(function () {
                callerOptions.onSaveSuccess(model);
                close();
            });
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Stock = this.UnitQuentity - this.UnitQuentitySold;
                this.Type = types[this.Type] || '';
                this.UnitPurchasePricestr = this.UnitPurchasePrice.toFloat();
                this.UnitVATstr = this.UnitVAT.toFloat();
                this.UnitDiscountstr = this.UnitDiscount.toFloat();
                this.UnitTradePricestr = this.UnitTradePrice.toFloat();
            });
            if (response.Data.Data.length === 1) {
                //callerOptions.onSaveSuccess(response.Data.Data[0]);
                //close();
            }
            dataSource = response.Data.Data;
        };
        function onDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [
                    { field: 'Name', sorting: false, Click: onDetails },
                    { field: 'Unit', sorting: false },
                    { field: 'UnitQuentity', title: 'Purchase QNT', sorting: false },
                    { field: 'UnitQuentitySold', title: 'Sold QNT', sorting: false },
                    { field: 'Stock', sorting: false },
                    { field: 'UnitPurchasePricestr', title: 'Unit TP', sorting: false },
                    { field: 'UnitVATstr', title: 'Unit VAT', sorting: false },
                    { field: 'UnitDiscountstr', title: 'Unit Discount', sorting: false },
                    { field: 'UnitTradePricestr', title: 'Net Unit TP', sorting: false },
                    { field: 'Type', sorting: false },
                    { field: 'CreatedAt', sorting: false, dateFormat: 'dd/MM/yyyy hh:mm' },
                    { field: 'Creator', sorting: false }
                ],
                url: function () {
                    return '/ProductReturnArea/SuplierReturn/StockedPurchaseListByItem?itemId=' + callerOptions.model.Id;
                },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: '{0}-{1} of {2} Purchases' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
    }).call(service.Grid = {});
};