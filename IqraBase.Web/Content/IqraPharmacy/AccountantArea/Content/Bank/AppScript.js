
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.AccountDepreciationLife = 0;
        formModel.AccountDepreciationSalvageValue = 0;
        formModel.GroupId = groupId;
        formModel.IncreaseType = 1;
    };
    function getDropdown() {
        return [
            {
                Id: 'AccountDepreciationType',
                dataSource: [
                    { value: '0', text: 'Not Depreciable' },
                    { value: 1, text: 'Day' },
                    { value: 2, text: 'Week' },
                    { value: 3, text: 'Month' },
                    { value: 4, text: 'Year' }
                ]
            },
            {
                Id: 'CategoryId',
                position: 1,
                url: '/AccountantArea/AccountGroupCategory/AutoComplete',
                onChange: function (data) {

                },
                Type: 'AutoComplete',
                change: {
                    Id: 'GroupId', position: 2,
                    url: function (data) {
                        if (data)
                            return '/AccountantArea/AccountGroup/CustomDropDown?CategoryId=' + data.Id;
                    }
                },
            }
        ];
    };
    function getColumns() {
        return [
                { field: 'AccountCode', filter: true, Add: false },
                { field: 'GroupCategory', title: 'Category', filter: true, Add: false },
                { field: 'Group', filter: true, Add: false },
                { field: 'AccountName', filter: true },
                { field: 'AccountDescription', title: 'Description', required: false, filter: true, Add: { type: 'textarea', sibling: 1 } },
                { field: 'Credit', Add: false, Type: 2, Add: false },
                { field: 'Debit', Add: false, Type: 2 , Add: false},
                { field: 'Balance', title: 'Balance', sorting: false, Type: 2, Add: false }
        ]
    };
    function onEdit(model) {
        Global.Add({
            onSubmit: onSubmit,
            name: 'Account',
            columns: getColumns(),
            dropdownList: getDropdown(),
            model: model,
            onSaveSuccess: function () {

            },
            saveChange: '/AccountantArea/AppAccount/Edit'
        });
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.Description = this.AccountDescription;
            if (this.AccountDescription && this.AccountDescription.length > 35)
                this.AccountDescription = this.AccountDescription.substring(0, 30) + '.....';
            this.Balance = this.Debit - this.Credit;
        });
        data.Data.Total = data.Data.Total.Total;
    };
    function onRowBound(elm) {
        if (!this.IsEditable) {
            elm.find('.icon_container').remove();
        }
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    Global.List.Bind({
        Name: 'Account',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/AppAccount/Get',
            page: {
                'PageNumber': 1,
                'PageSize': 10,
                showingInfo: ' {0}-{1} of {2} Banks ',
                filter: [{ field: 'GroupId', value: groupId, Operation: 0 }]
            },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AccountantArea/AppAccount/OnCreate'
        },
        saveChange: '/AccountantArea/AppAccount/Edit',
        remove: { save: '/AccountantArea/AppAccount/Delete' }
    });
    (function () {
        function addTransaction(isDeposit, name) {
            Global.Add({
                Name: name,
                IsDeposit: isDeposit,
                onSuccess: function () {
                    gridModel.Reload();
                },
                url: '/Content/IqraPharmacy/AccountantArea/Content/Bank/AddTransaction.js?v=' + name
            });
        };
        Global.Click($('#btn_add_withdraw'), function () {
            addTransaction(false, 'Withdraw');
        });
        Global.Click($('#btn_add_deposite'), function () {
            addTransaction(true, 'Deposite');
        });
    })();
})();
