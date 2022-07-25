
var Controller = {};
(function () {
    var formModel = {}, filters, model, callarOptions;
    function onSubmit(postModel, data,formModel) {
        if (data) {
            postModel.Id = data.Id
        }
    };

    function onDetails(model) {
        Global.Add({
            CategoryId: model.Id,
            name: 'CandidateReportCategoryDetails',
            url: '/Content/IqraHMS/CandidateReportArea/Js/CandidateReportCategory/CandidateReportCategoryDetails.js',
        });
    }
    function onDataBinding(response) {

    };
    function onRowBound(elm) {
        //if (this.Balance < 0) {
        //    var balance = -this.Balance;
        //    elm.find('.balance').html('<span style="color:red">' + balance.toMoney()+' ( Due )'+'</span>');
        //}
    };
    function getItemWise() {
        return {
            Name: 'Refresh',
            Url: 'Get',
            columns: [
                { field: 'Name', title: 'Name', filter: true, click: onDetails },
                { field: 'Subtitle', title: 'Sub title', filter: true },
                { field: 'IsMedical', title: 'Is Medical?', required: false, add: { type: 'checkbox'} },
                { field: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } },
                { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Creator', title: 'Creator', filter: true, Add: false },
            ],
            add: {
                onSubmit: onSubmit,
                save: '/CandidateReportArea/CandidateReportCategory/Create',
            },
            edit: {
                saveChange: '/CandidateReportArea/CandidateReportCategory/Edit'
            },
            remove: {
                save: '/CandidateReportArea/CandidateReportCategory/Delete'
            },
            isList: true,
            //actions: getAccessButton(),
            binding: onDataBinding,
            bound: onRowBound
        }
    };

    function setTabs(container) {
        model = {
            container: container,
            Base: {
                Url: '/CandidateReportArea/CandidateReportCategory/',
            },
            items: [
                getItemWise()
            ],
        };
        Global.Tabs(model);
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
        setTabs(container, filter);
        opt.OnLoaded && opt.OnLoaded(model);
    };
})();
                