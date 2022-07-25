
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = {}, invgridModel;
    function save() {
        if (formModel.IsValid) {
            var list = service.Investigation.GetResult();
            windowModel.Wait('Please Wait while saving data......');
            Global.CallServer('/InvestigationArea/PatientInvestigationItem/SetBatchResult', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                    printInvoice(response.Id);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                alert('Network Errors.');
            }, list, 'POST');
            console.log(['after save', model]);
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            service.Loader.Load();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InvestigationArea/Templates/OnSetData.html', function (response) {
                windowModel = Global.Window.Bind(response, {width:'95%'});
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                windowModel.Show();
                service.Investigation.Bind();
                service.Loader.Load();
            }, noop);
        }
    };
    (function () {
        function populate(patient, inv) {
            Global.Copy(formModel, patient, true);
            Global.Copy(formModel, inv, true);
        };
        this.Load = function () {
            windowModel.Wait('Please wait while saving data......');
            Global.CallServer('/InvestigationArea/PatientInvestigationList/DetailsForSetData?Id='+callerOptions.InvestigationListId, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    populate(response.Data[0][0], response.Data[1][0]);
                    service.Investigation.SetData(response.Data[2]);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                alert('Network Errors.');
            }, {}, 'POST');

        };
    }).call(service.Loader = {});
    (function () {
        var dic = {};
        function setData(list) {
            var datasource = [], group = {
                dic: {},
                list: []
            }, category = {
                dic: {},
                list: [],
                group:[]
                };
            list.each(function () {
                if (this.Category) {
                    if (this.Group) {
                        if (group.dic[this.Group]) {
                            group.dic[this.Group].items.push(this);
                        } else {
                            group.dic[this.Group] = { items: [this], position: this.GroupPosition||0};
                            group.list.push(group.dic[this.Group]);
                            if (!category.dic[this.Category]) {
                                category.list.push(category.dic[this.Category] = { items: [], position: this.CategoryPosition || 0, groups: [] });

                            }
                            category.dic[this.Category].groups.push(group.dic[this.Group]);

                        }
                    } else {
                        if (category.dic[this.Category]) {
                            category.dic[this.Category].items.push(this);
                        } else {
                            category.dic[this.Category] = { items: [this], position: this.CategoryPosition||0,groups:[] };
                            category.list.push(category.dic[this.Category]);
                        }
                    }
                } else {
                    datasource.push(this)
                }
            });
            //group.list.orderBy('position');
            category.list.orderBy('position');
            //group.list.each(function () {
            //    this.items[0].GroupHeader = this.items[0].Group || '';
            //});
            category.list.each(function () {
                var ctgr = this;
                this.groups.orderBy('position');
                this.groups.each(function () {
                    this.items[0].GroupHeader = this.items[0].Group || '';
                    ctgr.items = ctgr.items.concat(this.items);
                });
                this.items[0].CategoryHeader = this.items[0].Category || '';
                datasource = datasource.concat(this.items);
            });
            console.log(['', datasource, category, group]);
            return datasource;
        };
        function onResultBound(td) {
            var model = this,
                elm = $('<input class="form-control" type="text" style="width: calc(100% - 10px); margin: 2px 0px;" placeholder="Result In ' + this.Unit + '" autocomplete="off">');
            td.html(elm);
            var result = model.Result;
            Global.AutoBind(model, elm, 'Result', '', 0, true);
            model.Result = result;
            elm.keyup(function () {
                console.log(['model=>', model]);
            });
        };
        function onRowBound(elm,tbody,b,c) {
            //var id = Global.Guid();
            //elm.addClass(id);
            var prnt = elm.parent();
            if (this.CategoryHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.8em;">' + this.CategoryHeader + '</td></tr>');
                //tr.insertBefore('.' + id);
                tbody.append(tr);
                //console.log(['tr', tr, elm, prnt, tbody, '<tr colspan="5" style="font-size:2em;">' + this.CategoryHeader + '</tr>', c]);
            }
            if (this.GroupHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.3em;">' + this.GroupHeader + '</td></tr>');
                tbody.append(tr);
                //$('<tr colspan="5" style="font-size:1.5em;">' + this.GroupHeader + '</tr>').insertBefore('.' + id);
            }
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#investigation_grid_container'),
                columns: [
                    { field: 'Name', filter: false, sorting: false },
                    { field: 'Unit', filter: false, sorting: false },
                    { field: 'Result', filter: false, sorting: false, AutoBind: false, bound: onResultBound, width: 200 },
                    { field: 'Refference', filter: false, sorting: false },
                    { field: 'Remarks', filter: false, sorting: false },
                ],
                dataSource: [],
                Printable: false,
                Responsive: false,
                selector: false,
                rowBound: onRowBound,
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Items ' },
                onComplete: function (model) {
                    invgridModel = model;
                },
            });
        };
        this.Get = function () {
            return invgridModel.dataSource;
        };
        this.GetResult = function () {
            var list = [];
            invgridModel.dataSource.each(function (i) {
                list.push({ Id: this.Id, Result: this.Result });
            });
            return list;
        };
        this.SetData = function (list) {
            dic = {};
            invgridModel.dataSource = setData(list);
            invgridModel.Reload();
        };
    }).call(service.Investigation = {});
};