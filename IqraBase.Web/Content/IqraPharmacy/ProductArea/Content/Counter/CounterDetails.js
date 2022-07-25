///Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "CounterId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Items ', filter: [filter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        filter.value = model.model.CounterId;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/CounterDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, suplierId;
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
            var data = dataSource[callerOptions.SuplierId];
            data && Global.Add({
                UserId: data.CreatedBy,
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
            Global.CallServer('/ProductArea/Counter/Details?Id=' + callerOptions.model.CounterId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.SuplierId] = response.Data;
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
            if (suplierId === callerOptions.SuplierId) {
                return;
            }
            if (dataSource[callerOptions.SuplierId]) {
                populate(dataSource[callerOptions.SuplierId]);
            } else {
                load();
            }
            suplierId = callerOptions.SuplierId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, userId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#product_items').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function setItemType(model) {
            var scriptUrl = '/Content/IqraPharmacy/ProductArea/Content/Add.js?pharmacy', name = 'AddPharmacy';
            if (model.TypeId === pharmacyTypeId) {
                template = '/Content/IqraPharmacy/Pharmacy/Templates/Edit.html';
                typeName = 'Pharmacy';
                untUrl = '/UnitType/PharmacyAutoComplete';
                cntrUrl = '/ProductArea/Counter/PharmacyAutoComplete';
                ctgUrl = '/Category/PharmacyAutoComplete';
            } else {
                scriptUrl = '/Content/IqraPharmacy/ProductArea/Content/Add.js?non-pharmacy';
                name = 'AddNonePharmacy'
                template = '/Content/IqraPharmacy/NonePharmacy/Templates/Add.html';
                typeName = 'None-Pharmacy',
                untUrl = '/UnitType/NonePharmacyAutoComplete',
                cntrUrl = '/ProductArea/Counter/NonePharmacyAutoComplete',
                ctgUrl = '/Category/NonePharmacyAutoComplete';
            }
            return { Url: scriptUrl, Name: name };
        };
        function onAdd(model) {
            var tmpl = setItemType(model);
            Global.Add({
                Type: 0,
                ItemType: 0,
                model: model,
                name: tmpl.Name,
                url: tmpl.Url,
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onEdit(model) {
            var tmpl = setItemType(model);
            Global.Add({
                Type: 1,
                ItemType: 0,
                model: model,
                name: tmpl.Name,
                url: tmpl.Url,
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onDuplicate(model) {
            var tmpl = setItemType(model);
            Global.Add({
                Type: 2,
                ItemType: 0,
                model: model,
                name: tmpl.Name,
                url: tmpl.Url,
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onBarCodeChange(model) {
            Global.Add({
                model: model,
                name: 'Barcode',
                url: '/Content/IqraPharmacy/ProductArea/Content/BarcodeChangeController.js',
                onSaveSuccess: function (barcode) {

                }
            });
        };
        function onChangeUnitType(model) {
            //opts.model = model;
            //Global.Add(opts);
        };
        function onChangeSalePrice(model) {
            //opts.model = model;
            //Global.Add(opts);
        };
        function onDetails(model) {
            Global.Add({
                ItemId: model.Id,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onActivate(model) {
            var name = model.IsDeleted ? 'Activate' : 'DeActivate';
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: name + ' Item',
                    msg: 'Are you sure you want to ' + name + ' this item?',
                    save: '/ProductArea/Product/' + name + '?Id=' + model.Id,
                    data: { Id: model.Id },
                    onsavesuccess: function () {
                        gridModel.Reload();
                    }, onerror: function (response) {

                    },
                }
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
        function onChangeStock(model) {
            Global.Add({
                model: model,
                name: 'StockChange',
                url: '/Content/IqraPharmacy/ProductArea/Content/StockChangeController.js',
            });
        };
        function getColumns() {
            var column = [
                            { field: 'Code', filter: true, Add: false, Click: onDetails },
                { field: 'Name', title: 'Trade Name', filter: true, position: 1, Click: onDetails, className: 'product_name', width: 250 },
                { field: 'Category', filter: true, Add: false },
                { field: 'Strength', required: false, filter: true, position: 3, Add: { sibling: 4 } },
                //{ field: 'Suplier', filter: true, Add: false, Click: onSuplierDetails },
                { field: 'TotalStock', title: 'Stock', width: 60 },
                { field: 'TradePrice', title: 'TPPrice', width: 60, actionField: 'UnitTradePrice' },
                { field: 'MRPPrice', actionField: 'UnitSalePrice', title: 'MRPPrice', width: 60 },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails, className: 'updator' }
            ];
            if (window.ItemType === 0)
                column = column.slice(1);
            return column;
        };
        function rowBound(elm) {
            if (this.IsDeleted) {

                elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
                elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Status = txtStatus[this.Type];
                this.MRPPrice = (this.UnitSalePrice).toMoney();
                if (this.Vat !== this.PurchaseDiscount) {
                    this.TradePrice = (this.UnitTradePrice * 100 / (100 + this.Vat - this.PurchaseDiscount)).toMoney();
                } else {
                    this.TradePrice = (this.UnitTradePrice).toMoney();
                }
            });
        };
        function getOptions() {
            var opts = {
                Name: 'Product',
                Grid: {
                    elm: windowModel.View.find('#product_items_grid'),
                    columns: getColumns(),
                    url: '/ProductArea/Product/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Required Items ', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [{
                        click: onBarCodeChange,
                        html: '<a style="margin-right:8px;" title="Change Barcode"><i class="fa fa-barcode" aria-hidden="true"></i></a>'
                    }, {
                        click: onDuplicate,
                        html: '<a style="margin-right:8px;" title="Duplicate"><i class="fa fa-clone" aria-hidden="true"></i></a>'
                    }, {
                        click: onEdit,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Edit"><span class="glyphicon glyphicon-edit"></span></a>'
                    }, {
                        click: onChangeStock,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Change Stock"><span class="fa fa-database"></span></a>'
                    }, {
                        click: onActivate,
                        html: '<a style="margin-right:8px;" class="icon_container" title="DeActivate"><span class="fa fa-times"></span></a>'
                    }],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#product_items #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
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
        function onProductDetails(model) {
            Global.Add({
                ItemId: model.Id,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.ProductItems = {});//
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#supliers').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onDetails(model) {
            Global.Add({
                SuplierId: model.Id,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onAddOrderCategory(model) {
            Global.Add({
                model: model,
                name: 'OrderCategory',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/AddOrderCategoryController.js',
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
        }
        function onUpdatorDetails(model) {
            onUserDetails(model.UpdatedBy);
        }
        function onDataBinding(data) {

        };
        function rowBound(elm) {
            if (this.IsDeleted) {
                elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
                elm.find('a').css({ color: 'red' });
            }
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#supliers_grid'),
                columns: [
                    { field: 'Name', filter: true, position: 1, Click: onDetails },
                    { field: 'Counter', filter: true, Add: false },
                    { field: 'OrderCategory', filter: true, position: 1, Add: false },
                    { field: 'Phone', filter: true, required: false, position: 3 },
                    { field: 'Email', required: false, filter: true, position: 4 },
                    { field: 'WebSite', required: false, filter: true, position: 4 },
                    { field: 'Address', required: false, filter: true, Add: { type: 'textarea' }, position: 11 },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                    { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                    { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
                ],
                Actions: [{
                    click: onAddOrderCategory,
                    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
                }],
                url: '/SuplierArea/Suplier/Get',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Supliers ' },
                onDataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#supliers #button_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
                onComplete: function (model) {
                    gridModel = model;
                },
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.Supliers = {});
};