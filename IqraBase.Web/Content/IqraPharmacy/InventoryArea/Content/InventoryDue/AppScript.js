var Controller = {};
(function () {
    var that = this, gridModel, service = {}, callarOptions = {},
        model = {}, formModel = {}, filters;
    function onPatientDetails(data) {
        Global.Add({
            name: 'PatientDetails',
            url: '/Content/IqraPharmacy/PatientArea/Content/Patient/OnPatientDetails.js',
            PatientId: data.RelativeId,
            model: model
        });
    };
    function onSaleDetails(model) {
        Global.Add({
            name: 'SaleInfo',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
            SaleInfoId: model.SaleInfoId
        });
    };
    function getDailyColumns() {
        return [
            { field: 'CreatedAt', title: 'Date' }
        ].concat(getSummary());
    };
    function getDaily(name, dataUrl, columns) {
        columns = columns || getDailyColumns();
        return {
            Name: name,
            Url: dataUrl,
            filter: filters.slice(),
            columns: columns,
            binding: function (response) {
                response.Data.Total.TotalAmount = response.Data.Total.DueAmount + response.Data.Total.PaidAmount;
            }
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'VoucherNo', filter: true, click: onSaleDetails },
                { field: 'RelativeType', title: 'Type', filter: true },
                { field: 'Patient', filter: true, click: onPatientDetails },
                { field: 'Customer', filter: true, selected: false },
                { field: 'Paid', type: 2 },
                { field: 'Due', type: 2 },
                { field: 'OrginalDue', title: 'Orginal Due', type: 2 },
                { field: 'NetSaleAmount',title:'Sold Amount', type: 2 },
                { field: 'Description', filter: true, selected: false },
                { field: 'Creator', required: false, filter: true, className: 'creator' }
            ],
        }
    };
    function getSummary() {
        return [
                { field: 'Paid', type: 2 },
                { field: 'Due', type: 2 },
                { field: 'OrginalDue', title: 'Orginal Due', type: 2 },
                { field: 'NetSaleAmount', title: 'Sold Amount', type: 2 },
        ];
    };
    function setFilter(container, filter) {
        filters = Global.Filters().Bind({
            container: container.find('#filter_container'),
            formModel: formModel,
            filter: filter,
            type: 'ThisMonth',
            onchange: function (filter) {
                if (model.gridModel) {
                    model.gridModel.page.filter = filter;
                    model.gridModel.Reload();
                }
            }
        });
    };
    function setTabs(container) {
        model = {
            container: container,
            Base: {
                Url: '/InventoryArea/InventoryDue/',
            },
            items: [
                getDaily('Daily', 'GetDaily'),
                getDaily('Monthly', 'GetMonthly'),
                getItemWise()
            ],
            Summary: {
                container: container.find('#summary_container'),
                Items: getSummary()
            }
        };
        Global.Form.Bind(formModel, container.find('#filter_container'));
        Global.Tabs(model);
        callarOptions.BaseModel.Reload = function () {
            model.items[2].set(model.items[2]);
        };
    };
    function setDefaultOpt(opt) {
        opt = opt || {};
        callarOptions = opt;
        opt.container = opt.container || $('#page_container');
        opt.BaseModel = opt.BaseModel || {};
        return opt;
    };
    Controller.Show = function (opt) {
        opt = setDefaultOpt(opt);
        var container = opt.container || $('#page_container'), filter = opt.filter;
        setFilter(container, filter);
        setTabs(container, filter);
        opt.OnLoaded && !service.Loaded && opt.OnLoaded(model);
        service.Loaded = true;
    };
})();



