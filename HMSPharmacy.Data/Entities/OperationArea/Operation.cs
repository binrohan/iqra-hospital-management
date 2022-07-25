using IqraBase.Data;
using IqraBase.Data.Entities;
using IqraHMS.OT.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.OperationArea
{
    [Table("Operation")]
    [Alias("prtn")]
    public class Operation : DropDownBaseEntity
    {
        public string Code { get; set; }
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
    }
}
