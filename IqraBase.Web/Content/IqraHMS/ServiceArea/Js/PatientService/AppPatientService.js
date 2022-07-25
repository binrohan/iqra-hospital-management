
var Controller = {};
(function () {
    var callerOptions = {};
    var service = {}, model = {}, formModel = {};
    function getView() {
        return $(`<div><div class="row summary_container">
                                        </div>
                                        <div class ="row filter_container" style="margin-top:10px;">
                                        </div>
                                        <div class ="empty_style button_container row" style="margin-top:10px;">
                                            <a class="btn btn-white btn-default btn-round pull-right btn_add_service" style="margin-left: 10px;"><span class="glyphicon glyphicon-plus"></span>Add Service</a>
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div class="grid_container">
                                            </div>
                                        </div></div>`);
    };

    function addNew(opt) {
        Global.Click(opt.container.find('.btn_add_service'), function () {
            Global.Add({
                model: opt.getCallarOptions(),
                name: 'AddPatientService',
                url: '/Content/IqraHMS/ServiceArea/Js/PatientService/AddPatientService.js',
                onSuccess: function () {
                    console.log(['model.gridModel && model.gridModel.Reload()', model]);
                    model.gridModel && model.gridModel.Reload();
                }
            });
        });
    };

    function setClosed() {
        return [{
            click: function (model,grid) {
                Global.Add({
                    name: 'PatientService=>Close',
                    save: '/ServiceArea/PatientService/Close',
                    columns: [
                        { field: 'EndAt', title: 'EndAt', dateFormat: 'yyyy/MM/dd HH:mm' },
                        { field: 'Remarks', title: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } }
                    ],
                    onsavesuccess: function () {
                        grid && grid.Reload();
                    },
                    onsubmit: function (postModel, data, formModel) {
                        postModel.ServiceId = model.Id;
                        postModel.EndAt = formModel.EndAt;
                        postModel.ActivityId = window.ActivityId;
                    }
                });
            },
            html: '<span title="Close this service"><span class="glyphicon glyphicon-trash"></span></span>'
        }];
    };
    function onDataBinding(response) {
    };
    function onRunningRequest(page) {
        page.filter = page.filter.where('itm=>itm.field != "Status" && itm.field != "' + page.Id + '"');
        page.filter.push({ field: 'Status', value: 'Running', Operation: 12 });
    };
    function onClosedRequest(page) {
        page.filter = page.filter.where('itm=>itm.field!="Status"');
        page.filter.push({ field: 'Status', value: 'Closed', Operation: 12 });
    };

    function getDaily(id, dataUrl, name, title, onRequest,actions, columns) {
        columns = columns || AppComponent.PatientService.Columns();
        return {
            Id: id,
            Name: name,
            title: title,
            filter: callerOptions.filter.slice(),
            Url: dataUrl,
            columns: columns,
            onrequest: onRequest,
            binding: onDataBinding,
            actions: actions,
            Printable: {

            },
        }
    };
    function getItems(options) {
        var items = [
            ['4693E266-61E8-48BB-88CB-D1D0935B7634', 'Get', 'All-Services', 'All Services'],
            ['42FAFBE1-6037-418A-A71D-3B5F92411F2F', 'Get', 'Closed-Services', 'Closed Services', onClosedRequest],
            ['2F367F39-9ABB-4A70-892B-B5E7A4BC01C3', 'Get', 'Running-Services', 'Running Services', onRunningRequest, setClosed()],
        ], tabs = [], tab;
        options.tabs.each(function () {
            tab = items[this];
            tabs.push(getDaily.apply(this, tab));
        });
        return tabs;
    };
    function bind(container, options) {
        model = {
            gridContainer: '.grid_container',
            container: container,
            Base: {
                Url: '/ServiceArea/PatientService/',
            },
            filter: options.filter.slice(),
            items: getItems(options),
            Summary: {
                Container: '.filter_container',
                Items: [
                    { field: 'Unit', title: 'Quantity', type: 2 },
                    { field: 'Amount', type: 2 },
                    { field: 'NetPayable', type: 2 },
                ]
            }
        };
        Global.Tabs(model);
        model.items[options.selected].set(model.items[options.selected]);
    };
    function setDefaultOpt(opt) {
        opt = opt || {};
        setNonCapitalisation(opt);
        callarOptions = opt;
        opt.model = opt.model || {};
        opt.filter = opt.filter || [];
        opt.tabs = opt.tabs || [0, 1, 2];
        opt.selected = opt.selected || 2;
        if (opt.container) {
            opt.container.append(getView());
        } else {
            opt.container = $('#page_container');
        }
        addNew(opt);
        return opt;
    };
    Controller.Show = function (options) {
        callerOptions = options;
        options = setDefaultOpt(options);
        options.model.Reload = function () {
            bind(options.container, options);
            options.model.Reload = function () {
                model.items[options.selected].set && model.items[options.selected].set(model.items[options.selected]);
            };
        };
    }
})();
