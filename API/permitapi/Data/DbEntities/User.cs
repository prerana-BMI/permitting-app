using System;
using System.Collections.Generic;

namespace Data.DbEntities;

public partial class User
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string? UserRole { get; set; }

    public bool IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedOn { get; set; }
}
