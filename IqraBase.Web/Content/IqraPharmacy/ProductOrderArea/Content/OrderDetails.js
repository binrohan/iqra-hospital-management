
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "OrderInfoId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Computer ', filter: [filter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    };
    function printable(id){
        return {
            Container: function () {
                return windowModel.View.find('#'+id+' .print_container');
            }
        }
    };
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        filter.value = model.OrderId;
        page.filter.splice(0, page.filter.length);
        page.filter.push(filter);
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductOrderArea/Templates/OrderDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, userId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
                setEvent();
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function setEvent() {
            Global.Click(windowModel.View.find('#btn_suplier_details'), onSuplierDetails);
            Global.Click(windowModel.View.find('#btn_creator_details'), onCreatorDetails);
        };
        function onSuplierDetails() {
           
        }
        function onCreatorDetails() {
            var data = dataSource[callerOptions.OrderId];
            data && Global.Add({
                OrderId: data.CreatedBy,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        }
        function populate(model) {
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
        };
        function load() {
            Global.CallServer('/Order/Details?Id=' + callerOptions.OrderId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.OrderId] = response.Data;
                    populate(response.Data);
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (userId === callerOptions.OrderId) {
                return;
            }
            if (dataSource[callerOptions.OrderId]) {
                populate(dataSource[callerOptions.OrderId]);
            } else {
                load();
            }
            userId = callerOptions.OrderId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#ordered_items').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
            Global.Click(windowModel.View.find('#btn_add_new_order_item'), addItem);
        };
        function addItem() {
            Global.Add({
                OrderId: callerOptions.OrderId,
                name: 'Add Order Items',
                OnSuccess: function () {
                    gridModel.Reload();
                },
                url: '/Content/IqraPharmacy/ProductOrderArea/Content/ItemAddController.js',
            });
        };
        function onProductDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onUserDetails(userId) {
            Global.Add({
                UserId: userId,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function onCreatorDetails(model) {
            onUserDetails(model.CreatedBy);
        };
        function onUpdatorDetails(model) {
            onUserDetails(model.UpdatedBy);
        };
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            //{"Id":0,"Data":{"Data":[],"Id":null,"Total":0,"SortBy":null,"filter":null,"IsDescending":false,"PageNumber":1,"PageSize":10},"IsError":false,"Msg":null}
            response.Data = { "Data": response.Data, "Id": null, "Total": response.Data.length, "SortBy": null, "filter": null, "IsDescending": false, "PageNumber": 1, "PageSize": 1000 };
            response.Data.Data.each(function () {
                this.UnitTradePrice = this.UnitTradePrice.toFloat();
                this.UnitSalePrice = this.UnitSalePrice.toFloat();
                this.Vat = this.Vat.toFloat();
                this.Discount = this.Discount.toFloat();
                this.TotalTradePrice = this.TotalTradePrice.toFloat();
            });
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#ordered_items_grid'),
                columns: [{ field: 'TradeName', title: 'Trade Name', Click: onProductDetails },
                    { field: 'Category', width: 100 },
                    { field: 'Strength', title: 'Strength', width: 100 },
                    { field: 'PurchaseUnitType', title: 'PUnit', width: 70 },
                    { field: 'OrderedQuentity', title: 'OrderedQnty', width: 80 },
                    { field: 'UnitTradePrice', width: 80, title: 'TPPrice' },
                    { field: 'UnitSalePrice', width: 80, title: 'MRPPrice' },
                    { field: 'Vat',title:'VAT', width: 70 },
                    { field: 'Discount', width: 80 },
                    { field: 'TotalTradePrice', title: 'TotalPrice', width: 70 }],
                url: function () {
                    return '/Order/GetOrderItems?orderInfoId=' + callerOptions.OrderId;
                },
                dataBinding: onDataBinding,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 1000 },
                pagger: { showingInfo: ' ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#ordered_items .print_container');
                    }
                }
            }
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        };
    }).call(service.OrderedItems = {});
    (function () {
        var gridModel, userId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#parchas_items').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function onUserDetails(model) {
            Global.Add({
                OrderId: model.OrderId,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Status = txtStatus[this.Type];
                this.UnitTradePrice = this.UnitTradePrice.toFloat();
                this.UnitSalePrice = this.UnitSalePrice.toFloat();
                this.Discount = this.Discount.toFloat();
                this.Vat = this.Vat.toFloat();
            });
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#parchas_items_grid'),
                columns: [
                    { field: 'TradeName', Click: onUserDetails },
                    { field: 'Strength' },
                    { field: 'Suplier', Click: onUserDetails },
                    { field: 'UnitTradePrice', title: 'Unit TPPrice' },
                    { field: 'UnitSalePrice', title: 'Unit MRPPrice' },
                    { field: 'UnitQuentity', title: 'Quentity' },
                    { field: 'Discount' },
                    { field: 'Vat', title: 'VAT' },
                    { field: 'TotalTradePrice', title: 'TotalPrice' }
                ],
                url: '/ProductPurchaseArea/Purchase/Items',
                page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Purchase ', filter: [filter] },
                dataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#parchas_items .print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.ParchasItems = {});
    (function () {
        var gridModel, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                set();
            }
            reset();
            windowModel.View.find('#difference_items').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[3]).addClass('active');
        }
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
                cls = change > 0.01 ? 'red_color' : (change < -0.01) ? 'oreng_color' : 'no_color';
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
                setOnlyPurchase(elm, this);
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
        function reload() {
            Global.CallServer('/ComparisonArea/OrderCompare/DetailsByOrder?OrderId=' + callerOptions.OrderId, function (response) {
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
        function set() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#difference_items_grid'),
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
                rowBound: onRowBound,
                pagging: false,
                pagger: false,
                onComplete: function (grid) {
                    gridModel = grid;
                },
                Printable: printable('difference_items')
            });
        };
        this.Bind = function () {
            bind();
            reload();
        }
    }).call(service.Difference = {});
    (function () {
        var gridModel, userId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#emails').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[4]).addClass('active');
        }
        function onDetails(model) {
            Global.Add({
                model: model,
                name: 'EmailDetails',
                url: '/Content/IqraPharmacy/ProductOrderArea/Content/EmailDetails.js',
            });
        };
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                //this.Status = txtStatus[this.Type];
                //this.UnitTradePrice = this.UnitTradePrice.toFloat();
                //this.UnitSalePrice = this.UnitSalePrice.toFloat();
                //this.Discount = this.Discount.toFloat();
                //this.Vat = this.Vat.toFloat();
            });
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#emails_grid'),
                columns: [
                    { field: 'Subject', Click: onDetails },
                    { field: 'To',title:'Email To' },
                    { field: 'CC' },
                    { field: 'IsDelivered', title: 'Is Delivered' }
                ],
                url: '/ProductOrderArea/Order/GetOrderEmails',
                page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Purchase ', filter: [filter] },
                dataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#parchas_items .print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.Emails = {});
};