var Controller = {};
(function () {
    var that = this, gridModel, service = {}, callarOptions = {},
        model = {}, formModel = {}, filters, types = ['No Tax', 'Tax Included', 'Tax Excluded'];
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.TaxType = types[this.TaxType]||'';
        });
    };
    function getTypeFileter() {
        return {
            DropDown: {
                dataSource: [
                    { value: '0', text: 'No Tax' },
                    { value: 1, text: 'Tax Included' },
                    { value: 2, text: 'Tax Excluded' }
                ]
            }
        };
    };
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
                { field: 'TaxType', title: 'Tax Type', filter: getTypeFileter(), Operation: 0 },
            { field: 'Debit', type: 2 },
            { field: 'Credit', type: 2 },
            { field: 'DebitTax', title: 'Tax Expense', type: 2 },
            { field: 'CreditTax', title: 'Tax Payable', type: 2 },
            { field: 'Amount', title: 'Amount', type: 2 },
            { field: 'Creator', filter: true },
            { field: 'CreatedAt', Add: false, selected: false, dateFormat: 'dd/MM/yyyy hh:mm' },
            { field: 'Remarks', filter: true, selected: false }
            ],
            binding: onDataBinding
        }
    };
    function getAccountWise() {
        return {
            Name: 'Account-Wise',
            Url: 'GetByAccount',
            filter: filters.slice(),
            columns: [
            { field: 'Account', filter: true, },
            { field: 'Debit', type: 2 },
            { field: 'Credit', type: 2 },
            { field: 'TaxRate', type: 2 },
            { field: 'DebitTax', title: 'Tax Expense', type: 2 },
            { field: 'CreditTax', title: 'Tax Payable', type: 2 },
            { field: 'CreatedAt', Add: false, selected: false, dateFormat: 'dd/MM/yyyy hh:mm' },
            { field: 'Description', filter: true, selected: false }
            ],
        }
    };
    function getSummary() {
        return [
            { field: 'Debit', type: 2 },
            { field: 'Credit', type: 2 },
            { field: 'DebitTax', title: 'Tax Expense', type: 2 },
            { field: 'CreditTax', title: 'Tax Payable', type: 2 },
            { field: 'Amount', title: 'Amount', type: 2 },
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
                Url: '/AccountantArea/ManualJournal/',
            },
            items: [
                getDaily('Daily', 'GetDaily'),
                getDaily('Monthly', 'GetMonthly'),
                getAccountWise(),
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
            model.items[3].set(model.items[3]);
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

    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'OnAddManualJournal',
            url: '/Content/IqraPharmacy/AccountantArea/Content/ManualJournal/AddManualJournal.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();



