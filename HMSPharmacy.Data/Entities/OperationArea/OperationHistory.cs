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
    [Table("OperationHistory")]
    [Alias("prtnhstry")]
    public class OperationHistory : AppBaseEntity
    {
        public string ActionType { get; set; }
        public string Description { get; set; }
        public string AfterMath { get; set; }
        public Guid OperationId { get; set; }
    }
}
