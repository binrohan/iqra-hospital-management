var Controller = {};
(function () {
    var that = this, gridModel, service = {}, callarOptions = {};
    function onDetails(data){
        Global.Add({
            BillId: data.Id,
            model: data,
            name: 'BillDetails',
            url: '/Content/IqraPharmacy/AccountantArea/Content/Bill/BillDetails.js',
            OnChange: function () {
                console.log([model.gridModel , model.gridModel.Reload , model]);
                model.gridModel && model.gridModel.Reload && model.gridModel.Reload();
            }
        });
    };
    function getDailyColumns() {
        return [
            { field: 'CreatedAt', title: 'Date' }
        ].concat(getSummary('Total'));
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
                { field: 'From', filter: true,click:onDetails },
                { field: 'Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'DueDate', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Total', type: 2 },
                { field: 'PaidAmount', tilte: 'Paid', type: 2 },
                { field: 'DueAmount', tilte: 'Due', type: 2 },
                { field: 'TotalTax', tilte: 'Tax', type: 2 },
                { field: 'Creator', required: false, filter: true, className: 'creator' }
            ],
        }
    };
    function getSummary(total) {
        return [
            { field: total||'TotalAmount', title: 'Amount', type: 2 },
            { field: 'PaidAmount', title: 'Paid', type: 2 },
            { field: 'DueAmount', title: 'Due', type: 2 }
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
                Url: '/AccountantArea/Bill/',
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



