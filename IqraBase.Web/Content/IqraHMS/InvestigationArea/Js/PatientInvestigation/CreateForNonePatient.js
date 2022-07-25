
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = {}, invgridModel,doctorModel;
    var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function printInvoice(id) {
        Global.Add({
            type: 'New',
            PatientInvestigationId: id,
            name: 'InvoicePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoice.js',
        });
    };
    function getPatient() {
        var model = {
            Gender: formModel.Gender,
            Mobile: formModel.Mobile,
            DateOfBirth: formModel.DateOfBirth + ' 00:00',
            Name: formModel.Name,
            CAddress: formModel.CAddress
        };
        return model;
    };
    function getModel() {
        var model = {},
        invlist = service.Investigation.GetInvData();
        model.InvItems = invlist;
        model.DoctorId = formModel.DoctorId;
        model.ReferenceId = formModel.ReferenceId;
        model.DiscountRemarks = formModel.DiscountRemarks;
        model.DiscountType = formModel.DiscountType || 1;
        model.Type = formModel.Type;
        model.DrCommission = formModel.DrCommission;
        model.ReCommission = formModel.ReCommission;
        model.TotalAmount = formModel.TotalAmount;
        model.DiscountTaka = formModel.DiscountT;
        model.DiscountPercentage = formModel.DiscountP;
        model.DiscountedAmount = formModel.DiscountedAmount;
        model.PaidAmount = formModel.PaidAmount;
        model.DueAmount = formModel.DueAmount;
        model.Patient = getPatient();
        model.AccountId = formModel.AccountId;
        model.Remarks = formModel.Remarks;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel();
            console.log(['save', model]);
            Global.CallServer('/InvestigationArea/PatientInvestigation/CreateInvestigationWithNonePatient', function (response) {
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
            }, model, 'POST');
            console.log(['after save', model]);
        } else {
            alert('Validation Error.');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function onDatePickerChanged(date) {
        if (date) {
            var currentDate = new Date();
            var value = currentDate.getDate() - date.getDate(), flg = 0;
            if (value < 0) {
                formModel.Day = (value + maxDays[date.getMonth()]);
                flg = -1;
            } else {
                formModel.Day = value;
            }
            value = currentDate.getMonth() - date.getMonth() + flg; flg = 0;
            if (value < 0) {
                formModel.Month = (value + 12);
                flg = -1;
            } else {
                formModel.Month = value;
            }
            formModel.Year = currentDate.getFullYear() - date.getFullYear() + flg;
        } else {
            formModel.Year = 0;
            formModel.Month = 0;
            formModel.Day = 0;
        }
    };
    function onAgeChanged() {
        var date = new Date();
        date.setDate(date.getDate() - parseInt(formModel.Day || '0') || 0);
        date.setMonth(date.getMonth() - parseInt(formModel.Month || '0') || 0);
        date.setFullYear(date.getFullYear() - parseInt(formModel.Year || '0') || 0);
        formModel.DateOfBirth = date.format('dd/MM/yyyy');
    };
    function populate(isFirstTime) {
        if (callerOptions.model) {
            Global.Copy(formModel, callerOptions.model, true);
        } else {
            for (var key in formModel) formModel[key] = '';
        }
        service.DropDown.Reset(isFirstTime);
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
            service.Investigation.Empty();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InvestigationArea/Templates/CreateForNonePatient.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                service.Investigation.Bind();
                populate(true);
                windowModel.Show();
                service.Payment.Bind();
                service.DropDown.Bind();
                (['Day', 'Month', 'Year']).each(function () {
                    $(inputs[this + '']).keyup(onAgeChanged).blur(onAgeChanged);
                });
                Global.DatePicker.Bind($(inputs['DateOfBirth']), { format: 'dd/MM/yyyy', onchange: onDatePickerChanged });
            }, noop);
        }
    };
    (function () {
        var doctor = {
            url: '/DoctorsArea/Doctor/AutoComplete',
        },
            discountType = {
                dataSource: [
                    { text: 'Doctor', value: 'Doctor' },
                    { text: 'Referrer', value: 'Referrer' },
                    { text: 'Hospital', value: 'Hospital' },
                    { text: 'All', value: 'All' }
                ],
                selectedValue: 'Not Define'
            }, reference = {
                url: '/ReferralArea/Reference/AutoComplete',
            }, account = {
                url: '/CommonArea/AccountReference/AutoComplete?reference=PatientInvestigation',
            };
        this.Bind = function () {
            doctor.elm = $(inputs['DoctorId']);
            discountType.elm = $(inputs['DiscountType']);
            reference.elm = $(inputs['ReferenceId']);
            account.elm = $(inputs['AccountId']);

            Global.AutoComplete.Bind(doctor);
            Global.DropDown.Bind(discountType);
            Global.AutoComplete.Bind(reference);
            Global.AutoComplete.Bind(account);
        };
        this.Reset = function (isFirstTime) {
            formModel.DoctorId = '';
            if (isFirstTime)
                return;
        };
    }).call(service.DropDown = {});
    (function () {
        var invsearchGridModel, filters = [],
            nameFilterModel = { "field": "Name", "value": "", Operation: 6 };
        function onDelete(model) {
            var list = [];
            //gridModel.datasource.each(function () {
            //    if (this.Id != model.Id) {
            //        list.push(this);
            //    }
            //});
            invgridModel.datasource = invgridModel.dataSource = invgridModel.dataSource.where('itm=>itm.Id != "' + model.Id + '"');
            invgridModel.Reload();
            calculateAmount();
        };
        function setInvCommission(sName, name, inv, model) {
            var key = name + 'CommissionType', tKey = sName + 'CommissionType';
            inv[sName + 'Commission'] = 0;
            inv[tKey] = model[key];
            //     public double DrCommission { get; set; }
            //public double ReCommission { get; set; }
            //public string DrCommissionType { get; set; }
            //public string ReCommissionType { get; set; }
            //console.log(['setCommission', inv[sName + 'Commission']]);
            //Fixed|Percentage(%)
            if (model[key] == 'Fixed') {
                inv[sName + 'Commission'] = model[name + 'Commission'] || 0;
            } else if (model[key] == 'Percentage(%)') {
                inv[sName + 'Commission'] = model.Cost.mlt(model[name + 'Commission'] || 0).div(100);
            } else if (model[key] == 'Default Commission') {
                inv[sName + 'Commission'] = 0;
                inv[tKey] = model['Ctg' + sName + 'CommissionType'];
                if (model['Ctg' + sName + 'CommissionType'] == 'Percentage(%)') {
                    inv[sName + 'Commission'] = model.Cost.mlt(model['Ctg' + sName + 'Commission'] || 0).div(100);
                } else if (model['Ctg' + sName + 'CommissionType'] == 'Fixed') {
                    inv[sName + 'Commission'] = model['Ctg' + sName + 'Commission'] || 0;
                }
            }
            //console.log(['setCommission', inv[sName + 'Commission']]);
        };
        function calculateAmount() {
            var amount = 0;
            invgridModel.dataSource.each(function () {
                amount += this.Cost;
            });

            formModel.TotalAmount = amount;
            service.Payment.OnChange.DiscountP();
        };
        function calculateDiscountedAmount() {

        }
        function onDiscountBound(td) {
            var model = this, elm = $('<input class="form-control" type="text" style="width: calc(100% - 10px); margin: 2px 0px;" placeholder="Discount(TK)" autocomplete="off">');
            td.html(elm);
            //model, elm, key, digit, is2Way
            Global.AutoBindM(model, elm, 'Discount', 2, true);
            model.Discount = 0;
            elm.keyup(function () {
                var discount = model.MaxDiscount;
                //if (formModel.DiscountType == 1) {
                //    discount = model.DrDiscount;
                //} else if (formModel.DiscountType == 2) {
                //    discount = model.ReDiscount;
                //}
                if (model.Discount > discount) {
                    alert('Discount(' + model.Discount + ') can not be greater than MaxDiscount(' + discount + ').');
                    this.value = discount;
                }

                console.log(['model', model]);
            });
        }
        function setInvGridModel() {
            Global.List.Bind({
                Name: 'Investigation',
                Grid: {
                    elm: windowModel.View.find('#investigation_grid_container'),
                    columns: [
                        { field: 'CategoryName', title: 'Category Name', filter: false, sorting: false },
                        { field: 'Name', title: 'Investigation Name', filter: false, sorting: false },
                        { field: 'Cost', title: 'Amount', filter: false, sorting: false },
                        { field: 'Discount', title: 'Discount', filter: false, autoBind: false, bound: onDiscountBound, sorting: false },
                    ],
                    Actions: [{
                        click: onDelete,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Delete"><span class="glyphicon glyphicon-trash"></span></a>'
                    }],
                    dataSource: [],
                    Printable: false,
                    Responsive: false,
                    selector: false,
                    page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Investigations ' },
                },
                onComplete: function (model) {
                    invgridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            });
        };
        function getInvModel(model) {
            var inv = Global.Copy({}, model, true);
            inv.CategoryName = model.InvestigationCategory;
            inv.MaxDiscountP = inv.MaxDiscount.div(inv.Cost).mlt(100);
            return inv;
        };
        function setInvSearchGridModel() {
            filters = [nameFilterModel];
            Global.Grid.Bind({
                elm: windowModel.View.find('#inv_search_grid_container'),
                columns: [
                    { field: 'Name', title: 'Investigation Name', filter: true },
                    { field: 'Cost', title: 'Cost', filter: true },
                    { field: 'MaxDiscount', title: 'Max Discount', filter: true },
                ],
                Printable: false,
                Responsive: false,
                selector: false,
                //dataSource: [],
                url: '/InvestigationArea/Investigation/Get',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Investigations ', filter: filters },
                rowBound: function (elm) {
                    Global.Click(elm, function (model) {
                        if (invgridModel.dataSource.where('itm=>itm.Id=="' + model.Id + '"').length < 1) {
                            invgridModel.dataSource.push(getInvModel(model));
                            invgridModel.Reload();
                            calculateAmount();
                            windowModel.View.find('#inv_search_grid_container').hide();
                            $(inputs['InvestigationId']).blur();
                        } else {
                            alert('This Item is already Added.');
                        }
                    }, this);
                },
                onRequest: function (page) {
                    //if (!nameFilterModel.value)
                    page.filter = page.filter.where('itm=>itm.field != "Name"');
                    nameFilterModel.value && page.filter.push(nameFilterModel);
                },
                onComplete: function (model) {
                    model.dataSource = none;
                    invsearchGridModel = model;
                    windowModel.View.find('#inv_search_grid_container').hide();
                }
            });
        };
        function setCommission(model, position) {
            var cost = m2f(model.Cost);
            var inv = {
                InvestigationId: model.Id,
                Cost: cost,
                CommissionType: model.Type,
                Position: position,
                Quantity: 1,
                Discount: model.Discount,
                NetAmount: cost - model.Discount
            };

            setInvCommission('Dr', 'Doctor', inv, model);
            setInvCommission('Re', 'Referrer', inv, model);

            if (inv.Discount > 0 && inv.Cost > 0) {
                if (formModel.DiscountType === 'All') {
                    var discount = (inv.Discount / inv.Cost);
                    inv.DrCommission = inv.DrCommission - inv.DrCommission.mlt(discount);
                    inv.ReCommission = inv.ReCommission - inv.ReCommission.mlt(discount);
                } else if (formModel.DiscountType === 'Referrer') {
                    inv.ReCommission = inv.ReCommission - inv.Discount;
                    inv.ReCommission = inv.ReCommission < 0 ? 0 : inv.ReCommission;
                } else if (formModel.DiscountType === 'Doctor') {
                    inv.DrCommission = inv.DrCommission - inv.Discount;
                    inv.DrCommission = inv.DrCommission < 0 ? 0 : inv.DrCommission;
                }
            }
            return inv;
        };
        this.Bind = function () {
            setInvGridModel();
            setInvSearchGridModel();
            $(inputs['InvestigationId']).focus(function () {
                windowModel.View.find('#inv_search_grid_container').show();
            }).keyup(function () {
                if (formModel.InvestigationId != nameFilterModel.value) {
                    nameFilterModel.value = formModel.InvestigationId;
                    //invsearchGridModel.dataSource = invsearchGridModel.datasource = none;
                    invsearchGridModel.Reload();
                }
            }).blur(function () {
                //windowModel.View.find('#inv_search_grid_container').hide();
            }).closest('.input-group').mousedown(function (e) {
                e.stopPropagation();
            });
            windowModel.View.find('#inv_search_grid_container').mousedown(function (e) {
                e.stopPropagation();
            });
            $(document).mousedown(function () {
                windowModel.View.find('#inv_search_grid_container').hide();
            });
        };
        this.Get = function () {
            return invgridModel.dataSource;
        };
        this.GetInvData = function () {
            var invlist = [];
            invgridModel.dataSource.each(function (i) {
                invlist.push(setCommission(this, i))
            });
            return invlist;
        };
        this.Empty = function () {
            invgridModel.dataSource = invgridModel.datasource = [];
            invgridModel.Reload();
        };
    }).call(service.Investigation = {});
    (function () {
        var onChange = this.OnChange = {
            DiscountP: function () {
                var total = parseFloat(formModel.TotalAmount || '0') || 0,
                    discountP = parseFloat(formModel.DiscountP || '0') || 0,
                    dueAmount = parseFloat(formModel.DueAmount || '0') || 0,
                    paidAmount = parseFloat(formModel.PaidAmount || '0') || 0;
                //discount = Math.ceil(total.mlt(discountP).div(100));
                var discount = 0, dst = 0;
                invgridModel.dataSource.each(function (i) {
                    dst = this.Cost.mlt(discountP).div(100);
                    if (dst > this.MaxDiscount) {
                        dst = this.MaxDiscount;
                    }
                    this.Discount = dst;
                    discount += dst;
                });
                formModel.DiscountT = discount;
                formModel.DiscountedAmount = total - discount;
                var discountedAmount = parseFloat(formModel.DiscountedAmount || '0') || 0;
                //var paidAmount = Math.min(paidAmount, discountedAmount);
                var paidAmount = formModel.DiscountedAmount;
                formModel.DueAmount = discountedAmount - paidAmount;
                formModel.PaidAmount = paidAmount;
                if (discountP > 100) {
                    alert("Discounted percent can not be gretter than 100%");
                    //formModel.DiscountP = 100;
                    //formModel.DiscountT = total;
                    //formModel.DiscountedAmount = 0;
                    //formModel.DueAmount = 0;
                    //formModel.PaidAmount = 0;
                }
            },
            DiscountT: function () {
                var total = parseFloat(formModel.TotalAmount || '0') || 0,
                    discountT = Math.ceil(parseFloat(formModel.DiscountT || '0') || 0),
                    dueAmount = parseFloat(formModel.DueAmount || '0') || 0,
                    paidAmount = parseFloat(formModel.PaidAmount || '0') || 0,
                    discount = Math.ceil(discountT.mlt(100).div(total));
                var totalAmount = total, discountP = discountT * 100 / total, totalDiscount = discountT;
                invgridModel.dataSource.orderBy('MaxDiscountP', true).each(function (i) {
                    totalAmount -= this.Cost;
                    if (discountP > this.MaxDiscountP) {
                        totalDiscount -= this.MaxDiscount
                        this.Discount = this.MaxDiscount;
                        discountP = totalDiscount * 100 / totalAmount;
                    } else {
                        this.Discount = this.Cost.mlt(discountP).div(100);
                        totalDiscount -= this.Discount;
                    }
                });
                if (totalDiscount > 1) {
                    alert('Discount(' + discountT + ') is greater than the max discount(' + Math.floor(discountT - totalDiscount) + ').');
                    formModel.DiscountT = discountT = Math.floor(discountT - totalDiscount);
                    discount = Math.ceil(discountT.mlt(100).div(total));
                }

                formModel.DiscountP = discount;
                formModel.DiscountedAmount = total - discountT;
                var discountedAmount = parseFloat(formModel.DiscountedAmount || '0') || 0;
                var paidAmount = Math.min(paidAmount, discountedAmount);
                formModel.DueAmount = discountedAmount - paidAmount;
                formModel.PaidAmount = paidAmount;
                if (discountT > total) {
                    alert("Discounted Taka can not be gretter than TotalAmount");
                    var discountT = total;
                    var discountP = Math.ceil(discountT.mlt(100).div(total));
                    formModel.DiscountT = discountT;
                    formModel.DiscountP = discountP;
                    formModel.DiscountedAmount = 0;
                    formModel.DueAmount = 0;
                    formModel.PaidAmount = 0;
                };

            },
            PaidAmount: function () {
                var paidAmount = parseFloat(formModel.PaidAmount || '0') || 0,
                    discountedAmount = parseFloat(formModel.DiscountedAmount || '0') || 0;
                formModel.DueAmount = discountedAmount - paidAmount;
                if (paidAmount > discountedAmount) {
                    alert("Paid Amount can not be gretter than Net Amount");
                    formModel.PaidAmount = discountedAmount;
                    formModel.DueAmount = 0;
                }
            },
            DueAmount: function () {
                var dueAmount = parseFloat(formModel.DueAmount || '0') || 0,
                    discountedAmount = parseFloat(formModel.DiscountedAmount || '0') || 0;
                formModel.PaidAmount = discountedAmount - dueAmount;
                if (dueAmount > discountedAmount) {
                    alert("Paid Amount can not be gretter than Net Amount");
                    formModel.PaidAmount = discountedAmount;
                    formModel.DueAmount = 0;
                }

            }
        };
        this.Bind = function () {
            ['DiscountP', 'DiscountT', 'PaidAmount', 'DueAmount'].each(function () {
                $(inputs[this]).keyup(onChange[this]);
            });
        }
    }).call(service.Payment = {});
};