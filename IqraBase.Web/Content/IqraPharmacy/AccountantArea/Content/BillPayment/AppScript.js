var Controller = {};
(function () {
    var that = this, gridModel, service = {}, unitConvertion = 0, accessModel, callarOptions = {};
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }, { field: 'PaidAmount' }]
    };
    function getDaily(name, dataUrl, columns) {
        columns = columns || getDailyColumns();
        return {
            Name: name,
            Url: dataUrl,
            filter: filters.slice(),
            columns: columns,
            //binding: onDataBinding
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'BillFrom', title: 'Bill From', filter: true },
                { field: 'PaidFromAccount', title: 'Paid Account', filter: true },
                { field: 'PaidAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'BillTotal',type:2 },
                { field: 'PaidAmount', type: 2 },
                { field: 'DueAmount', type: 2 },
                { field: 'Description', filter: true},
                { field: 'Creator', required: false, filter: true, className: 'creator' }
            ],
            
        }
    };
    function getSummary() {
        return [
                { field: 'PaidAmount', title: 'Paid Amount', add: false, type: 2 }
        ];
    };
    var model = {}, formModel = {}, filters;
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
                Url: '/AccountantArea/BillPayment/',
            },
            items: [
                getDaily('Daily', 'GetDaily'),
                getDaily('Monthly', 'GetMonthly'),
                getItemWise()
            ],
            Summary: {
                container: container.find('#filter_container'),
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

