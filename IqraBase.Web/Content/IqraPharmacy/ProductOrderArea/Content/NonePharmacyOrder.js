
(function () {
    var that = this, gridModel, service = {};
    var opts = {
        name: 'Received',
        url: '/Content/IqraPharmacy/ProductOrderArea/Content/AddOrder.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
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
    function onDataBinding(data) {

    };
    function onDetails(model) {
        Global.Add({
            OrderId: model.Id,
            name: 'OrderDetails',
            url: '/Content/IqraPharmacy/ProductOrderArea/Content/OrderDetails.js',
        });
    };
    function onPrint(model) {
        service.Report.Print(model);
    };
    function onRemove(model) {
        if (this.Status != 0) {
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
    };
    Global.List.Bind({
        Name: 'Order',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Voucher', filter: true, Click: onDetails, width: 120 },
                { field: 'Suplier', filter: true },
                { field: 'SuplierEmail', title: 'Email', filter: true },
                { field: 'Creator', filter: true },
                { field: 'Status', width: 60 },
                { field: 'OrderedQuentity', title: 'Quentity', width: 70 },
                { field: 'Vat', width:80 },
                { field: 'Discount', width: 80 },
                { field: 'TotalTradePrice', title: 'Price', width: 80 },
                { field: 'TotalPayablePrice', title: 'PayablePrice', width: 90 },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
            ],
            action: { width: 70 },
            Actions: [{
                click: onPrint,
                html: '<a style="margin-right:8px;"><i class="fa fa-print" aria-hidden="true"></i></a>'
            }, {
                click: onRemove,
                html: '<a style="margin-right:8px;"><i class="fa fa-trash" aria-hidden="true"></i></a>'
            }],
            url: '/Order/NonePharmacyData',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Orders ' },
            onDataBinding: onDataBinding,
            rowBound: onRowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false, Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
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
                var total=this.UnitTradePrice * this.OrderedQuentity;
                var tr = '<tr>', data = this;
                ['TradeName', 'Strength', 'OrderedQuentity', 'UnitTradePrice', 'Vat', 'Discount'].each(function () {
                    tr += getRow(data[this]);
                });
                tr += getRow(total.toFixed(2));
                tr += getRow((total + (this.UnitSalePrice * this.OrderedQuentity) * this.Vat / 100 - this.Discount / 100).toFixed(2));
                tr += '</tr>';
                mywindow.document.write(tr);
            });
        }
        function printHeader(model, mywindow, dataModel) {
            var tr = '<tr>';
            ['Trade Name', 'Strength', 'OrderedQnty', 'UnitPrice', 'VAT', 'Discount', 'TotalPrice','PayablePrice'].each(function () {
                tr += getTh(this);
            });
            tr += '</tr>';
            mywindow.document.write(tr);
        };
        function PrintElem(model,dataList) {
            model.name = model.name || document.title;
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + model.Suplier + '</title>');
            mywindow.document.write('</head><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style><body >');
            mywindow.document.write('<h1>Order to ' + model.Suplier + '</h1>');
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
                    PrintElem(model,response.Data);
                } else {

                }
            }, function (response) {
                alert('Network error had occured.');

            }, { PageSize :9999}, 'POST');
        };
    }).call(service.Report = {});
})();