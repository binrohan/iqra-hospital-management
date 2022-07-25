
(function () {
    var increaseTypes=['Not Define','Debit','Credit'];
    function getTypeFileter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Not Define', value: '0' },
                    { text: 'Debit', value: '1' },
                    { text: 'Credit', value: '2' }
                ]
            }
        };
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.AccountDepreciationType = formModel.AccountDepreciationType || 0;
        formModel.AccountDepreciationLife = formModel.AccountDepreciationLife || 0;
        formModel.AccountDepreciationSalvageValue = formModel.AccountDepreciationSalvageValue || 0;
    };
    function getDropdown() {
        return [
            //{
            //    Id: 'AccountDepreciationType',
            //    dataSource: [
            //        { value: '0', text: 'Not Depreciable' },
            //        { value: 1, text: 'Day' },
            //        { value: 2, text: 'Week' },
            //        { value: 3, text: 'Month' },
            //        { value: 4, text: 'Year' }
            //    ]
            //},
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
    function getColumns(){
        return [
                { field: 'AccountCode', filter: true, add: false },
                { field: 'GroupCategory', title: 'Category', filter: true, add: false },
                { field: 'Group', filter: true, add: false },
                { field: 'AccountName', filter: true },
                { field: 'AccountDescription', title: 'Description', Add: {type:'textarea',sibling:1}, required: false, filter: true },
                { field: 'Credit',  add: false },
                { field: 'Debit', add: false },
                { field: 'IncreaseType', filter: getTypeFileter(), add: false },
                //{ field: 'AccountDepreciationType', title:'ADT', Add: false },
                //{ field: 'AccountDepreciationLife', title: 'ADL', required: false, add: { dataType: 'int|null' } },
                //{ field: 'AccountDepreciationSalvageValue', title: 'ADSV', required: false, add: { dataType: 'int|null' } }
        ]
    };
    function onChangeCode(model) {
        Global.Add({
            onSubmit: function (data) {
                data.Id = model.Id;
                data.Code = data.AccountCode;
                data.AccountCode = none;
            },
            name: 'Code',
            columns: [
                { field: 'AccountCode', title: 'Account Code' }
            ],
            model: model,
            onSaveSuccess: function () {
                gridModel.Reload();
            },
            saveChange: '/AccountantArea/AppAccount/SetAccountCode'
        });
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.Description = this.AccountDescription;
            if (this.AccountDescription && this.AccountDescription.length>35)
                this.AccountDescription = this.AccountDescription.substring(0, 30) + '.....';
            this.Debit = this.Debit.toFloat();
            this.Credit = this.Credit.toFloat();
            this.IncreaseType = increaseTypes[this.IncreaseType];
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
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Account',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/AppAccount/Get',
            page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Accounts ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [
                {
                click: onChangeCode,
                html: '<span class="hide_on_mobile icon_container" title="Change Code" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
                }
            ]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AccountantArea/AppAccount/OnCreate',
            saveChange: '/AccountantArea/AppAccount/Edit',
            dropdownList: getDropdown()
        },
        remove: { save: '/AccountantArea/AppAccount/Delete' }
    });

})();
