
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, inputs, gridModel, callerOptions,
        page = { 'PageNumber': 1, 'PageSize': 10, filter: [] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function onChange() {
        var filter = [], p = gridModel && gridModel.page || page;
        p.filter = p.filter || [];
        (p.filter || []).each(function () {
            if (this.field != 'SaleFrom' && this.field != 'SaleTo') {
                filter.push(this);
            }
        });
        if (formModel.SaleFrom) {
            filter.push({ field: 'SaleFrom', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
        }
        if (formModel.SaleTo) {
            filter.push({ field: 'SaleTo', value: "'" + formModel.SaleTo + "'", Operation: 4 });
        }
        if (gridModel) {
            gridModel.page.filter = filter;
            gridModel.Reload();
        } else {
            page.filter = filter;
        }
    };
    function onPeriodChange(data) {
        var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
        switch (data.value) {
            case 'Period':
                $(inputs['SaleFrom']).val('');
                $(inputs['SaleTo']).val('');
                return onChange();
            case 'Yesterday':
                fromDate.setDate(fromDate.getDate() - 1);
                today = new Date(fromDate);
                break;
            case 'ThisWeek':
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                break;
            case 'LastWeek':
                today.setDate(fromDate.getDate() - fromDate.getDay());
                fromDate.setDate(fromDate.getDate() - 7);
                break;
            case 'ThisMonth':
                fromDate.setDate(1);
                break;
            case 'LastMonth':
                today.setDate(0);
                fromDate = new Date(fromDate);
                fromDate.setDate(1);
                break;
            case 'ThisYear':
                fromDate.setMonth(0);
                fromDate.setDate(1);
                break;
            case 'LastOneYear':
                fromDate.setFullYear(fromDate.getFullYear() - 1);
                break;
            case 'LastYear':
                today.setMonth(0);
                today.setDate(0);
                fromDate = new Date(today);
                fromDate.setMonth(0);
                fromDate.setDate(1);
                break;
        }
        formModel.SaleFrom = fromDate.format('yyyy/MM/dd') + ' 00:00';
        formModel.SaleTo = today.format('yyyy/MM/dd') + ' 23:59';
        onChange();
    };
    function setProfitTemplate(view) {
        view.find('#total_item').parent().append('<div class="col-sm-2 col-md-2">' +
                        '<label>Total Profit</label>'+
                        '<div class="auto_bind form-control" data-binding="Profit"></div>' +
                    '</div>').find('#total_item').remove();
    };
    function setSummaryTemplate(view) {
        setProfitTemplate(view.View);
        inputs = Global.Form.Bind(formModel, view.View);
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DropDown.Bind({
            Id: 'CounterId',
            dataSource: [{ text: 'Select Period', value: 'Period' },
                { text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/SaleReport.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var typeId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                typeId = callerOptions.Type;
                Global.List.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function rowBound(elm) {
            
        };
        function setSummary(response) {
            var model = response.Data.Total;
            if (model.TotalQuentity <= 0) {
                model.UnitTradePrice = 0;
                model.UnitSalePrice = 0;
            } else {
                model.UnitTradePrice = model.TotalTradePrice / model.TotalQuentity;
                model.UnitSalePrice = model.TotalSalePrice / model.TotalQuentity;
            }
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Total.Profit = 0;
            response.Data.Data.each(function () {
                if (this.TotalQuentity) {
                    this.UnitTradePrice = this.TotalTradePrice / this.TotalQuentity;
                    this.UnitSalePrice = this.TotalSalePrice / this.TotalQuentity;
                } else {
                    this.UnitTradePrice = 0;
                    this.UnitSalePrice = 0;
                }
                response.Data.Total.Profit += this.Profit = this.TotalSalePrice - this.TotalTradePrice;
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                Name: 'Counter',
                Grid: {
                    elm: windowModel.View.find('#grid'),
                    columns: [
                        { field: 'Counter', filter: true },
                        { field: 'TotalQuentity', title: 'Stock' },
                        { field: 'UnitTradePrice' },
                        { field: 'UnitSalePrice' },
                        { field: 'TotalTradePrice' },
                        { field: 'TotalSalePrice' },
                        { field: 'Profit' }
                    ],
                    url: function () {
                        if (callerOptions.Type == 1) {
                            return '/ProductArea/Counter/GetSalesReport?type=1'
                        } else if (callerOptions.Type == 2) {
                            return '/ProductArea/Counter/GetSalesReport?type=2'
                        } else {
                            return '/ProductArea/Counter/GetSalesReport'
                        }
                    },
                    page: page,
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: false
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (typeId != callerOptions.Type) {
                gridModel.Reload();
            }

            typeId = callerOptions.Type;
        };
    }).call(service.Grid = {});
};