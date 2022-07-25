import { editBtn, folderBtn } from "../../../../Js/modules/buttons.js";
import { operationColums} from "../../../../Js/modules/columns.js";
import { dropDown } from "../../../../Js/modules/dropdown.js";
import { deletedRecord, nonDeletedRecord } from "../../../../Js/modules/filter.js";
import { tabBuilder } from "../../../../Js/modules/utils.js";

(function () {
    const controller = 'OperationArea/Operation';
    const title = 'Operation';

    // Declarations
    function suergeryChangeHandler(option, el) {
        console.log({ option, el, this: this });
    }

    function openOperation(operation) {
        Global.Add({
            OperartionId: operation.Id,
            name: 'order-details',
            url: '/Content/HMSPharmacy/OperationArea/Content/Js/operation.js',
        });
    }
    // Declarations end

    $(document).ready(() => {
        $('#add-record').click(create);
    });

    function create(model) {
        popup({ label: `Create ${title}` });
    };

    function edit(model) {
        popup({ data: model, label: `Edit ${title}` });
    };

    function popup({ data, label }) {
        Global.Add({
            name: label,
            model: data,
            title: label,
            columns: operationColums,
            dropdownList: [
                dropDown('Refered By', 'ReferencePersonId', `/SurgeryArea/Surgery/AutoComplete`, 4, 3),
            ],
            additionalField: [
                { field: 'SurgeryCharge', title: 'Surgery Charge', filter: true, add: { sibling: 3 }, position: 5 },
                { field: 'SurgeryDiscount', title: 'Surgery Discount', filter: true, add: { sibling: 3 }, position: 6 },
                { field: 'DoctorCharge', title: 'Doctor Charge', filter: true, add: { sibling: 3 }, position: 8 },
                { field: 'DoctorDiscount', title: 'Doctor Discount', filter: true, add: { sibling: 3 }, position: 9 },
                { field: 'TotalCharge', title: 'Total Charge', filter: true, position: 11 },
                { field: 'InitialPayment', title: 'Initial Payment', filter: true, position: 12 },
                { field: 'SurgeryChargeForPatien', title: 'Surgery Charge For Patien', add: { dataType: 'float', sibling: 3 }, type: 2, filter: true, position: 7 },
                { field: 'DoctorChargeForPatien', title: 'Doctor Charge For Patien', add: { dataType: 'float', sibling: 3 }, type: 2, filter: true, position: 10 },
            ],
            onSubmit: function (formModel, data, model) {
                formModel.Id = model.Id;
                formModel.Name = "Name";
            },
            onSaveSuccess: function () {
                tabs.gridModel?.Reload();
            },
            save: `/${controller}/Create`,
            saveChange: `/${controller}/Edit`,
        });
    };

    const editAction = {
        click: edit,
        html: editBtn()
    };
    const operationAction = {
        click: openOperation,
        html: folderBtn()
    };

    const allServiceTabConfig = {
        title: 'Active_Surgery',
        actions: [operationAction, editAction],
        filters: [nonDeletedRecord],
        columns: operationColums,
        remove: { save: `/${controller}/Delete` }
    };

    const deletedServiceTabConfig = {
        title: 'Deleted_Surgery',
        actions: [],
        filters: [deletedRecord],
        columns: operationColums,
    };

    const tabs = {
        container: $('#page_container'),
        Base: { Url: `/${controller}/` },
        items: tabBuilder(allServiceTabConfig,
            deletedServiceTabConfig),
        periodic: false
    };

    Global.Tabs(tabs);
    tabs.items[0].set(tabs.items[0]);
})();