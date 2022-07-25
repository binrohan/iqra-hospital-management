
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.ParentId = formModel.ParentId || '00000000-0000-0000-0000-000000000000';
        formModel.Position = formModel.Position || 0;
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
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
    function onDataBinding(data) {

    };
    function onRowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Url && elm.find('.url').html('<a href="' + this.Url + '">' + this.Url + '</a>');
    };
    function getDpr() {
        var filter = { field: 'MenuCategoryId', value: '00000000-0000-0000-0000-000000000000', operation: 0 },
            ctgr = {
                Id: 'MenuCategoryId',
                url: '/MenuArea/MenuCategory/AutoComplete',
                Type: 'AutoComplete',
                Position: 1,
                add: { sibling: 3 },
                onChange: function (data) {
                    if (data) {
                        filter.value = data.Id;
                        parent.datasource = none;
                    } else {
                        parent.datasource = [];
                        filter.value = '00000000-0000-0000-0000-000000000000';
                    }
                    parent.Reload();
                }
            },
        parent = {
            Id: 'ParentId',
            datasource: [],
            url: function () {
                return '/MenuArea/MenuItem/AutoComplete'
            },
            Type: 'AutoComplete',
            Position: 1,
            required: false,
            page: { "PageNumber": 1, "PageSize": 20, filter: [filter] },
            onDataBinding: function (response) {
                response.Data.push({ Id: '00000000-0000-0000-0000-000000000000', Name:'Base' });
            },
            add: { sibling: 3 }
        };
        return [ctgr, parent];
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Category',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'MenuCategory', filter: true, Add: false },
                { field: 'Name', filter: true, Add: { sibling: 2 },Position:3 },
                { field: 'Url', className: 'url', filter: true, required: false, Add: { sibling: 2 }, Position: 4, width: 200 },
                { field: 'Position', required: false, Add: { sibling: 3 }, Position: 2,width:70 },
                { field: 'CssId', filter: true, required: false, Position: 5 },
                { field: 'CssClass', filter: true, required: false, Position: 6 },
                { field: 'Description', required: false, filter: true, Add: { type: 'textarea', sibling: 1 }, Position: 8 },
                //{ field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', className: 'creator', filter: true, Add: false, Click: onCreatorDetails },
                //{ field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', className: 'updator', filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/MenuArea/MenuItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
            rowBound: onRowBound,
            Action: {width:70}
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/MenuArea/MenuItem/Create',
            saveChange: '/MenuArea/MenuItem/Edit',
            dropdownList: getDpr()
        },
        remove: { save: '/MenuArea/MenuItem/Delete' }
    });
})();

