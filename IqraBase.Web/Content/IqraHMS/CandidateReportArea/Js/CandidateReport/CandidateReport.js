
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
                { field: 'Picture', title: 'Picture', bound: function (td) { td.html('<img src="' + (this.Picture||'')+'" />')} },
                { field: 'Patient', title: 'Patient' },
                { field: 'Code', title: 'Code', filter: true },
                { field: 'BillNo', title: 'BillNo', filter: true },
                { field: 'Status', title: 'Status', filter: true },
                { field: 'Weight', title: 'Weight'},
                { field: 'Height', },
                { field: 'MaritalStatus', },
                { field: 'Nationality', },
                { field: 'PassportNo', },
                { field: 'PlaceOfIssue', },
                { field: 'TravelingTo', },
                { field: 'VisaNo', },
                { field: 'VisaDate', },
                { field: 'Disorders', },
                { field: 'OtherFindings', },
                { field: 'DateOfExamined', dateFormat: 'dd mmm-yyyy hh:mm',},
                { field: 'ReportExpiryDate', dateFormat: 'dd mmm-yyyy hh:mm', }
            ],
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
                Url: '/CandidateReportArea/CandidateReport/',
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
    (function () {
        function onAdd(model) {
            Global.Add({
                name: 'AddCandidateReport',
                url: '/Content/IqraHMS/CandidateReportArea/Js/CandidateReport/AddCandidateReport.js',
                OnSave: () => {

                }
            });
        };
        Global.Click($('#btn_add_new'), onAdd);
    })();
})();
                