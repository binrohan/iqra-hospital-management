
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = {};
    function getModel() {
        var model = {
            Name: formModel.Name,
            Gender: formModel.Gender,
            BloodGroup: formModel.BloodGroup,
            DateOfBirth: formModel.DateOfBirth,
            Mobile: formModel.Mobile,
            AlternativeMobile: formModel.AlternativeMobile,
            Email: formModel.Email,
            Weight: formModel.Weight,
            Height: formModel.Height,
            ProfessionId: formModel.ProfessionId,
            MaritalStatus: formModel.MaritalStatus,
            Nationality: formModel.Nationality,
            PlaceOfIssue: formModel.PlaceOfIssue,
            TravelingTo: formModel.TravelingTo,
            VisaNo: formModel.VisaNo,
            VisaDate: formModel.VisaDate,
            Allergy: formModel.Allergy,
            Disorders: formModel.Disorders,
            OtherFindings: formModel.OtherFindings,
            PassportNo: formModel.PassportNo,
            CAddress: formModel.CAddress,
            PAddress: formModel.PAddress,
            Img: formModel.Image,

            ///Total Bill
            TotalAmount: formModel.TotalAmount,
            Vat: 0,
            DiscountTk: formModel.DiscountTk,
            NetAmount: formModel.NetAmount,
            PaidAmount: formModel.PaidAmount,
            DueAmount: formModel.DueAmount,

            ActivityId: window.ActivityId
        };

        try {
            var discount = getNum(formModel.DiscountTk);
            var amount = getNum(formModel.TotalAmount);
            if (amount > 0) {
                model.DiscountP = 100 * discount / amount;
            }

        } catch {

        }
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait('Please Wait while saving data......');
            Global.Uploader.upload({
                data: model,
                url: '/CandidateReportArea/CandidateReport/CreateForNonPatient',
                onProgress: function (data) {

                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        alert('CandidateReport Successfull.')
                        close();
                    }
                },
                onError: function () {
                    windowModel.Free();
                }
            });
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function getNum(txt) {
        try {
            return parseFloat(txt || '0') || 0;
        } catch {
        }
        return 0;
    };
    function onAddPicture() {
        Global.Add({
            name: 'AddPicture',
            url: '/Content/IqraHMS/CandidateReportArea/Js/CandidateReport/WebCamPicture.js',
            OnSave: (img, blob) => {
                formModel.Image = { IsFile: true, File: blob };
                windowModel.View.find('#img_preview_container').html('<img style="max-height:100px;" src="' + img + '">');
            }
        });
    };
    function populate() {
        formModel.TotalAmount = 5000;
        formModel.DiscountTk = 0;
        formModel.NetAmount = 5000;
        formModel.PaidAmount = 5000;
        formModel.DueAmount = 0;
    };
    function setDropdown() {
        var employee = {
            elm: $(inputs['EmployeeTypeId']),
            url: '/CommonArea/EmployeeType/AutoComplete',
            change: function (data) {
                console.log(data);
            }
        }, profession = {
            elm: $(inputs['ProfessionId']),
                url: '/CommonArea/Profession/AutoComplete'
            }, gender = {
                elm: $(inputs['Gender']),
                dataSource: [
                    { text: 'Male', value: 'Male' },
                    { text: 'Female', value: 'Female' },
                    { text: 'Other', value: 'Other' }
                ]
            };
        Global.AutoComplete.Bind(employee);
        Global.AutoComplete.Bind(profession);
        Global.DropDown.Bind(gender);
        Global.DatePicker.Bind($(inputs['VisaDate']), { format: 'dd/MM/yyyy' });
    };

    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/CandidateReportArea/Templates/AddCandidateReport.html', function (response) {
                windowModel = Global.Window.Bind(response, {width:'95%'});
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                $(inputs.btnPicture).click(onAddPicture);
                service.Age.Bind();
                service.Events.Bind();
                setDropdown();
                populate();
                windowModel.Show();
                formModel.btnPicture = 'Take a Picture';
            }, noop);
        }
    };
    (function () {
        function onKeyup(key, func) {
            $(inputs[key]).keyup(func);
        };

        function onDiscountTkChanged() {
            var discount = getNum(formModel.DiscountTk);
            var amount = getNum(formModel.TotalAmount);
            if (discount > amount) {
                formModel.DiscountTk = amount;
                alert('Discount can\'t greater than TotalAmount');
                discount = amount;
            }
            formModel.NetAmount = amount - discount;
            formModel.PaidAmount = formModel.NetAmount;
            formModel.DueAmount = 0;
        };
        function onNetAmountChanged() {
            var amount = getNum(formModel.TotalAmount);
            var discount = getNum(formModel.NetAmount);
            if (discount > amount) {
                formModel.NetAmount = amount;
                alert('Net Amount can\'t greater than Total Amount');
                discount = amount;
            }
            formModel.DiscountTk = amount - discount;
            formModel.PaidAmount = formModel.NetAmount;
            formModel.DueAmount = 0;
        };

        function onPaidAmountChanged() {
            var paid = getNum(formModel.PaidAmount);
            var net = getNum(formModel.NetAmount);
            if (paid > net) {
                formModel.PaidAmount = net;
                alert('Paid Amount can\'t greater than Net Amount');
                paid = net;
            }
            formModel.DueAmount = net - paid;
        };

        function onDueAmountChanged() {
            var due = getNum(formModel.DueAmount);
            var net = getNum(formModel.NetAmount);
            if (due > net) {
                formModel.DueAmount = net;
                alert('Due Amount can\'t greater than Net Amount');
                due = net;
            }
            formModel.PaidAmount = net - due;
        };
        this.Bind = function () {
            onKeyup('DiscountTk', onDiscountTkChanged);
            onKeyup('NetAmount', onNetAmountChanged);
            onKeyup('PaidAmount', onPaidAmountChanged);
            onKeyup('DueAmount', onDueAmountChanged);
        };
    }).call(service.Events = {});
    (function () {
        var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
        this.Bind = function () {
            (['Day', 'Month', 'Year']).each(function () {
                $(inputs[this + '']).keyup(onAgeChanged).blur(onAgeChanged);
            });
            Global.DatePicker.Bind($(inputs['DateOfBirth']), { format: 'dd/MM/yyyy', onchange: onDatePickerChanged });
        };
    }).call(service.Age = {});
};