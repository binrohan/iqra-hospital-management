
(function () {
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }, { field: 'Amount' }]
    };
    function getAccountWiseColumns() {
        return [{ field: 'Type', title: 'Account',filter:true }, { field: 'Amount' }]
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            name: 'ExpenseInfo',
            url: '/Areas/ItemExpensesArea/Content/ExpenseDetails.js',
            ExpenseInfoId: model.Id
        });
    };
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
        });
    };
    function onUserDetails(Id) {
        Global.Add({
            UserId: Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onApproverDetails(model) {
        onUserDetails(model.ApprovedBy);
    };
    function onExpenseByDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onApproved(data) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OnApprove',
                save: '/ExpenseArea/Expense/Approve',
                data: { Id: data.Id },
                onsavesuccess: function () {
                    model.gridModel && model.gridModel.Reload();
                }
            }
        });
    };
    function onDataBinding(response) {
        formModel.Amount = (response.Data.Total.Amount || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            this.Active = this.Active ? "Yes" : "No";
            this.Amount = this.Amount.toMoney();
        });
    };
    function onFileView(model) {
        Global.Add({
            name: 'FileViewer',
            url: '/Content/IqraPharmacy/ExpenseArea/Content/ImageViewer.js',
            model: model
        });
    };
    function setImage(model, elm) {
        if (model.FileCount > 1) {
            var link = $('<a href="#"><img src="/Content/Img/folderIcon.png" style="max-width: 100%; max-height:100px;"/></a>');
            elm.find('.picture').append(link);
            Global.Click(link, onFileView, model);
        } else if (model.FileCount == 1) {
            var link = $('<a href="#"><img src="/Expense/Picture/' + model.Id + '" style="max-width: 100%; max-height:100px;"/></a>');
            elm.find('.picture').append(link);
            Global.Click(link, onFileView, model);
        } else if (model.FileCount == 0) {
            elm.find('.picture').append('<img src="/Content/Img/NoImage.png" style="max-width: 100%; max-height:100px;"/>');
        }
    }
    function onRowBound(elm) {
        setImage(this, elm);
        if (this.Approver) {
            elm.find('.btn_approve').remove();
        }
    };
    function getAccessButton() {
        if (hasApproveAccess) {
            return [{
                click: onApproved,
                html: '<span class="icon_container btn_approve"><span class="glyphicon glyphicon-open"></span></span>'
            }, {
                click: onAddFiles,
                html: '<span class="icon_container btn_add_files"><span class="glyphicon glyphicon-file"></span></span>'
            }];
        } else {
            return [
                {
                    click: onAddFiles,
                    html: '<span class="icon_container btn_add_files"><span class="glyphicon glyphicon-file"></span></span>'
                }
            ];
        }
    };
    function onAddFiles(model) {
        Global.Add({
            name: 'AddFile',
            url: '/Content/IqraPharmacy/ExpenseArea/Content/AddFile.js',
            model: model
        });
    };
    function getDaily(name, func) {
        func = func || getDailyColumns;
        return {
            Name: name,
            Url: name,
            filter: filters.slice(),
            columns: func(),
            binding: onDataBinding
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'Amount', add: false },
                { field: 'Description',filter:true, position: 6, add: { type: 'textarea', sibling: 1 } },
                { field: 'ResponsibleUser', filter: true, title: 'ExpenseBy', position: 5, click: onExpenseByDetails },
                { field: '', title: 'Image', className: 'picture', position: 5.3 },
                { field: 'Type', position: 4, filter: true },
                { field: 'Creator', click: onCreatorDetails, filter: true },
                { field: 'Approver', click: onApproverDetails, filter: true },
                { field: 'ExpenseAt', position: 5, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                { field: 'Status', add: false }
            ],
            isList:true,
            actions: getAccessButton(),
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    function setTemplate() {
        $('#filter_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>Amount</label></div>' +
        '<div><span data-binding="Amount" class="form-control auto_bind" /></div>' +
    '</div>');
    };
    var formModel={},filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        onchange: function (filter) {
            console.log([model, filter]);
            if (model.gridModel) {
                model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    });
    var model = {
        Base: {
            Url: '/ExpenseArea/Expense/',
        },
        items: [
            getDaily('Daily'), getDaily('Monthly'), getDaily('AccountWise', getAccountWiseColumns),
            getItemWise()
        ]
    };
    setTemplate();
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[3].set(model.items[3]);
    (function () {
        var opts = {
            name: 'Expense',
            url: '/Content/IqraPharmacy/ExpenseArea/Content/AddExpense.js',
            onSaveSuccess: function () {
                model.gridModel&&model.gridModel.Reload();
            }
        };
        $('#btn_add_new').click(function () {
            Global.Add(opts);
        });
    })();
})();
