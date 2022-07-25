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
    [Table("OperationSurgon")]
    [Alias("prtnsrgn")]
    public class OperationSurgon : AppBaseEntity
    {
        public Guid OperationId { get; set; }
        public Guid SurgonId { get; set; }
        public double Payable { get; set; }
        public string Phone { get; set; }
        public string Designation { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
