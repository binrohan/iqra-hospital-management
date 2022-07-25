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
    [Table("OperationPackage")]
    [Alias("prtnpckg")]
    public class OperationPackage : AppBaseEntity
    {
        public Guid SurgonId { get; set; }
        public Guid SurgeryId { get; set; }
        public double Price { get; set; }
        public double MinPrice { get; set; }
        public double OriginalCost { get; set; }
        public string Code { get; set; }
    }
}
