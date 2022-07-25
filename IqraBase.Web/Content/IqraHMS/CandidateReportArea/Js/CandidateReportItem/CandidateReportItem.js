
var Controller = {};
(function () {
    var formModel = {}, filters, model, summary = getSummaryClmn(), callarOptions;
    function getSummaryClmn() {
        return [
            { field: 'Value', title: 'Value', type: 2 },
            { field: 'AppliedValue', title: 'Applied Value', type: 2 },
            { field: 'Amount', title: 'Amount', type: 2 },
            { field: 'Cost', title: 'Cost', type: 2 }
        ]
    }
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }].concat(getSummaryClmn());
    };
    function getDoctorWiseColumns() {
        return [{ field: 'Doctor', title: 'Doctor', filter: true }].concat(getSummaryClmn())
    };
    function getReferenceWiseColumns() {
        return [{ field: 'ReferencedBy', title: 'ReferencedBy', filter: true  }].concat(getSummaryClmn());
    };
    function onDataBinding(response) {
        var data = response.Data.Total.Due;
        formModel.Due = (response.Data.Total.Due||0).toMoney();
    };
    function onRowBound(elm) {
        //if (this.Balance < 0) {
        //    var balance = -this.Balance;
        //    elm.find('.balance').html('<span style="color:red">' + balance.toMoney()+' ( Due )'+'</span>');
        //}
    };
    function getDaily(name,dataUrl, func) {
        func = func || getDailyColumns;
        return {
            Name: name,
            Url: dataUrl || name,
            filter: filters.slice(),
            columns: func(),
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'RelationType', title: 'RelationType', filter: true },
                { field: 'Doctor', title: 'Doctor', filter: true },
                { field: 'ReferencedBy', title: 'ReferencedBy', filter: true },
                { field: 'Value', title: 'Value', type: 2 },
                { field: 'AppliedValue', title: 'Applied Value', type: 2 },
                { field: 'Amount', title: 'Amount', type: 2 },
                { field: 'Cost', title: 'Cost', type: 2 },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Creator', title: 'Creator', filter: true },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                { field: 'Remarks', title: 'Remarks', filter: true }
            ],
            //isList: true,
            //actions: getAccessButton(),
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    function setTemplate(container) {
        container.find('.filter_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
            '<div><label>Due</label> : <span data-binding="Due" class="auto_bind" /></div>' +
            '</div>');
    };
    function setFilter(container, filter) {
        filters = Global.Filters().Bind({
            container: container.find('.filter_container'),
            formModel: formModel,
            filter: filter,
            type: 'ThisMonth',
            field: 'CreatedAt',
            onchange: function (filter) {
                if (model && model.gridModel) {
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
                Url: '/CommissionArea/Commission/',
            },
            items: [
                getDaily('Daily', 'GetDaily'),
                getDaily('Monthly', 'GetMonthly'),
                getDaily('Doctor-Wise', 'DoctorWise', getDoctorWiseColumns),
                getDaily('Reference-Wise', 'ReferenceWise', getReferenceWiseColumns),
                getItemWise()
            ],
            Summary: {
                Container: $('.filter_container'),
                Items: summary
            }
        };
        Global.Tabs(model);
        setTemplate(container);
        Global.Form.Bind(formModel, container.find('.filter_container'));
        callarOptions.BaseModel.Reload = function () {
            model.items[0].set(model.items[0]);
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
        opt.OnLoaded && opt.OnLoaded(model);
    };
    summary.pop();
})();
                