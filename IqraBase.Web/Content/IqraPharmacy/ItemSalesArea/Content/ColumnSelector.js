
(function () {
    //CustomerId
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            name: 'SaleInfo',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
            SaleInfoId: model.Id,
            model:model
        });
    };
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
        });
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCustomerDetails(model) {
        //Global.Add({
        //    UserId: model.UpdatedBy,
        //    name: 'UserDetails',
        //    url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        //});
    };
    function onDataBinding(data) {
        var totalPrice = 0, totalDiscount = 0
        data.Data.Data.each(function () {
            //totalPrice += this.SalePrice;
            //totalDiscount += this.Discount;
        });
        //formModel.TotalPrice = 'TotalPrice : ' + totalPrice.toMoney();
        //formModel.TotalDiscount = 'TotalDiscount : ' + totalDiscount.toMoney();
        data.Data.Total = data.Data.Total.Total;
    };
    function onRequest(model) {
        model.Columns = service.Selector.GetIndex();
        (model.filter || []).each(function () {
            //if (this.field == 'VoucherNo') {
            //    this.field = 'Voucher'
            //}
        });
    };
    var that = this, gridModel, formModel = {}, service = {}, gridContainer = $('#grid_container'), printContainer = $('.button_container');
    function setGrid() {
        printContainer.empty();
        gridContainer.html('<div id="grid"></div>');
        Global.Grid.Bind({
            elm: gridContainer.find('#grid'),
            columns: service.Selector.GetColumns(),
            url: '/ReportArea/ColumnSelector/SalesData',
            page: { 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemSales ' },
            dataBinding: onDataBinding,
            onRequest: onRequest,
            onComplete: function (model) {
                gridModel = model;
            },
            Responsive: true,
            selector: false,
        });
    };
    Global.Form.Bind(formModel, $('#sale_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [];
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
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
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        function onPeriodChange(data) {
            console.log(data);
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
        Global.DropDown.Bind({
            Id: 'SuplierId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        });
    }).call(service.Filter = {});
    (function () {
        var columns = [], selectorContainer = $('#selector_container'),selectedColumns=[];
        function setOnchange(elm,func,model) {
            elm.change(function () {
                func(model);
            });
        };
        function setColumnView() {
            columns.each(function () {
                var elm = $('<label><input type="checkbox" data-binding="selected" /> ' + (this.title || this.field) + ' </label>');
                Global.Form.Bind(this, elm);
                setOnchange(elm, onColumnChange, this);
                selectorContainer.append(elm);
                this.selected && selectedColumns.push(this);
            });
        };
        function onColumnChange(model) {
            var newColumns = [];
            selectedColumns.each(function () {
                if (this.Id != model.Id) {
                    newColumns.push(this);
                }
            });
            selectedColumns = newColumns;
            if (model.selected) {
                selectedColumns.push(model);
            }
            setGrid();
        };
        function setColumns() {
            columns = [
                { field: 'Customer', filter: true, Id: 1, click: onCustomerDetails },
                { field: 'VoucherNo', filter: true, Id: 2, click: onDetails, selected: true },
                { field: 'ItemCount', title: 'Item Count', Id: 3, type: 2, selected: true },
                { field: 'SalePrice', title: 'Sale Price', Id: 4, type: 2, selected: true },
                { field: 'TradePrice', title: 'Trade Price', Id: 5, type: 2, selected: true },
                { field: 'TotalDiscount', title: 'Discount', Id: 6, type: 2, selected: true },
                { field: 'TotalVAT', title: 'VAT', Id: 7, type: 2, selected: true },
                { field: 'Computer', filter: true, Id: 8, click: onComputerDetails },
                { field: 'Creator', filter: true, Id: 9, click: onCreatorDetails, selected: true },
                { field: 'CreatedAt', title: 'Created At', Id: 10, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Daily', title: 'Daily', Id: 11 },
                { field: 'Monthly', title: 'Monthly', Id: 12 },
                { field: 'Yearly', title: 'Yearly', Id: 13 },
                { field: 'IsDelivered', title: 'Is Delivered?', Id: 14 },
                { field: 'PurchasePrice', title: 'Purchase Price', Id: 15, type: 2 },
                { field: 'PurchaseVAT', title: 'Purchase VAT', Id: 16, type: 2 },
                { field: 'PurchaseDiscount', title: 'Purchase Discount', Id: 17, type: 2 }
            ];
            setColumnView();
            setGrid();
        };
        this.GetColumns = function () {
            return selectedColumns;
        };
        this.GetIndex = function () {
            var indexs = [];
            selectedColumns.each(function () {
                indexs.push(this.Id-1);
            });
            return indexs;
        };
        setColumns();
    }).call(service.Selector = {});
})();
