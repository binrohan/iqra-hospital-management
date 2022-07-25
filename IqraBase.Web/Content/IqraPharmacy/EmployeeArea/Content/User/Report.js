
(function () {
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function setSummary(model) {
        formModel.TotalSale = (model.SalePrice+model.Discount).toMoney();
        formModel.TotalDiscount = model.Discount.toMoney();
        formModel.TotalReturn = model.ReturnAmount.toMoney();
        formModel.Due = model.Due.toMoney();
        formModel.TotalCash = (model.SalePrice - model.ReturnAmount - model.Due).toMoney();
        formModel.TradePrice = model.TradePrice.toMoney();
        formModel.TradeMargin = (model.SalePrice - model.TradePrice).toMoney();
        formModel.Items = model.Items.toMoney();
        console.log(model);
    };
    function onDataBinding(data) {
        setSummary(data.Data.Total);
        data.Data.Total = data.Data.Total.Total;
        data.Data.Data.each(function () {
            this.TotalCash = (this.SalePrice - this.ReturnAmount).toMoney();
            this.TradeMargin = (this.SalePrice - this.TradePrice).toMoney();
            this.ReturnAmount = this.ReturnAmount.toMoney();
            this.SalePrice = (this.SalePrice + this.Discount).toMoney();
            this.TradePrice = this.TradePrice.toMoney();
            this.Discount = this.Discount.toMoney();
        });
    };
    var that = this, gridModel, formModel = {}, service = {}, date = new Date(),
        from = { field: 'from', value: "'" + new Date().format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'to', value: "'" + new Date(date.setDate(date.getDate() + 1)).format('yyyy/MM/dd') + ' 23:59' + "'", Operation: 3 },
    page = { 'PageNumber': 1, filter: [from, to], 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Employees ' };
    
    Global.Form.Bind(formModel, $('#sale_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [], p = gridModel && gridModel.page || page;
            p.filter = p.filter || [];
            p.filter.each(function () {
                if (this.field != 'from' && this.field != 'to') {
                    filter.push(this);
                }
            });
            if (formModel.SaleFrom) {
                filter.push({ field: 'from', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
            }
            if (formModel.SaleTo) {
                filter.push({ field: 'to', value: "'" + formModel.SaleTo + "'", Operation: 3 });
            }
            if (gridModel) {
                gridModel.page.filter = filter;
                gridModel.Reload();
            } else {
                page.filter = filter;
            }
        };
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        function onPeriodChange(data){
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
            switch (data.value) {
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
                    fromDate.setFullYear(fromDate.getFullYear()-1);
                    break;
                case 'LastYear':
                    today.setMonth(0);
                    today.setDate(0);
                    fromDate = new Date(today);
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
            }
            formModel.SaleFrom = fromDate.format('yyyy/MM/dd')+' 00:00';
            formModel.SaleTo = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd') + ' 00:00';
            onChange();
        };
        $(inputs['Period']).val('Today');
        Global.DropDown.Bind({
            Id: 'PeriodId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']),
            change: onPeriodChange,

        });
    }).call(service.Filter = {});
    (function () {
        Global.Grid.Bind({
            elm: $('#grid'),
            columns: [
                        { field: 'Name', title: 'Employee', click: onCreatorDetails },
                        { field: 'SalePrice', title: 'Sale' },
                        { field: 'Discount', title: 'Discount', className: 'hide_on_mobile' },
                        { field: 'TradePrice', title: 'TP Price' },
                        { field: 'ReturnAmount', title: 'Return' },
                        { field: 'Due', title: 'Due' },
                        { field: 'TotalCash', title: 'Cash', sorting: false },
                        { field: 'TradeMargin', title: 'Trade Margin', sorting: false, className: 'hide_on_mobile' },
            ],
            url: '/EmployeeArea/Employee/GetReportData',
            page: page,
            dataBinding: onDataBinding,
            onComplete: function (model) {
                gridModel = model;
            }
        });
    }).call(service.Grid = {});
})();
