using IqraBase.Data;
using IqraBase.Data.Models;
using IqraHMS.Data.Entities.DoctorsArea;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Entities.OTServiceArea;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static App.SetUp.DefinedString;

namespace IqraHMS.OT.Data.Models.OperationArea
{

    public class OperationHistoryModel : AppBaseModel
    {

        public string ActionType { get; set; }
        public string Description { get; set; }
        public string AfterMath { get; set; }
        public Guid OperationId { get; set; }

        public OperationHistoryModel()
        {

        }
        public OperationHistoryModel(Guid operationId)
        {
            OperationId = operationId;
        }

        public OperationHistoryModel(Guid operationId, string remarks = "")
        {
            OperationId = operationId;
            Remarks = remarks;
        }

        public OperationHistoryModel StatusChangeHistory(string prevStatus, string nextStatus)
        {
            ActionType = OPERATION_HISTORY_TYPES.STATUS_CHANGED;
            Description = $"Operation history changed from {prevStatus} to {nextStatus}";
            AfterMath = $"Current status is {nextStatus}";

            return this;
        }

        public OperationHistoryModel AddServiceHistory(OperationOTServiceModel service, double prevCost, double currCost)
        {
            ActionType = OPERATION_HISTORY_TYPES.SERVICE_CONSUMED;
            Description = $"{service.Name}({service.Name}) added for {service.Payable}TK X {service.Quantity} = {service.Payable*service.Quantity}Tk to the operation";
            AfterMath = $"Operation Cost updated from {prevCost} to {currCost}";

            return this;
        }

        public OperationHistoryModel RemoveServiceHistory(OperationOTService service, double prevCost, double currCost)
        {
            ActionType = OPERATION_HISTORY_TYPES.SERVICE_REMOVED;
            Description = $"Service: {service.Name}, Price: {service.Payable}, Quantity: {service.Quantity}, Total: {service.Payable * service.Quantity}";
            AfterMath = $"Operation Cost decreased from {prevCost} to {currCost}";

            return this;
        }

        public OperationHistoryModel AssignSurgonHistory(OperationSurgonModel surgon, double prevCost, double currCost)
        {
            ActionType = OPERATION_HISTORY_TYPES.SURGON_ASSIGNED;
            Description = $"Surgon: {surgon.Name}({surgon.Code}), Design.: {surgon.Designation}, Phone: {surgon.Phone}, Charge: {surgon.Payable}, ";
            AfterMath = $"Operation Cost increased from {prevCost}Tk to {currCost}Tk";

            return this;
        }

        public OperationHistoryModel RemoveSurgonHistory(OperationSurgonModel surgon, double prevCost, double currCost)
        {
            ActionType = OPERATION_HISTORY_TYPES.SERVICE_REMOVED;
            Description = $"Surgon: {surgon.Name}({surgon.Code}), Design.: {surgon.Designation}, Phone: {surgon.Phone}, Charge: {surgon.Payable}, ";
            AfterMath = $"Operation Cost Decreased from {prevCost}Tk to {currCost}Tk";

            return this;
        }
    }
}
