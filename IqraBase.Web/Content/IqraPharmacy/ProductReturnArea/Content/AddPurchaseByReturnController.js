
var Controller = new function () {
    var windowModel, formModel = { IsTotal: true }, inputs = {}, callerOptions, service = {}, gridModel;
    function save() {
        var model = service.Grid.GetData();
        if (model.list.length > 0) {
            Global.Add({
                model: model,
                close: close,
                onSaveSuccess: function () {
                    close();
                    callerOptions.onSaveSuccess();
                    console.log('callerOptions.onSaveSuccess();');
                },
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/PurchaseBuReturnPreview.js',
            });
        }
    };
    function onSearch() {
        gridModel.Reload();
    };
    function onSearchKeyUp(e) {
        if (e.which === 13 || e.keyCode === 13) {
            onSearch();
        }
    };
    function onDiscountPChange() {
        formModel.IsTotal = false;
        var price = parseFloat(formModel.SoldPrice || '0');
        formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
    };
    function onDiscountTChange() {
        formModel.IsTotal = true;
        var price = parseFloat(formModel.SoldPrice || '0');
        formModel.ReturnDiscount = price > 0 ? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100) : 0;
        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function onShow() {
        windowModel.Show();
        formModel.IsTotal = true;
        service.Grid.Reset();
        $(inputs['Voucher']).focus();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            onShow();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/AddPurchaseByReturn.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                Global.Click(windowModel.View.find('.btn_search'), onSearch);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                $(inputs['Voucher']).keyup(onSearchKeyUp);
                $(inputs['IsShowAll']).change(service.Grid.SetAll);
                $(inputs['ReturnDiscount']).change(onDiscountPChange).keyup(onDiscountPChange);
                $(inputs['TotalReturnDiscount']).change(onDiscountTChange).keyup(onDiscountTChange);
                onShow();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var dataModel = { Data: [] }, selfService = {};
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
            }).focus(function () { $(this).select(); }).click(function (e) { e.stopPropagation(); return false; });
            return elm;
        };
        function getInput(attr, placeHolder, func, option) {
            return up($('<input data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 24px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option);
        };
        function onSelect(model) {

        };
        function rowBound(elm) {
            selfService.UnitQuentity.Set(elm.find('.returned_quantity'), this);
            var start='', end = '',qnt=0;
            this.ReturnItems.each(function (i) {
                if (i === 0) {
                    start = '<span class="returned_quantity">( <small style="color:#FF0000"> ' + this.ReturnQnt;
                    end = '  </small> )</span>';
                } else {
                    start += ' + ' + this.ReturnQnt;
                }
                qnt += this.ReturnQnt;
            });
            this.AlreadyReturnedQuantity = qnt;
            elm.find('.quantity').append(start + end);
        };
        function onDataBinding(response) {
            var obj = {};
            dataModel = response.Data || [[], []];
            setSummary(dataModel[0][0] || {});
            response.Data.Data = response.Data[1] || [];
            response.Data[2].each(function () {
                obj[this.ItemId] = obj[this.ItemId] || [];
                obj[this.ItemId].push(this);
            });
            response.Data.Data.each(function () {
                //this.UnitPayableSalePrice = this.UnitSalePrice;
                this.UnitPayableSalePrice = this.UnitSalePrice - this.UnitSalePrice.mlt(this.DiscountP).div(100);
                this.TotalAmount = this.UnitSalePrice.mlt(this.UnitQuentity);
                this.NetTaka = this.NetTaka.toFloat();
                this.TotalDiscount = this.TotalDiscount.toFloat();
                this.ReturnedQuantity = 0;
                this.AlreadyReturnedQuantity = 0;
                this.ReturnedAmount = 0;
                this.ReturnItems = obj[this.ItemId] || [];
            });
        };
        function setSummary(model) {
            model = model || {};
            formModel.CreatedAt = model.CreatedAt ? model.CreatedAt.getDate().format('dd/MM/yyyy HH:mm') : '';
            formModel.ItemCount = model.ItemCount || '';
            formModel.SalePrice = ((model.TotalDiscount + model.SalePrice) || 0).toFloat();
            formModel.Discount = (model.Discount || 0).toFloat();
            formModel.TotalDiscount = (model.TotalDiscount || 0).toFloat();
            formModel.PayableAmount = (model.SalePrice || 0).toFloat();
        };
        function onChange(data) {
            var item = 0, qnt = 0, price = 0, quantity;
            dataModel.Data.each(function () {
                quantity = parseFloat(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    item++;
                    qnt += quantity;
                    price += quantity.mlt(this.UnitPayableSalePrice);
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt;
            formModel.SoldPrice = price;
            if (formModel.IsTotal) {
                formModel.ReturnDiscount = price > 0 ? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100) : 0;
            } else {
                formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
            }
            formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
        };
        function getModel() {
            var data = dataModel[0][0],
                model = {
                    ComputerId: '00000000-0000-0000-0000-000000000000',
                    CustomerId: data.CustomerId,
                    SoldBy: data.CreatedBy,
                    ItemSaleInfoId: data.Id,
                    VoucharNo: formModel.Voucher,
                    ItemSold: dataModel[1].length,
                    ItemReturn: formModel.ReturnItem,
                    TotalSoldPrice: data.SalePrice,
                    SoldPrice: formModel.SoldPrice,
                    ReturnPrice: formModel.RetunAmount,
                    ReturnDiscount: formModel.ReturnDiscount,
                    Discount: formModel.Discount,
                    TotalReturnDiscount: formModel.TotalReturnDiscount,
                    //TotalDiscount: (data.TotalDiscount || 0).mlt(parseFloat(formModel.SoldPrice || '0')).div(data.SalePrice || 1),
                    TotalDiscount: 0,
                    Vat: data.VAT,
                    //PurchasePrice: data.PurchasePrice,
                    //PurchaseVAT: data.PurchaseVAT,
                    //PurchaseDiscount: data.PurchaseDiscount
                    PurchasePrice: 0,
                    PurchaseVAT: 0,
                    PurchaseDiscount: 0
                };
            return model;
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Qnt',className:'quantity' },
                    { field: 'UnitSalePrice', title: 'Unit MRP' },
                    { field: 'TotalAmount', title: 'Total' },
                    { field: 'TotalDiscount', title: 'Discount' },
                    { field: 'NetTaka', title: 'Payable' },
                    { field: 'ReturnedQuantity', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
                    { field: 'ReturnedAmount', title: 'Returned Amount' }
                ],
                url: function () {
                    var tml = new Date().format('yyyyMMdd000000').substring(2),
                        voucher = formModel.Voucher.substring(0, 12);
                    if (voucher.length < 12) {
                        voucher = tml.substring(0, 12 - voucher.length) + voucher;
                    }
                    return '/ProductReturnArea/PurchaseByReturn/GetItemList?voucher=' + voucher
                },
                page: { 'PageNumber': 1, 'PageSize': 9999999, filter: [] },
                pagging: false,
                pagger: false,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
        this.GetData = function () {
            var list = [], model = getModel(), quantity;
            dataModel.Data.each(function () {
                quantity = parseFloat(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    var price = quantity.mlt(this.UnitPayableSalePrice),
                        unitReturnPrice = this.UnitPayableSalePrice - this.UnitPayableSalePrice.mlt(parseFloat(formModel.ReturnDiscount || '0')).div(100),
                        item = {
                            Name: this.Name,
                            Strength: this.Strength,
                            Category: this.Category,
                            Suplier: this.Suplier,
                            ItemId: this.ItemId,
                            ItemSaleId: this.Id,
                            VoucharNo: formModel.Voucher,
                            SoldQnt: this.UnitQuentity,
                            ReturnQnt: quantity,
                            TotalSoldPrice: this.TotalAmount,
                            SoldPrice: price,
                            ReturnAmount: unitReturnPrice.mlt(quantity),
                            UnitSoldPrice: this.UnitPayableSalePrice,
                            UnitReturnPrice: unitReturnPrice,
                            ReturnDiscount: formModel.ReturnDiscount,
                            Discount: this.DiscountP,
                            //SoldPrice-ReturnAmount
                            TotalReturnDiscount: price - unitReturnPrice.mlt(quantity),
                            TotalDiscount: this.TotalDiscount.div(this.UnitQuentity).mlt(quantity),
                            ItemReceiveId: this.ItemReceiveId,
                            SalesUnitTypeId: this.SalesUnitTypeId,
                            UnitTradePrice: this.UnitTradePrice,
                            TotalTradePrice: this.UnitTradePrice.mlt(quantity),
                            VAT: this.VAT,
                            UnitPurchasePrice: this.PurchasePrice.div(this.UnitQuentity),
                            UnitPurchaseVAT: this.PurchaseVAT.div(this.UnitQuentity),
                            UnitPurchaseDiscount: this.PurchaseDiscount.div(this.UnitQuentity)
                        }
                    list.push(item);

                    model.TotalDiscount += item.TotalDiscount;
                    model.PurchasePrice += item.UnitPurchasePrice.mlt(quantity);
                    model.PurchaseVAT += item.UnitPurchaseVAT.mlt(quantity);
                    model.PurchaseDiscount += item.UnitPurchaseDiscount.mlt(quantity);

                    item.SoldPricePrv = item.SoldPrice.toFloat(4);
                    item.ReturnPricePrv = item.ReturnAmount.toFloat(4);
                }
            });

            return { list: list, model: model, formModel: formModel };
        };
        this.Reset = function () {
            dataModel = { Data: [] };
            gridModel && gridModel.Reload();
            formModel.ReturnDiscount = 0;
            formModel.TotalReturnDiscount = 0;
            formModel.ReturnItem = 0;
            formModel.ReturnQuentity = 0;
            formModel.SoldPrice = 0;
            formModel.IsShowAll = false;
        };
        this.SetAll = function () {
            var item = 0, qnt = 0, price = 0;
            dataModel.Data.each(function () {
                if (formModel.IsShowAll) {
                    item++;
                    this.ReturnedQuantity = this.UnitQuentity - this.AlreadyReturnedQuantity;
                    qnt += this.UnitQuentity - this.AlreadyReturnedQuantity;
                    this.ReturnedAmount = (this.UnitQuentity - this.AlreadyReturnedQuantity).mlt(this.UnitPayableSalePrice).toFloat(4);
                    price += (this.UnitQuentity - this.AlreadyReturnedQuantity).mlt(this.UnitPayableSalePrice);
                } else {
                    this.ReturnedQuantity = 0;
                    this.ReturnedAmount = 0;
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt;
            formModel.SoldPrice = price.toFloat(3);
            if (formModel.IsTotal) {
                formModel.ReturnDiscount = price > 0 ? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100) : 0;
            } else {
                formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100).toFloat(4);
            }
            formModel.RetunAmount = (price - parseFloat(formModel.TotalReturnDiscount || '0')).toFloat(4);
        };
        (function () {
            function onReturnQntChanged(model) {
                var value = parseInt(this.value || '0');
                if (value + model.AlreadyReturnedQuantity > model.UnitQuentity) {
                    this.value = value = model.UnitQuentity - model.AlreadyReturnedQuantity;
                    alert("you can't return more than sold quantity. ");
                }
                model.ReturnedQuantity = value;
                model.ReturnedAmount = value.mlt(model.UnitPayableSalePrice).toFixed(4);
                onChange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('ReturnedQuantity', 'Returned Quantity', onReturnQntChanged, model));
                Global.Form.Bind(model, td);
            };
        }).call(selfService.UnitQuentity = {});
    }).call(service.Grid = {});
};











//var Controller = new function () {
//    var windowModel, formModel = { IsTotal :true}, inputs = {}, callerOptions, service = {}, gridModel;
//    function save() {
//        var model = service.Grid.GetData();
//        if (model.model.ReturnAmount <= 0) {
//            alert('Return amount can not be 0(zero).');
//            console.log(inputs);
//            $(inputs['RetunAmount']).focus();
//            return;
//        }
//        if (model.list.length > 0) {
//            Global.Add({
//                model: model,
//                close: close,
//                template: '/Content/IqraPharmacy/ProductReturnArea/Templates/PurchaseByReturnPreview.html',
//                onSaveSuccess: function () {
//                    close();
//                    callerOptions.onSaveSuccess();
//                },
//                url: '/Content/IqraPharmacy/ProductReturnArea/Content/ReturnByItemPreview.js?Type=Voucher',
//            });
//        }
//    };
//    function onSearch() {
//        gridModel.Reload();
//    };
//    function onSearchKeyUp(e) {
//        if (e.which === 13 || e.keyCode === 13) {
//            onSearch();
//        }
//    };
//    function onDiscountPChange() {
//        formModel.IsTotal = false;
//        var price = parseFloat(formModel.SoldPrice || '0');
//        formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
//        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
//    };
//    function onDiscountTChange() {
//        formModel.IsTotal = true;
//        var price = parseFloat(formModel.SoldPrice || '0');
//        formModel.ReturnDiscount = price > 0 ? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100) : 0;
//        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
//    };
//    function close() {
//        windowModel && windowModel.Hide();
//    };
//    function onShow() {
//        windowModel.Show();
//        formModel.IsTotal = true;
//        service.Grid.Reset();
//        $(inputs['Voucher']).focus();
//    };
//    this.Show = function (model) {
//        callerOptions = model;
//        if (windowModel) {
//            onShow();
//        } else {
//            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/AddPurchaseByReturn.html', function (response) {
//                windowModel = Global.Window.Bind(response, {width:'98%'});
//                windowModel.View.find('.btn_cancel').click(close);
//                Global.Click(windowModel.View.find('.btn_save'), save);
//                Global.Click(windowModel.View.find('.btn_search'), onSearch);
//                inputs = Global.Form.Bind(formModel, windowModel.View);
//                $(inputs['Voucher']).keyup(onSearchKeyUp);
//                $(inputs['IsShowAll']).change(service.Grid.SetAll);
//                $(inputs['ReturnDiscount']).change(onDiscountPChange).keyup(onDiscountPChange);
//                $(inputs['TotalReturnDiscount']).change(onDiscountTChange).keyup(onDiscountTChange);
//                onShow();
//                service.Grid.Bind();
//            }, noop);
//        }
//    };
//    (function () {
//        var dataModel = {Data:[]}, selfService = {};
//        function up(elm, func, option) {
//            elm.keyup(function () {
//                func.call(this, option);
//            }).focus(function () { $(this).select(); }).click(function (e) { e.stopPropagation(); return false; });
//            return elm;
//        };
//        function getInput(attr, placeHolder, func, option) {
//            return up($('<input data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 24px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option);
//        };
//        function onSelect(model) {
            
//        };
//        function rowBound(elm) {
//            selfService.UnitQuentity.Set(elm.find('.returned_quantity'), this);
//            Global.Click(elm, onSelect, this);
//        };
//        function onDataBinding(response) {
//            dataModel = response.Data||[[],[]];
//            setSummary(dataModel[0][0] || {});
//            response.Data.Data = response.Data[1]||[];
//            response.Data.Data.each(function () {
//                //this.UnitPayableSalePrice = this.UnitSalePrice;
//                this.UnitPayableSalePrice = this.UnitSalePrice - this.UnitSalePrice .mlt(this.DiscountP).div(100);
//                this.TotalAmount = this.UnitSalePrice.mlt(this.UnitQuentity);
//                this.NetTaka = this.NetTaka.toFloat();
//                this.TotalDiscount = this.TotalDiscount.toFloat();
//                this.ReturnedQuantity = 0;
//                this.ReturnedAmount = 0;
//            });
//        };
//        function setSummary(model) {
//            model = model || {};
//            formModel.CreatedAt =model.CreatedAt? model.CreatedAt.getDate().format('dd/MM/yyyy HH:mm'):'';
//            formModel.ItemCount = model.ItemCount||'';
//            formModel.SalePrice = ((model.TotalDiscount+model.SalePrice)||0).toFloat();
//            formModel.Discount = (model.Discount||0).toFloat();
//            formModel.TotalDiscount = (model.TotalDiscount || 0).toFloat();
//            formModel.PayableAmount = (model.SalePrice || 0).toFloat();
//        };
//        function onChange(data) {
//            var item = 0, qnt = 0, price = 0, quantity;
//            dataModel.Data.each(function () {
//                quantity=parseFloat(this.ReturnedQuantity||'0');
//                if (quantity > 0) {
//                    item++;
//                    qnt += quantity;
//                    price += quantity.mlt(this.UnitPayableSalePrice);
//                }
//            });
//            formModel.ReturnItem = item;
//            formModel.ReturnQuentity = qnt;
//            formModel.SoldPrice = price;
//            if (formModel.IsTotal) {
//                formModel.ReturnDiscount =price>0? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100):0;
//            } else {
//                formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
//            }
//            formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
//        };
//        function getModel() {
//            var data = dataModel[0][0],
//                model = {
//                    CustomerId: data.CustomerId,
//                    ItemSaleInfoId: data.Id,
//                    PaymentType: '',
//                    VoucherNo: formModel.Voucher,
//                    ItemCount: formModel.ReturnItem,
//                    SalePrice: formModel.SoldPrice,
//                    TradePrice: 0,
//                    Discount: parseFloat(formModel.TotalReturnDiscount || '0') || 0,
//                    Vat: data.VAT,
//                    ReturnAmount: formModel.RetunAmount,
//                    ComputerId: '00000000-0000-0000-0000-000000000000',
//                    PurchasePrice: 0, //Comes from list
//                    PurchaseVAT: 0, //Comes from list
//                    PurchaseDiscount: 0, //Comes from list
//                    SaleDiscount: 0  //Comes from list
//                };
//            return model;
//        };
//        this.Bind = function () {
//            Global.Grid.Bind({
//                elm: windowModel.View.find('#grid'),
//                columns: [
//                    { field: 'Name', filter: true },
//                    { field: 'Strength', filter: true },
//                    { field: 'Category', filter: true },
//                    { field: 'Suplier', filter: true },
//                    { field: 'UnitQuentity', title: 'Qnt' },
//                    { field: 'UnitSalePrice', title: 'Unit MRP' },
//                    { field: 'TotalAmount', title: 'Total' },
//                    { field: 'TotalDiscount', title: 'Discount' },
//                    { field: 'NetTaka', title: 'Payable' },
//                    { field: 'ReturnedQuantity', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
//                    { field: 'ReturnedAmount', title: 'Returned Amount' }
//                ],
//                url: function () {
//                    var tml = new Date().format('yyyyMMdd000000').substring(2),
//                        voucher = formModel.Voucher.substring(0, 12);
//                    if (voucher.length < 12) {
//                        voucher = tml.substring(0, 12 - voucher.length) + voucher;
//                    }
//                    return '/ProductReturnArea/PurchaseByReturn/GetItemList?voucher=' + voucher
//                },
//                page: { 'PageNumber': 1, 'PageSize': 9999999, filter: [] },
//                pagging: false,
//                pagger:false,
//                dataBinding: onDataBinding,
//                rowBound: rowBound,
//                onComplete: function (model) {
//                    gridModel = model;
//                },
//                Printable: false
//            });
//        };
//        this.GetData = function () {
//            var list = [], previewList = [], model = getModel(), quantity, discount = parseFloat(formModel.ReturnDiscount || '0') || 0;
//            dataModel.Data.each(function () {
//                quantity = parseFloat(this.ReturnedQuantity || '0') || 0;
//                if (quantity > 0) {
//                    var price = quantity.mlt(this.UnitPayableSalePrice),
//                        unitReturnPrice = this.UnitPayableSalePrice-this.UnitPayableSalePrice.mlt(parseFloat(formModel.ReturnDiscount || '0')).div(100),
//                    item = {
//                        ItemId: this.ItemId,
//                        ItemSaleId: this.Id,
//                        VoucharNo: formModel.Voucher,
//                        //ProductReturnId Should Come from Server.
//                        ItemReceiveId: this.ItemReceiveId,
//                        SalesUnitTypeId: this.SalesUnitTypeId,
//                        UnitQuentity: quantity,
//                        UnitSalePrice: this.UnitPayableSalePrice,
//                        TotalSalePrice: this.TotalAmount,
//                        UnitTradePrice: this.UnitTradePrice,
//                        TotalTradePrice: this.UnitTradePrice.mlt(quantity),
//                        ReturnAmount: unitReturnPrice.mlt(quantity),
//                        Discount: discount,
//                        VAT: this.VAT,
//                        UnitPurchasePrice: this.PurchasePrice.div(this.UnitQuentity),
//                        UnitPurchaseVAT: this.PurchaseVAT.div(this.UnitQuentity),
//                        UnitPurchaseDiscount: this.PurchaseDiscount.div(this.UnitQuentity)
//                    }
//                    previewList.push({
//                        Name: this.Name,
//                        Strength: this.Strength,
//                        Category: this.Category,
//                        Suplier: this.Suplier,
//                        ReturnAmount: item.ReturnAmount.toFloat(4),
//                        ReturnQnt: item.UnitQuentity
//                    });
//                    list.push(item);
//                    model.PurchasePrice += item.UnitPurchasePrice.mlt(quantity);
//                    model.PurchaseVAT += item.UnitPurchaseVAT.mlt(quantity);
//                    model.PurchaseDiscount += item.UnitPurchaseDiscount.mlt(quantity);
//                    model.SaleDiscount += this.TotalDiscount.div(this.UnitQuentity).mlt(quantity);
//                }
//            });

//            return { list: list, previewList: previewList, model: model, formModel: formModel };
//        };
//        this.Reset = function () {
//            dataModel = { Data: [] };
//            gridModel && gridModel.Reload();
//            formModel.ReturnDiscount = 0;
//            formModel.TotalReturnDiscount = 0;
//            formModel.ReturnItem = 0;
//            formModel.ReturnQuentity = 0;
//            formModel.SoldPrice = 0;
//            formModel.IsShowAll = false;
//        };
//        this.SetAll = function () {
//            var item = 0, qnt = 0, price = 0;
//            dataModel.Data.each(function () {
//                if (formModel.IsShowAll) {
//                    item++;
//                    this.ReturnedQuantity = this.UnitQuentity;
//                    qnt += this.UnitQuentity;
//                    this.ReturnedAmount = this.UnitQuentity.mlt(this.UnitPayableSalePrice).toFloat(4);
//                    price += this.UnitQuentity.mlt(this.UnitPayableSalePrice);
//                } else {
//                    this.ReturnedQuantity = 0;
//                    this.ReturnedAmount = 0;
//                }
//            });
//            formModel.ReturnItem = item;
//            formModel.ReturnQuentity = qnt;
//            formModel.SoldPrice = price.toFloat(3);
//            if (formModel.IsTotal) {
//                formModel.ReturnDiscount =price>0? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100):0;
//            } else {
//                formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100).toFloat(4);
//            }
//            formModel.RetunAmount = (price - parseFloat(formModel.TotalReturnDiscount || '0')).toFloat(4);
//        };
//        (function () {
//            function onReturnQntChanged(model) {
//                var value = parseInt(this.value || '0');
//                if (value > model.UnitQuentity) {
//                    this.value =value= model.UnitQuentity;
//                    alert("you can't return more than sold quantity. ");
//                }
//                model.ReturnedQuantity = value;
//                model.ReturnedAmount = value.mlt(model.UnitPayableSalePrice).toFixed(4);
//                onChange(model);
//            }
//            this.Set = function (td, model) {
//                td.html(getInput('ReturnedQuantity', 'Returned Quantity', onReturnQntChanged, model));
//                Global.Form.Bind(model, td);
//            };
//        }).call(selfService.UnitQuentity = {});
//    }).call(service.Grid = {});
//};