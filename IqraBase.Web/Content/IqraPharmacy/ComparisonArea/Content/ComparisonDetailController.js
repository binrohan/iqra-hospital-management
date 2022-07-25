

var Controller = new function () {
    this.Wait = true;
    var that = this, name = 'ActionMethod', oldTitle = document.title, windowModel, callerOptions;

    function cancel() {
        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function populate(model) {

    };
    function show(model) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = 'Comparison of "' + callerOptions.model.Voucher + '"';
        windowModel.View.find('.widget-title h4').html(document.title);
    }
    this.Show = function (options) {
        callerOptions = options;
        if (windowModel) {
            show(options.model);
            that.Grid.Reload(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/Security/Add.html', function (response) {
                Global.Free();
                windowModel = Global.Window.Bind(response);
                show(options.model);
                that.Grid.Set(options.model);
                that.EventsBind();
            }, function (response) {
            });
        }
    }
    this.Grid = new function () {
        var gridModel, controllerId;
        function setOnlyPurchase(elm, model) {
            elm.addClass('green_color');
            elm.find('.OrderedQuentity').html(model.UnitQuentity);
            elm.find('.OrderedQuentity').html(model.VAT);
        };
        function setOnlyOrder(elm, model) {
            elm.addClass('red_color');
        };
        function setBoth(elm, model) {
            var qnt = model.OrderedQuentity + '<hr/>' + model.purchase.UnitQuentity,
                change = model.OrderedQuentity - model.purchase.UnitQuentity,
                cls=change>0.01?'red_color':(change<-0.01)?'oreng_color':'no_color';
            elm.find('.OrderedQuentity').html(qnt).addClass(cls);

            qnt = model.UnitPurchasePrice + '<hr/>' + model.purchase.UnitPurchasePrice,
                change = model.UnitPurchasePrice - model.purchase.UnitPurchasePrice,
                cls = change > 0.01 ? 'red_color' : (change < -0.01) ? 'oreng_color' : 'no_color';
            elm.find('.UnitTradePrice').html(qnt).addClass(cls);

            qnt = model.TotalTradePrice + '<hr/>' + model.purchase.TotalTradePrice,
                change = model.TotalTradePrice - model.purchase.TotalTradePrice,
                cls = change > 1 ? 'red_color' : (change < -1) ? 'oreng_color' : 'no_color';
            elm.find('.TotalTradePrice').html(qnt).addClass(cls);

            qnt = model.Discount + '<hr/>' + model.purchase.Discount,
                change = model.Discount - model.purchase.Discount,
                cls = change > 0.01 ? 'red_color' : (change < -0.01) ? 'oreng_color' : 'no_color';
            elm.find('.Discount').html(qnt).addClass(cls);

            qnt = model.Vat + '<hr/>' + model.purchase.VAT,
                change = model.Vat - model.purchase.VAT,
                cls = change > 0.01 ? 'red_color' : (change < -0.01) ? 'oreng_color' : 'no_color';
            elm.find('.Vat').html(qnt).addClass(cls);
        };
        function onDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onRowBound(elm) {
            if (this.Type === 1) {
                setOnlyPurchase(elm,this);
            } else if (this.Type === 0 && !this.purchase) {
                setOnlyOrder(elm, this);
            } else {
                setBoth(elm, this);
            }
        };
        function setData(order, purchase) {
            var dic = {};
            order.each(function () {
                dic[this.ItemId] = this;
                this.Type = 0;
                this.UnitPurchasePrice = this.UnitPurchasePrice.mlt(this.UnitConversion).toFloat();
                this.UnitTradePrice = this.UnitTradePrice.toFloat();
                this.TotalTradePrice = this.TotalTradePrice.toFloat();
                this.Discount = this.Discount.toFloat();
                this.Vat = this.Vat.toFloat();
            });
            purchase.each(function () {
                this.UnitQuentity = this.UnitQuentity.div(this.UnitConversion).toFloat();
                this.UnitPurchasePrice = this.UnitPurchasePrice.mlt(this.UnitConversion).toFloat();
                this.UnitTradePrice = this.UnitTradePrice.mlt(this.UnitConversion).toFloat();
                this.TotalTradePrice = (this.TotalTradePrice - this.TotalVAT + this.TotalDiscount).toFloat();
                this.Discount = this.Discount.toFloat();
                this.VAT = this.VAT.toFloat();
                this.Type = 1;
                if (dic[this.ItemId]) {
                    dic[this.ItemId].purchase = this;
                } else {
                    order.push(this);
                }
            });
            return order;
        };
        this.Reload = function (id) {
            Global.CallServer('/ComparisonArea/OrderCompare/Detail?OrderId=' + callerOptions.model.OrderId + '&PurchaseId=' + callerOptions.model.PurchaseId, function (response) {
                if (!response.IsError) {
                    gridModel.dataSource = setData(response.Data[0], response.Data[1]);
                    gridModel.Reload();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        };
        this.Set = function (id) {
            Global.List.Bind({
                Name: 'ActionMethod',
                Grid: {
                    elm: windowModel.View.find('#action_method_table_container'),
                    columns: [
                        { field: 'Name', title: 'Trade Name', filter: true, click: onDetails },
                        { field: 'Strength', filter: true },
                        { field: 'Category', filter: true },
                        { field: 'OrderedQuentity', title: 'Qnt', className: 'OrderedQuentity' },
                        { field: 'UnitTradePrice', title: 'Unit TP', className: 'UnitTradePrice' },
                        { field: 'Vat', className: 'Vat' },
                        { field: 'Discount', className: 'Discount' },
                        { field: 'TotalTradePrice', title: 'Total TP', className: 'TotalTradePrice' }
                    ],
                    dataSource: [],
                    rowbound: onRowBound,
                    pagging:false,
                    page:{ 'PageNumber': 1, 'PageSize': 5000, showingInfo: ' ' },
                    Actions: [
                                //{ click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
                    ]
                }, edit: false, remove: false,Add:false,

                onComplete: function (grid) {
                    gridModel = grid;
                    that.Grid.Reload();
                }
            });
        };
    }
    this.EventsBind = function () {
        windowModel.View.find('.btn_cancel').click(cancel);
    };
};
//[{Name:"Admin",Id:1},{Name:"Coordinator",Id:2}]
