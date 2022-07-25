
var Controller = new function () {
    var filter = { "field": "LoanAccountId", "value": "", Operation: 0 };
    function onUserDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'LoanStructureDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/LoanStructure/OnDetails.js',
        });
    }
    function onAccountDetails(model) {
        Global.Add({
            model: model,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    }
    this.Show = function (model) {
        filter.value = model.model.Id;
        Global.Add({
            model: model.model,
            Grid: [{
                Header: 'Loan Structures',
                filter: [filter],
                Columns: [
                   { field: 'Name', click: onDetails, filter: true },
                    { field: 'LoanAccount', filter: true, title: 'Account', click: onAccountDetails },
                    { field: 'LoanType', filter: true, title: 'Installment' },
                    { field: 'InterestRate', title: 'Rate', position: 4 },
                    { field: 'MaxAmount', title: 'Max', position: 4 },
                    { field: 'MinAmount', title: 'Min', position: 4 },
                    { field: 'Creator', filter: true, className: 'creator', click: onUserDetails }
                ],
                Url: '/PayrollArea/LoanStructure/Get',
            }],
            name: 'OnLoanAccountIDetails',
            url: '/Content/IqraService/Js/OnDetailsWithGrid.js?Type=LoanAccountDetails',
        });
    };
};