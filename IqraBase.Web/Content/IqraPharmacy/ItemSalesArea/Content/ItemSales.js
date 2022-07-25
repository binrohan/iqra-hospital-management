
(function () {
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
            model: model
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
    function onUpdatorDetails(model) {
        Global.Add({
            UserId: model.UpdatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(data) {
        var totalPrice=0,totalDiscount=0
        data.Data.Data.each(function () {
            totalPrice += this.SalePrice;
            totalDiscount += this.Discount;
        });
        formModel.TotalPrice = 'TotalPrice : ' + totalPrice;
        formModel.TotalDiscount = 'TotalDiscount : ' + totalDiscount;
    };
    function onRequest(model) {
        (model.filter || []).each(function () {
            //if (this.field == 'VoucherNo') {
            //    this.field = 'Voucher'
            //}
        });
    }
    var that = this, gridModel, formModel = {}, service = {};
    Global.List.Bind({
        Name: 'Designation',
        Grid: {
            elm: $('#grid'),
            columns:[
                    { field: 'VoucherNo', title: 'Voucher', filter: true, click: onDetails },
                    { field: 'Customer', filter: true },
                    { field: 'ItemCount',title:'Items', width:60 },
                    { field: 'SalePrice' },
                    { field: 'TradePrice' },
                    { field: 'Discount', width: 70 },
                    { field: 'Computer', click: onComputerDetails },
                    { field: 'Creator', filter: true, Add: false, Click: onCreatorDetails },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
            ],
            url: '/ItemSalesArea/ItemSales/Get',
            page: { 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemSales ' },
            onDataBinding: onDataBinding,
            onRequest: onRequest,
            Action:{width:70},
            Actions: [{
                click: onDetails,
                html: '<span class="icon_container" ><span class="glyphicon glyphicon-open"></span></span>'
            }],
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        remove: false,
        edit:false
    });
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
        function onPeriodChange(data){
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
            formModel.SaleTo = today.format('yyyy/MM/dd')+' 23:59';
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
})();
