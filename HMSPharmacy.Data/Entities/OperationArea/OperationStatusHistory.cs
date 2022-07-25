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

    [Table("OperationStatusHistory")]
    [Alias("prtnsttshstry")]
    public class OperationStatusHistory : AppBaseEntity
    {
        public Guid OperationId { get; set; }
        public string PrevStatus { get; set; }
        public string CurrentStatus { get; set; }
        public Guid ChangedBy { get; set; }
        public DateTime ChangedAt { get; set; }
    }
}
