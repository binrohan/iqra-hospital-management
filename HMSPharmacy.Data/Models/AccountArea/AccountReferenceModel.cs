using IqraBase.Data;
using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.AccountArea
{
    [Table("AccountReference")]
    [Alias("acntrfnc")]
    public class AccountReferenceModel : AppBaseModel
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
    }
}
