using IqraBase.Data;
using IqraBase.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.SurgeryArea
{
    [Table("OperationPackageOTService")]
    [Alias("prtnpckgotsrvc")]
    public class OperationPackageOTService : AppBaseEntity
    {
        public Guid OperationPackageId { get; set; }
        public Guid ServiceId { get; set; }
        public double Quantity { get; set; }
    }
}
