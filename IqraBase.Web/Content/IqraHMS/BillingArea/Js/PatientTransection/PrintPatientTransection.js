
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, summaryModel;
    function getTime(str) {
        return Global.DateTime.GetObject(str, 'dd/MM/yyyy hh:mm').getTime();
    };
    function getModel() {
        var model = {
            PatientId: callerOptions.model.Id,
            PatientName: callerOptions.model.Name,
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel(),
                saveUrl = '/TransectionArea/PatientTransection/GetTransection';
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                   
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function up(elm, func, option, inputs) {
        elm = $(elm);
        elm.keyup(function () {
            func.call(this, option, inputs);
        }).focus(function () {
            //$(this).select();
        });
        return elm;
    };
    function setSummary() {
        for (var key in summaryModel) {
            formModel[key] = summaryModel[key].toMoney();
        }
    };
    function onChange(option, inputs,diff) {
        //summaryModel = { Total: 0, Discount: 0, NetAmount: 0, Paid: 0, NetPayable: 0 };
        if (diff !== 0) {
            summaryModel.Total += diff;
            summaryModel.NetAmount += diff;
            summaryModel.NetPayable += diff;

            setSummary();
        }
    };
    function onUnitChange(option, inputs) {
        option.Unit = parseFloat(option.FormModel.Unit || '0') || 0;
        var total = option.Unit.mlt(option.Rate), diff = total - option.Total;
        option.FormModel.Total = option.Total = total;
        onChange(option, inputs, diff);
    };
    function onRateChange(option, inputs) {
        option.Rate = parseFloat(option.FormModel.Rate || '0') || 0;
        var total = option.Unit.mlt(option.Rate), diff = total - option.Total;
        option.FormModel.Total = option.Total = total;
        onChange(option, inputs, diff);
    };
    function onTotalChange(option, inputs) {
        total = parseFloat(option.FormModel.Total || '0') || 0;
        var diff = total - option.Total;
        option.FormModel.Unit = option.Unit = parseFloat(option.FormModel.Unit || '1') || 1;
        option.Total = total;
        option.FormModel.Rate = option.Rate = total.div(option.Unit);
        onChange(option, inputs, diff);
    };
    function getTd(name) {
        return '<td class ="item-name"><div><input data-binding="' + name + '" class="form-control" type="text" data-type="float|null" style="width: calc(100% - 12px);" autocomplete="off"></div></td>';
    };

    function createItem(container, item) {
        var tr = $(`<tr class="item-row">
                            <td class ="item-name"><div> `+ item.TransectionType + ` </div></td>
                            `+ getTd("Unit") + `
                            `+ getTd("Rate") + `
                            `+ getTd("Total") + `
                        </tr>`);
        container.append(tr);
        var inputs = Global.Form.Bind(item.FormModel = {}, tr);
        item.FormModel.Unit = item.Unit = 1;
        item.FormModel.Rate = item.Rate = item.BillAmount;
        item.FormModel.Total = item.Total = item.BillAmount;
        up(inputs['Unit'], onUnitChange, item, inputs);
        up(inputs['Rate'], onRateChange, item, inputs);
        up(inputs['Total'], onTotalChange, item, inputs);
    };
    function getList(list1, list2) {
        var dic = {}, list = [].concat(list1);
        list1.each(function () {
            dic[this.RelatedId] = this;
        });
        list2.each(function () {
            if (!dic[this.Id]) {
                console.log(['dic[this.Id]', dic, this.Id, dic[this.Id],list1, list2]);
                list.push({
                    "TransectionType": this.Name,
                    "RelatedId": this.Id,
                    "ServiceType": "Service",
                    "BillAmount": 0,
                    "PaidAmount": 0,
                    "Balance": 0,
                    "Discount": 0
                });
            }
        });
        return list;
    };
    function populate(model) {
        var patientModel = model[0][0],
            itemContainer = windowModel.View.find('#items tbody').empty();

        for (var key in formModel) {
            if (typeof patientModel[key] != 'undefined') {
                formModel[key] = patientModel[key];
            }
        }

        

        summaryModel = { Total: 0, Discount: 0, NetAmount: 0, Paid: 0, NetPayable: 0 };
        getList(model[1], model[3]).each(function () {
            createItem(itemContainer, this);
            summaryModel.Total += this.BillAmount;
            summaryModel.Discount += this.Discount;
            summaryModel.Paid += this.PaidAmount;
        });
        summaryModel.NetAmount = summaryModel.Total - summaryModel.Discount;
        summaryModel.NetPayable = summaryModel.NetAmount - summaryModel.Paid;
        setSummary();

        currentDate = model[2][0].CurrentDate.getDate();
        patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
        patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
        patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
        formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
    };
    function load() {
        windowModel.Wait('Please wait while loading data');
        Global.CallServer('/TransectionArea/PatientTransection/GetTransection?Id=' + callerOptions.PatientId, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                populate(response.Data);
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            Global.Error.Show(response, {});
        }, null, 'Get');
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            load();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/PrintPatientTransection.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
               
                //load();
                load();
                windowModel.Show();
            }, noop);
        }
    };
};