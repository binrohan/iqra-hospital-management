
var APPService = {};
(function () {
    
    function onDetails() {
        Global.Add({
            Type: 1,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/StockPosition.js',
        });
    };
    function onNonePharmacyReport() {
        Global.Add({
            Type: 2,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/StockPosition.js',
        });
    };
    function onAllReport() {
        Global.Add({
            Type: 0,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/StockPosition.js',
        });
    };
    function onSummaryReport() {
        Global.Add({
            Type: 0,
            IsSummary: true,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/StockPosition.js',
        });
    };
    function onPreviousStockReport() {
        Global.Add({
            Type: 0,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/PreviousStock.js',
        });
    };

    function counterSaleReport() {
        Global.Add({
            Type: 1,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/Sales/StockPosition.js',
        });
    };
    function onNonePharmacySaleReport() {
        Global.Add({
            Type: 2,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/Sales/StockPosition.js',
        });
    };
    function onAllSaleReport() {
        Global.Add({
            Type: 0,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/Sales/StockPosition.js',
        });
    };
    function onSummarySaleReport() {
        Global.Add({
            IsPharmacy: true,
            Type: 0,
            name: 'Report',
            url: '/Content/IqraPharmacy/ReportArea/Content/Sales/StockPosition.js',
        });
    };

    //Purchase
    function PurchaseBaseReport() {
        Global.Add({
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/Purchase/ReportBase.js',
            Type: 0,
        });
    };
    function PurchasePharmacyReport() {
        Global.Add({
            filter: [{ field: 'TypeId', value: PharmacyTypeId, Operation: 0 }],
            Type: 1,
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/Purchase/ReportBase.js',
        });
    };
    function PurchaseNonePharmacyReport() {
        Global.Add({
            filter: [{ field: 'TypeId', value: NonePharmacyTypeId, Operation: 0 }],
            Type: 2,
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/Purchase/ReportBase.js',
        });
    };
    function PurchaseSummaryReport() {
        Global.Add({
            IsSummary: true,
            Type: 3,
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/Purchase/ReportBase.js',
        });
    };

    //Required Items
    function RequiredItemBaseReport() {
        Global.Add({
            Type: 0,
            name: 'RequiredItemBase',
            url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/ReportBase.js',
        });
    };
    function RequiredItemPharmacyReport() {
        Global.Add({
            Type: 1,
            filter: [{ field: 'TypeId', value: PharmacyTypeId, Operation: 0 }],
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/ReportBase.js',
        });
    };
    function RequiredItemNonePharmacyReport() {
        Global.Add({
            Type: 2,
            filter: [{ field: 'TypeId', value: NonePharmacyTypeId, Operation: 0 }],
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/ReportBase.js',
        });
    };
    function RequiredItemSummaryReport() {
        Global.Add({
            IsSummary: true,
            Type: 3,
            name: 'PurchaseReport',
            url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/ReportBase.js',
        });
    };

    function onChangePassword() {
        Global.Add({
            name: 'ChangePassword',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/ChangePassword.js',
            onSaveSuccess: function () {

            }
        });
    };
    Global.Click($('#btn_change_password'), onChangePassword);
    this.SetMwnuEvents = function () {
        Global.Click($('#stock_position_pharmacy'), onDetails);
        Global.Click($('#stock_position_none_pharmacy'), onNonePharmacyReport);
        Global.Click($('#stock_position_all'), onAllReport);
        Global.Click($('#stock_position_previous_stock'), onPreviousStockReport);
        Global.Click($('#stock_position_summary'), onSummaryReport);

        Global.Click($('#Sale_stock_position_pharmacy'), counterSaleReport);
        Global.Click($('#Sale_stock_position_none_pharmacy'), onNonePharmacySaleReport);
        Global.Click($('#Sale_stock_position_all'), onAllSaleReport);
        Global.Click($('#Sale_stock_position_summary'), onSummarySaleReport);

        //ParchaseReport
        Global.Click($('#purchase_reports_all'), PurchaseBaseReport);
        Global.Click($('#purchase_reports_pharmacy'), PurchasePharmacyReport);
        Global.Click($('#purchase_reports_none_pharmacy'), PurchaseNonePharmacyReport);
        Global.Click($('#purchase_reports_summary'), PurchaseSummaryReport);

        //Required Items
        Global.Click($('#required_item_report_base'), RequiredItemBaseReport);
        Global.Click($('#required_item_report_pharmacy'), RequiredItemPharmacyReport);
        Global.Click($('#required_item_report_none_pharmacy'), RequiredItemNonePharmacyReport);
        Global.Click($('#required_item_report_summary'), RequiredItemSummaryReport);
    };
    (function () {
        function getCategoryTemplete(model) {
            return '<li class="treeview">'+
                        '<a>'+
                            '<i class="fa fa-dashboard"></i><span>' + model.Name + '</span>'+
                            '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>'+
                        '</a>'+
                    '</li>';
        };
        function getItemTemplate(model) {
            var id = model.CssId ? ' id="' + model.CssId + '"' : '';
            return '<li' + id + '><a href="' + (model.Url||'#') + '"><i class="fa fa-circle-o"></i>' + model.Name + '</a></li>';
        };
        function createMenuItem(list, container) {
            var elm, ul = $('<ul class="treeview-menu">');
            container.append(ul);
            list.each(function () {
                if (this.Items && this.Items.length) {
                    createMenu([this], ul);
                } else {
                    elm = $(getItemTemplate(this));
                    ul.append(elm);
                }
            });
        };
        function createMenu(list, container) {
            var elm;
            container =container|| $('#menu_container').empty();
            list.each(function () {
                elm = $(getCategoryTemplete(this));
                container.append(elm);
                createMenuItem(this.Items.orderBy('Position'), elm);
            });
        };
        this.Load = function () {
            container = $('#menu_container').empty();
            Global.CallServer('/MenuArea/MenuAccess/GetMenu' , function (response) {
                if (!response.IsError) {
                    var obj = {}, list = [], itemModel = {};
                    response.Data.each(function (i) {
                        itemModel[this.Id] = this.Items = [];
                    });
                    response.Data.each(function (i) {
                        if (!obj[this.CategoryId]) {
                            list.push(obj[this.CategoryId] = {
                                Id: this.CategoryId,
                                Name: this.Category,
                                CssId: this.CategoryCssId || 'CategoryCssId_' + i,
                                CssClass: this.CategoryCssClass || '',
                                CategoryPosition:this.CategoryPosition,
                                Items:[]
                            });
                        }
                        if (itemModel[this.ParentId]) {
                            itemModel[this.ParentId].push(this);
                        } else {
                            obj[this.CategoryId].Items.push(this);
                        }
                    });
                    createMenu(list.orderBy('CategoryPosition'));
                    APPService.SetMwnuEvents();
                    //console.log([list,response.Data,itemModel]);
                } else {
                    //console.log(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors.');
            }, {"PageNumber": 1, "PageSize": 1000 }, 'POST');
        };
    }).call(this.Menu = {});
}).call(APPService);
APPService.Menu.Load();