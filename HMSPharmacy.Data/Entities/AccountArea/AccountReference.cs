using IqraBase.Data;
using IqraBase.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.AccountArea
{

    [Table("AccountReference")]
    [Alias("acntrfnc")]
    public class AccountReference : AppBaseEntity
    {
        public Guid AccountId { get; set; }
        /// <summary>
        /// Position in this Group
        /// </summary>
        public double Position { get; set; }
        /// <summary>
        /// Suplier Payment
        /// </summary>
        public string Reference { get; set; }
        public Guid ActivityId { get; set; }
    }
}
