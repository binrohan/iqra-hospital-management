using IqraBase.Data;
using IqraBase.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.OperationArea
{
    [Table("OperationOTService")]
    [Alias("prtnotsrvc")]
    public class OperationOTService : AppBaseEntity
    {
        public double Payable { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public double Quantity { get; set; }
        public Guid OperationId { get; set; }
        public Guid RefOTServiceId { get; set; }
    }
}
