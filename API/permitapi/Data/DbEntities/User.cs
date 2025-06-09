using System;
using System.Collections.Generic;

namespace Data.DbEntities
{
    public partial class User
    {
        public string? UserName { get; set; }
        public string? UserRole { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int Id { get; set; }
    }
}
