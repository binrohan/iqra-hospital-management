var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "BillId", "value": "", Operation: 0 },
        pFilter = { "field": "CustomerId", "value": "", Operation: 0 };
    function getView() {
        return $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new" style="margin-left: 1%"><span class="glyphicon glyphicon-plus"></span>New</a>
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
    };
    function onCreate(func) {
        Global.Add({
            model: callarOptions.model,
            BillId: callarOptions.BillId,
            OnSuccess: function (response) {
                func && func();
                console.log([callarOptions, callarOptions.OnChange]);
                callarOptions.OnChange && callarOptions.OnChange(response);
            },
            name: 'OnAddBillPayment',
            url: '/Content/IqraPharmacy/AccountantArea/Content/BillPayment/AddBillPayment.js',
        });
    };
    function setGrid(container, model, name, creator) {
        var tabModel = {}, view = $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new" style="margin-left: 1%"><span class="glyphicon glyphicon-plus"></span>New</a>
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
        container.append(view);
        model.Reload = function () {
            Global.Add({
                container: view,
                BaseModel: model,
                filter: [filter],
                name: name + 'Tab',
                url: '/Content/IqraPharmacy/AccountantArea/Content/' + name + '/AppScript.js',
                OnLoaded: function (tab) {
                    tabModel = tab;
                    model.Reload();
                }
            });
        };
        Global.Click(view.find('.button_container a'), creator, function () {
            tabModel && tabModel.gridModel && tabModel.gridModel.Reload();
        });
    };
    function getTab(title, caller) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                caller(container, model, name);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = pFilter.value = callarOptions.PatientId;
        Global.Add({
            title: 'Patient Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                            { field: 'Code' },
                            { field: 'Name'},
                            { field: 'Gender' },
                            { field: 'BloodGroup', title: 'Blood' },
                            { field: 'Mobile'},
                            { field: 'AlternativeMobile', title: 'Alternative Mobile' },
                            { field: 'Email' },
                            { field: 'Age' },
                            { field: 'Bed' },
                            { field: 'Amount', type: 2 },
                            { field: 'Paid', type: 2 },
                            { field: 'Discount', type: 2 },
                            { field: 'Due', type: 2 },
                            { field: 'Address' },
                            { field: 'Description' },
                            { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Creator' }
                    ],
                    model: model.model,
                    Id: callarOptions.PatientId,
                    DetailsUrl: function () {
                        return '/PatientArea/Patient/Details?Id=' + callarOptions.PatientId;
                    }
                },
                getTab('Purchase History', service.Purchase.Bind)
            ],
            name: 'OnPatientDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=PatientDetails',
        });
    };
    (function () {
        var tabModel = {}, view = getView(), gridModel;
        function getFilter() {
            return Global.Filters().Bind({
                container: view.find('#filter_container'),
                filter: [pFilter],
                type: 'ThisMonth',
                onchange: function (filter) {
                    if (gridModel) {
                        gridModel.page.filter = filter;
                        gridModel.Reload();
                    }
                }
            });
        };
        function onDetails(model) {
            Global.Add({
                name: 'SaleInfo',
                url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
                SaleInfoId: model.Id
            });
        };
        function rowBound(elm) {
            if (this.SalePrice <= this.TradePrice) {
                elm.css({ color: 'red' });
            }
        };
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        this.Bind = function (container, model) {
            container.append(view);
            model.Reload = function () {
                Global.Grid.Bind({
                    Name: 'Employee',
                    elm: view.find('#grid_container'),
                    columns: [
                        { field: 'VoucherNo', title: 'Voucher', filter: true, click: onDetails },
                        { field: 'Customer', filter: true },
                        { field: 'ItemCount', title: 'Item Count' },
                        { field: 'SalePrice', title: 'Sale Price' },
                        { field: 'TradePrice', title: 'Trade Price' },
                        { field: 'TotalDiscount', title: 'Discount' },
                        { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Computer', filter: true, Click: onComputerDetails }
                    ],
                    url: '/ItemSales/GetByUser',
                    page: { 'PageNumber': 1, 'PageSize': 30, showingInfo: ' {0}-{1} of {2} Purchases ', filter: getFilter() },
                    rowBound: rowBound,
                    onComplete: function (model) {
                        gridModel = model;
                    },
                    Printable: false
                });
                model.Reload = function () {
                    gridModel && gridModel.Reload();
                };
            };

        };
    }).call(service.Purchase = {});
};