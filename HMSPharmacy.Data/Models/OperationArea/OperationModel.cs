using IqraBase.Data.Models;
using System;

namespace IqraHMS.OT.Data.Models.OperationArea
{
    public class OperationModel : DropDownBaseModel
    {
        public Guid PatientId { get; set; }
        public Guid SurgeryId { get; set; }
        public Guid LeadDoctoryId { get; set; }
        public Guid ReferencePersonId { get; set; }

        public string Status { get; set; }

        public DateTime PreServiceStartedAt { get; set; }
        public DateTime OperationStartedAt { get; set; }
        public DateTime PostServiceStartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }

        public double PaidAmount { get; set; }

        public double SurgeryChargeForPatien { get; set; }
        public double SurgeryChargeDiscount { get; set; }
        public double SurgonChargeForPatien { get; set; }
        public double SurgonChargeDiscount { get; set; }
        public double TotalPayment { get; set; }
        public double InitialPayment { get; set; }
    }
}
