
var Controller = new function () {
    var service = {}, windowModel = {}, dataSource = {}, formModel = {}, inputs, gridModel, callerOptions = {},
        from = { field: 'SaleFrom', value: "'" + new Date().format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'SaleTo', value: "'" + new Date().format('yyyy/MM/dd') + ' 23:59' + "'", Operation: 4 },
        page = { 'PageNumber': 1, 'PageSize': 10, filter: [from, to] };
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
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        $(inputs['Period']).val('Today');
        Global.DropDown.Bind({
            Id: 'CounterId',
            dataSource: [{ text: 'Select Period', value: 'Period' },
                { text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']),
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
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            !callerOptions.IsPharmacy && Global.Add({
                model: model,
                page: gridModel.page,
                Period: formModel.Period,
                name: 'Suplier',
                url: '/Content/IqraPharmacy/ReportArea/Content/Sales/Suplier.js',
            });
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.TradeMargin = (model.TotalSalePrice - model.TotalTradePrice - model.TotalDiscount).toMoney();
            model.TotalSalePrice = (model.TotalSalePrice).toMoney();
            model.TotalItem = model.TotalItem.toMoney();
            model.TotalQuentity = model.TotalQuentity.toMoney();
            model.TotalTradePrice = model.TotalTradePrice.toMoney();
            model.TotalDiscount = model.TotalDiscount.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TradeMargin = (this.TotalSalePrice - this.TotalTradePrice - this.TotalDiscount).toMoney();
                this.TotalSalePrice = (this.TotalSalePrice).toMoney();
                this.TotalItem = this.TotalItem.toMoney();
                this.TotalQuentity = this.TotalQuentity.toMoney();
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
                this.TotalDiscount = this.TotalDiscount.toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Counter', filter: true },
                    { field: 'TotalItem', title: 'Sold Items', className: 'hide_on_mobile' },
                    { field: 'TotalQuentity', title: 'Sold Quantity', className: 'hide_on_mobile' },
                    { field: 'TotalTradePrice', title: 'TP' },
                    { field: 'TotalSalePrice', title: 'MRP' },
                    { field: 'TotalDiscount', title: 'Discount' },
                    { field: 'TradeMargin', title: 'Margin', sorting: false }
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
    (function () {
        windowModel.View = $('#page_container');
        setSummaryTemplate(windowModel);
        service.Grid.Bind();
    })();
};