
(function () {
    var that = this, gridModel, accessModel, statusStr = ['Pending', 'Approved', 'Rejected'];
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.FromDate = model.FromDate;
        formModel.ToDate = model.ToDate;
        formModel.StartAt = model.FromDate + ' ' + model.StartAt;
        formModel.EndAt = model.ToDate + ' ' + model.EndAt;
        console.log([formModel, data, model]);
    };
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
    function onTypeDetails(model) {
        Global.Add({
            model: model,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.StatusStr = statusStr[this.Status] || 'Not Defined';
        });
    };
    function setData() {
        accessModel = {};
        if (accessList.IsError) {

        } else {
            accessList.Data.each(function () {
                this.each(function () {
                    accessModel[this + ''] = true;
                });
            });
        }
        if (!accessModel.Create) {
            $('#btn_add_new').remove();
        }
        return accessModel;
    };
    function getAdd() {
        accessModel = accessModel || setData();
        if (accessModel.Edit || accessModel.Create) {
            return {
                onSubmit: onSubmit,
                save: '/PayrollArea/LoanStructure/Create',
                saveChange: '/PayrollArea/LoanStructure/Edit',
                dropdownList: [
                             {
                                 Id: 'LoanAccountId',
                                 position: 1,
                                 url: '/PayrollArea/LoanAccount/AutoComplete',
                                 Type: 'AutoComplete'
                             }, {
                                 Id: 'LoanTypeId',
                                 position: 1,
                                 url: '/PayrollArea/LoanType/AutoComplete',
                                 Type: 'AutoComplete'
                             }
                ],
                details: function (data) {
                    return '/PayrollArea/LoanStructure/Details?Id=' + data.Id
                }
            };
        } else {
            return false;
        }
    };
    Global.List.Bind({
        Name: 'LoanStructure',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Name', click: onDetails, filter: true, position: 3 },
                    { field: 'LoanAccount', filter: true, title: 'Account', Add: false, click: onAccountDetails },
                    { field: 'LoanType', filter: true, title: 'Installment', Add: false, click: onTypeDetails },
                    { field: 'InterestRate', title: 'Rate', position: 3 },
                    { field: 'MaxAmount', title: 'Max', position: 4 },
                    { field: 'MinAmount', title: 'Min', position: 4 },
                    { field: 'Creator', filter: true, Add: false, className: 'creator', click: onUserDetails }
            ],
            url: '/PayrollArea/LoanStructure/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Structures ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        Edit: false,
        //Edit:accessModel.Edit==true,
        remove: false
    });
})();
