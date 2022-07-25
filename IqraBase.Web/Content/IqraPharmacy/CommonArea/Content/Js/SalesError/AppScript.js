
(function () {
    function getDailyColumns() {
        return [
            { field: 'CreatedAt', title: 'Date' },
            { field: 'PreviousAmount', title: 'Previous Amount', type: 2 },
            { field: 'AfterAmount', title: 'After Amount', type: 2 }
        ]
    };
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
        });
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(response) {
        formModel.PreviousAmount = (response.Data.Total.PreviousAmount || 0).toMoney(4);
        formModel.AfterAmount = (response.Data.Total.AfterAmount || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
        });
    };
    function onFileView(model) {
        Global.Add({
            name: 'FileViewer',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/SalesError/ImageViewer.js',
            model: model
        });
    };
    function setImage(model, elm) {
        var link = $('<a href="#"><img src="/CommonArea/SalesError/Icons/' + model.Id + '" style="max-width: 100%; max-height:100px;"/></a>');
        elm.find('.picture').append(link);
        Global.Click(link, onFileView, model);
    }
    function onRowBound(elm) {
        setImage(this, elm);
        if (this.Approver) {
            elm.find('.btn_approve').remove();
        }
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
            columns: [
                { field: 'PreviousAmount', title: 'Previous Amount', type: 2 },
                { field: 'AfterAmount', title: 'After Amount', type: 2 },
                { field: '', title: 'Image', className: 'picture' },
                { field: 'Creator', click: onCreatorDetails, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                { field: 'Computer', click: onComputerDetails }
            ],
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    function setTemplate() {
        $('#filter_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>Previous Amount</label></div>' +
        '<div><span data-binding="PreviousAmount" class="form-control auto_bind" /></div>' +
    '</div>'+
    '<div class="col-md-2 col-sm-4 col-xs-6">' +
        '<div><label>After Amount</label></div>' +
        '<div><span data-binding="AfterAmount" class="form-control auto_bind" /></div>' +
    '</div>');
    };
    var formModel = {}, filters = Global.Filters().Bind({
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
            Url: '/CommonArea/SalesError/',
        },
        items: [
            getDaily('Daily'),
            getDaily('Monthly'),
            getItemWise()
        ]
    };
    setTemplate();
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[2].set(model.items[2]);
})();
