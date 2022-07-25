
(function () {
    var that = this, gridModel, voucherGridModel, formModel = {}, service = {}, statuses = ['Initiated', 'Received', 'Qnt', 'Price', 'Qnt & Price', 'Item', 'Item & Qnt', 'Item & Price', 'All Changed', '', '', 'Canceled'];
    var opts = {
        name: 'AddOrder',
        url: '/Content/IqraPharmacy/ProductOrderArea/Content/AddOrder.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    var service = {}, date = new Date(),
        from = { field: 'CreatedAt', value: "'" + new Date(date.setDate(1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'CreatedAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 },
        filters = typeof window.ItemType == 'undefined' ? [from, to] : [from, to, { field: "Type", value: window.ItemType, Operation: 0 }];
    function resetTab() {
        $('.tab_taggle,.btn_add_print').hide();
        $('.button_container .btn-active').removeClass('btn-active');
    };
    function getTypeFileter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Initiated', value: '0' },
                    { text: 'Received', value: '1' },
                    { text: 'Qnt', value: '2' },
                    { text: 'Price', value: '3' },
                    { text: 'Qnt & Price', value: '4' },
                    { text: 'Item & Qnt', value: '5' },
                    { text: 'Item & Price', value: '5' },
                    { text: 'All Changed', value: '6' },
                    { text: 'Canceled', value: '9' }
                ]
            }
        };
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
    };
    function onBaseDataBinding(response) {
        formModel.TotalTP = (response.Data.Total.TotalTradePrice || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;

        response.Data.Data.each(function () {
            this.TotalTradePrice = this.TotalTradePrice.toMoney();
            this.Discount = this.Discount.toMoney();
            this.Vat = this.Vat.toMoney();
            this.TotalPayablePrice = this.TotalPayablePrice.toMoney();
        });
    };
    function onDataBinding(response) {
        formModel.TotalTP = (response.Data.Total.TotalTradePrice || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        //[OrderedQuentity], [TotalTradePrice], [TotalSalePrice], [TotalPayablePrice]
        response.Data.Data.each(function () {
            this.OrderedQuentity = (this.OrderedQuentity||0).toMoney();
            this.TotalTradePrice = (this.TotalTradePrice||0).toMoney();
            this.TotalSalePrice = (this.TotalSalePrice||0).toMoney();
            this.TotalPayablePrice = (this.TotalPayablePrice||0).toMoney();
        });
    };
    function onDetails(model) {
        Global.Add({
            OrderId: model.Id,
            name: 'OrderDetails',
            url: '/Content/IqraPharmacy/ProductOrderArea/Content/OrderDetails.js',
        });
    };
    function onSuplierDetails(model) {
        Global.Add({
            SuplierId: model.SuplierId,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onPrint(model) {
        service.Report.Print(model);
    };
    function onResend(model) {
        Global.Add({
            name: 'Resend',
            columns: [{ field: 'SuplierEmail', title: 'Email', Add: { Type: 'email' } }],
            model: model,
            saveChange: '/ProductOrderArea/Order/ResendMail',
            onSubmit: function (formModel, data) {
                formModel.OrderId = data.Id;
                formModel.email = formModel.SuplierEmail;
            },
            onSaveSuccess: function () {
                //gridModel.Reload();
            }
        });
    };
    function onRemove(model) {
        if (model.Status != 'Initiated') {
            return;
        }
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OrderRemoved',
                save: '/ProductOrderArea/Order/Cancel?Id=' + model.Id,
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }, onerror: function (response) {
                    switch (response.Id) {
                        case -3:
                            alert('No Order Found.');
                            break;
                        case -5:
                            alert('This order is already received.');
                            break;
                        case -8:
                            alert('Network Error');
                            break;
                    }
                },
            }
        });
    };
    function onRowBound(elm) {
        this.Status == 11 && elm.css({ color: 'red' }).find('a').css({ color: 'red' });
        if (this.Status != 0) {
            elm.find('.fa-trash').closest('a').css({ opacity: 0.6, cursor: 'default' });
        }
        ///0 = No change, 1 = Quentity Chnage, 2 = price Change, 3 = Both Change
        ///4 = Complete No change, 5 = Complete Quentity Chnage, 6 = Complete price Change, 7 = Complete Both Change
        ///11 For Cancel
        this.Status = statuses[this.Status] || this.Status;
    };
    Global.List.Bind({
        Name: 'Order',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Voucher', filter: true, Click: onDetails, width: 130 },
                { field: 'Suplier', filter: true, width: 120, Click: onSuplierDetails },
                { field: 'SuplierEmail', title: 'Email', filter: true },
                { field: 'Creator', filter: true },
                { field: 'Status', width: 110, filter: getTypeFileter() },
                { field: 'OrderedQuentity', title: 'Quentity' },
                { field: 'Vat', width: 80 },
                { field: 'Discount', width: 80 },
                { field: 'TotalTradePrice', title: 'Price', width: 80 },
                { field: 'TotalPayablePrice', title: 'PayablePrice', width: 80 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
            ],
            action: { width: 60 },
            Actions: [{
                click: onPrint,
                html: '<a style="margin-right:8px;"><i class="fa fa-print" aria-hidden="true"></i></a>'
            }, {
                click: onResend,
                html: '<a style="margin-right:8px;"><i class="fa fa-envelope" aria-hidden="true"></i></a>'
            }, {
                click: onRemove,
                html: '<a style="margin-right:8px;"><i class="fa fa-trash" aria-hidden="true"></i></a>'
            }],
            url: '/ProductOrderArea/Order/GetDefault',
            page: { 'PageNumber': 1, 'PageSize': 10, filter: filters, showingInfo: ' {0}-{1} of {2} Orders ' },
            onDataBinding: onBaseDataBinding,
            rowBound: onRowBound
        }, onComplete: function (model) {
            gridModel =voucherGridModel= model;
        }, Add: false, Edit: false,
        remove: false
    });

    function itemBind() {
        if (service.Type === 0)
            return;
        service.Type = 0;
        resetTab();
        gridModel = voucherGridModel;
        $('#grid, #btn_voucher_print').show();
        gridModel.Reload();
        $(this).addClass('btn-active');
    };
    (function () {
        var dailyGridModel, isBind;
        function set() {
            $('#daily_grid, #btn_daily_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                Date: model.CreatedAt,
                filter: dailyGridModel.page.filter.slice(),
                name: 'DailyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/DailyPurchaseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 1)
                return;
            service.Type = 1;
            resetTab();
            gridModel = dailyGridModel;
            set();
            $(this).addClass('btn-active');
            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#daily_grid'),
                    //[OrderedQuentity], [TotalTradePrice], [TotalSalePrice], [TotalPayablePrice]
                    columns: [
                                { field: 'CreatedAt', click: onDetails },
                                { field: 'OrderedQuentity', title: 'Quentity' },
                                { field: 'TotalTradePrice', title: 'TP Price' },
                                { field: 'TotalPayablePrice', title: 'Payable TP Price' },
                                { field: 'TotalSalePrice', title: 'MRP Price' }
                    ],
                    url: '/ProductOrderArea/Order/GetDaily',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
                    pagger: { showingInfo: ' {0}-{1} of {2} days ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = dailyGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_daily_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.Daily = {});
    (function () {
        var monthlyGridModel, isBind;
        function set() {
            $('#monthly_grid, #btn_monthly_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                Date: model.CreatedAt,
                filter: monthlyGridModel.page.filter.slice(),
                name: 'MonthlyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/MonthlyPurchaseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 2)
                return;
            service.Type = 2;
            resetTab();
            gridModel = monthlyGridModel;
            set();
            $(this).addClass('btn-active');


            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#monthly_grid'),
                    columns: [
                                { field: 'CreatedAt', click: onDetails },
                                { field: 'OrderedQuentity', title: 'Quentity' },
                                { field: 'TotalTradePrice', title: 'TP Price' },
                                { field: 'TotalPayablePrice', title: 'Payable TP Price' },
                                { field: 'TotalSalePrice', title: 'MRP Price' }
                    ],
                    url: '/ProductOrderArea/Order/GetMonthly',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
                    pagger: { showingInfo: ' {0}-{1} of {2} Months ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = monthlyGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_monthly_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.Monthly = {});
    (function () {
        var suplierGridModel, isBind;
        function set() {
            $('#suplier_grid, #btn_suplier_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                filter: suplierGridModel.page.filter.slice(),
                name: 'DailyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/SuplierWisePurchaseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 3)
                return;
            service.Type = 3;
            resetTab();
            gridModel = suplierGridModel;
            set();
            $(this).addClass('btn-active');

            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#suplier_grid'),
                    columns: [
                                { field: 'Name', filter: true, click: onDetails },
                                { field: 'OrderedQuentity', title: 'Quentity' },
                                { field: 'TotalTradePrice', title: 'TP Price' },
                                { field: 'TotalPayablePrice', title: 'Payable TP Price' },
                                { field: 'TotalSalePrice', title: 'MRP Price' }
                    ],
                    url: '/ProductOrderArea/Order/SuplierWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
                    pagger: { showingInfo: ' {0}-{1} of {2} Supliers ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = suplierGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_suplier_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.SuplierWise = {});
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [];
            if (!gridModel)
                return;
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'CreatedAt') {
                    filter.push(this);
                }
            });
            if (formModel.PurchaseFrom) {
                from.value = "'" + formModel.PurchaseFrom + "'";
                filter.push(from);
            }
            if (formModel.PurchaseTo) {
                to.value = "'" + formModel.PurchaseTo + "'";
                filter.push(to);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['PurchaseFrom']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['PurchaseTo']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        function onPeriodChange(data) {
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
                    fromDate.setMonth(fromDate.getMonth() - 1);
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
            formModel.PurchaseFrom = fromDate.format('yyyy/MM/dd') + ' 00:00';
            formModel.PurchaseTo = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd') + ' 00:00';
            onChange();
        };
        $(inputs['Period']).val('ThisMonth');
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
        Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_voucher_wise'), itemBind);
        Global.Click($('#btn_suplier_wise'), service.SuplierWise.Bind);
        Global.Click($('#btn_day_wise'), service.Daily.Bind);
        Global.Click($('#btn_month_wise'), service.Monthly.Bind);
    })();
    (function () {
        function getRow(text) {
            return '<td style="border: 1px solid silver; padding: 5px;">' + text + '</td>';
        };
        function getTh(text) {
            return '<th style="border: 1px solid silver; padding: 5px;">' + text + '</th>';
        };
        function printData(model, mywindow, dataList) {
            var dataSource = dataList || [];
            dataSource.each(function () {
                var total = this.UnitTradePrice * this.OrderedQuentity;
                this.Discount = this.Discount.toFloat();
                this.UnitTradePrice = this.UnitTradePrice.toFloat();
                this.OrderedQuentity = this.OrderedQuentity + ' X ' + this.UnitConversion;
                var tr = '<tr>', data = this;
                ['TradeName', 'Category', 'Strength', 'OrderedQuentity', 'UnitTradePrice', 'Vat', 'Discount'].each(function (i) {
                    tr += getRow(data[this]);
                });
                tr += getRow(total.toFixed(2));
                tr += getRow((total + total.mlt( this.Vat / 100) - total.mlt(this.Discount / 100)).toFixed(2));
                tr += '</tr>';
                mywindow.document.write(tr);
            });
        }
        function printHeader(model, mywindow, dataModel) {
            var tr = '<tr>';
            ['Trade Name', 'Category', 'Strength', 'OrderedQnty', 'UnitPrice', 'VAT', 'Discount', 'TotalPrice', 'PayablePrice'].each(function () {
                tr += getTh(this);
            });
            tr += '</tr>';
            mywindow.document.write(tr);
        };
        function PrintElem(model, dataList) {
            console.log(model);
            model.name = model.name || document.title;
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + model.Suplier + '</title>');
            mywindow.document.write('</head><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style><body style="padding: 20px;">');
            mywindow.document.write('<h1>Order to ' + model.Suplier + '<small style="float:right;">' + model.CreatedAt + '</small></h1>');
            mywindow.document.write('<table style="border-collapse: collapse;">');
            printHeader(model, mywindow, dataList[0] || {});
            printData(model, mywindow, dataList);
            mywindow.document.write('</table></body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            //mywindow.close();
            return true;
        };
        this.Print = function (model) {
            Global.CallServer('/Order/GetOrderItems?orderInfoId=' + model.Id, function (response) {
                if (!response.IsError) {
                    PrintElem(model, response.Data.orderBy('TradeName'));
                } else {

                }
            }, function (response) {
                alert('Network error had occured.');

            }, { PageSize: 9999 }, 'POST');
        };
    }).call(service.Report = {});
})();