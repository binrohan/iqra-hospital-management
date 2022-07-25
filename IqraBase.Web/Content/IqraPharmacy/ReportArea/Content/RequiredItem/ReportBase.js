
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, inputs, gridModel, callerOptions,
        page = { 'PageNumber': 1, 'PageSize': 10, filter: [] };
    var titles = ['All Required Items', 'Pharmacy Required Items', 'None-Pharmacy Required Items', 'Summary Required Items', ''];
    function setTitle() {
        formModel.title = titles[callerOptions.Type];
    }
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function refresh() {
        gridModel && gridModel.Reload();
    };
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
        
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        page.filter = callerOptions.filter || [];
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
            setTitle();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/RequiredItemReport.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                console.log(windowModel);
                windowModel.View.css({'min-width':'950px'});
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_refresh').click(refresh);
                windowModel.Show();
                service.Grid.Bind();
                setTitle();
            }, noop);
        }
    };
    (function () {
        var typeId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                typeId = callerOptions.Type;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            console.log(model);
            !callerOptions.IsSummary&& Global.Add({
                model: model,
                Type:model.Type-1,
                name: 'PurchaseReportByCounter',
                url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/ByCounter.js',
            });
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(model) {
            model.RequiredQuantity = model.RequiredQuantity.toMoney();
            model.PayableAmount = model.PayableAmount.toMoney();
            model.TradePrice = model.TradePrice.toMoney();
            model.TotalDiscount = model.TotalDiscount.toMoney();
            Global.Copy(formModel, model, true);
        };
        function onDataBinding(response) {
            var model = {
                RequiredQuantity: 0,
                PayableAmount: 0,
                TradePrice: 0,
                TotalDiscount:0
            };
            response.Data.Data.each(function () {
                model.RequiredQuantity += this.RequiredQuantity;
                this.RequiredQuantity = this.RequiredQuantity.toMoney();
                model.PayableAmount += this.TradePrice;
                this.PayableAmount = this.TradePrice.toMoney();
                model.TradePrice += this.TotalDiscount + this.TradePrice;
                this.TradePrice = (this.TotalDiscount + this.TradePrice).toMoney();
                model.TotalDiscount += this.TotalDiscount;
                this.TotalDiscount = this.TotalDiscount.toMoney();
            });
            setSummary(model);
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Counter', filter: true },
                    { field: 'RequiredQuantity', title: 'Required Quantity' },
                    { field: 'TradePrice', title: 'Trade Price' },
                    { field: 'TotalDiscount', title: 'Discount' },
                    { field: 'PayableAmount', title: 'Payable Amount' }


                ],
                url: '/ReportArea/RequiredItem/ReportBaseData',
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                }
            };
            return opts;
        };
        this.Bind = function () {
            if (gridModel) {
                gridModel.Reload();
            } else {
                bind();
            }
        };
    }).call(service.Grid = {});
};