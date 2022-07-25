
var Controller = new function () {
    var loanAccountFilter = { "field": "Id", "value": "", Operation: 0 },
        loanTypeFilter = { "field": "Id", "value": "", Operation: 0 };
    function onUserDetails(id) {
        Global.Add({
            UserId: id,
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
    function onLoanAccountDetails(model) {
        console.log(model);
        Global.Add({
            model: model,
            name: 'LoanAccountDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/LoanAccount/OnDetails.js',
        });
    };
    function onLoanTypeDetails(model) {
        console.log(model);
        Global.Add({
            model: model,
            name: 'LoanTypeDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/LoanType/OnDetails.js',
        });
    };
    function getColunms(func) {
        return [
                    { field: 'Name', click: func, filter: true },
                    { field: 'Creator', filter: true, Add: false, className: 'creator', click: onCreatorDetails },
                    { field: 'Updator', filter: true, Add: false, className: 'updator', click: onUpdatorDetails }
        ]
    };
    this.Show = function (model) {
        loanAccountFilter.value = model.model.LoanAccountId;
        loanTypeFilter.value = model.model.LoanTypeId;
        Global.Add({
            model: model.model,
            Grid: [ {
                Header: 'Loan Account',
                filter: [loanAccountFilter],
                Columns: getColunms(onLoanAccountDetails),
                Url: '/PayrollArea/LoanAccount/Get',
            }, {
                Header: 'Loan Type',
                filter: [loanTypeFilter],
                Columns: getColunms(onLoanTypeDetails),
                Url: '/PayrollArea/LoanType/Get',
            }],
            DetailsUrl: '/PayrollArea/LoanStructure/Details?id=' + model.model.Id,
            name: 'OnLoanStructureDetails',
            url: '/Content/IqraService/Js/OnDetailsWithGrid.js?Type=LoanStructureDetails',
        });
    };
};