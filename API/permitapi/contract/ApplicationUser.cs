using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Data.DbEntities;
using Microsoft.EntityFrameworkCore;

namespace contract
{
    public class ApplicationUser
    {
        public string Email { get; set; }
        public int UserId { get; set; }
        public string Role { get; set; } // Azure AD user ID (optional)
    }
public interface ICurrentUserService
{
    ApplicationUser User { get; }
}

public class CurrentUserService : ICurrentUserService
{
    public ApplicationUser User { get; }

    public CurrentUserService(IHttpContextAccessor httpContextAccessor ,  PermitAccountDbContext context)
    {
        var user = httpContextAccessor.HttpContext?.User;

            if (user?.Identity?.IsAuthenticated ?? false)
            {
                User = new ApplicationUser
                {
                    Email = user?.FindFirst(System.Security.Claims.ClaimTypes.Upn)?.Value ?? "",

                };
                var DbUser = context.Users.AsNoTracking().Where(a => a.UserName == User.Email).FirstOrDefault();
                User.Role = DbUser?.UserRole;
                User.UserId = DbUser == null ? 0: DbUser.Id;
                
            }
    }
}

}