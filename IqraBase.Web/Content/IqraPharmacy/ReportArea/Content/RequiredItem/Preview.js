
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, gridModel, callerOptions, dprPeriod,
        page = { 'PageNumber': 1, 'PageSize': 500, showingInfo: ' {0}-{1} of {2} Items ', filter: [] };
    function save() {
        windowModel.Wait('Please Wait while saving data......');
        Global.Uploader.upload({
            data: callerOptions.model,
            url: '/Order/AddNew',
            onProgress: function (data) {
                //console.log(data);
            },
            onComplete: function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    close(function () { callerOptions.close(); });
                } else if (response.Id === -4) {
                }
                else
                    Global.Error.Show(response);
            },
            onError: function () {
                windowModel.Free();
                response.Id = -8;
                Global.Error.Show(response, { user: '' })
            }
        });
    }
    function close(func) {
        func = func || function () { };
        windowModel && windowModel.Hide(func);
    };
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
    };
    function populateSummary() {
        formModel.RequiredQuantity = callerOptions.model.OrderedQuentity;
        formModel.TradePrice = callerOptions.model.TotalTradePrice.toMoney();
        formModel.TotalDiscount = callerOptions.model.TotalDiscount.toMoney();
        formModel.PayableAmount = callerOptions.model.TotalPayablePrice.toMoney();
        formModel.SalePrice = callerOptions.model.TotalSalePrice.toMoney();
        formModel.TotalVat = callerOptions.model.TotalVat.toMoney();
    };
    this.Show = function (model) {
        callerOptions = model
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
            populateSummary();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/OrderPreview.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                setSummaryTemplate(windowModel);
                Global.Click(windowModel.View.find('.btn_cancel'), close, noop);
                windowModel.View.find('.btn_save').click(save);
                windowModel.Show();
                populateSummary();
                service.Grid.Bind();
                formModel.title = 'Order Preview';
                formModel.QuentityTitle = 'Ordered Items'
            }, noop);
            
        }
        populateSummary();
    };
    (function () {
        var counterId;
        function rowBound(elm) {
            elm.find('.required_quantity').html(this.OrderedQuentity + '*' + this.UnitConversion);
            this.TotalVat = this.TradePrice.mlt(this.Vat).div(100);
        };
        function onDataBinding(response) {
            
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', title: 'Trade Name', },
                    { field: 'Category'},
                    { field: 'Strength' },
                    { field: 'SoldDaysForParchaseRequired', title: 'Days' },
                    { field: 'SoldQuentity', title: 'SoldQnty' },
                    { field: 'TotalStock', title: 'Stock' },
                    { field: 'RequiredQuantity', title: 'Required Qnty', className: 'required_quantity' },
                    { field: 'TradePrice', title: 'Trade Price' },
                    { field: 'TotalDiscount', title: 'Discount' },
                    { field: 'TotalVat', title: 'Vat' },
                    { field: 'PayableAmount', title: 'Payable Amount' }
                ],
                dataSource: callerOptions.dataSource,
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
                gridModel.dataSource = callerOptions.dataSource;
                gridModel.Reload();
            } else {
                Global.Grid.Bind(getOptions());
            }
        };
    }).call(service.Grid = {});
};