var Controller = new function () {
    var callarOptions, filter = { "field": "SalaryPaymentId", "value": "", Operation: 0 };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.model.Id;
        Global.Add({
            title: 'Salary Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Designation', filter: true },
                        { field: 'Year', },
                        { field: 'Month', },
                        { field: 'Basic', type: 2 },
                        { field: 'LateEntry', title: 'Late Entry', type: 2 },
                        { field: 'Absent', type: 2 },
                        { field: 'ScheduledBonus', title: 'Bonus', type: 2 },
                        { field: 'Bonus', title: 'Allowance', type: 2 },
                        { field: 'OverTime', type: 2 },
                        { field: 'Deduction', type: 2 },
                        { field: 'Advance', type: 2 },
                        { field: 'Loan', type: 2 },
                        { field: 'NetPayable', title: 'Payable', type: 2 },
                        { field: 'PaidAmount', title: 'Paid', type: 2 },
                        { field: 'Creator', className: 'creator' }
                    ],
                    model: model.model,
                    Id: model.model.Id,
                    DetailsUrl: function () {
                        return '/SalaryArea/SalaryRepayment/Details?Id=' + model.model.Id;
                    }
                },
                {
                    title: 'Paid History',
                    Grid: [{
                        Header: 'History',
                        filter: [filter],
                        Columns: [
                            { field: 'TotalAmount', title: 'Total', type: 2 },
                            { field: 'PayableAmount', title: 'Payable', type: 2 },
                            { field: 'PaidAmount', title: 'Paid', type: 2 },
                            { field: 'Remarks', filter: true },
                            { field: 'Creator', className: 'creator', filter: true }
                        ],
                        Url: '/SalaryArea/SalaryRepayment/Get',
                    }],
                }
            ],
            name: 'OnSalaryRepaymentDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=SalaryRepaymentDetails',
        });
    };
};