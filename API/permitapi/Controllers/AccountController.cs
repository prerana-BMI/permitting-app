using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contract;
using Data.DbEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace permitapi.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        public AccountController(permit_account_serviceContext context)
        {
            _context = context;
        }
        [Route("GetUsers")]
        public BaseReturn<List<EUsers>> GetALLUsers()
        {
            var BaseObj = new BaseReturn<List<EUsers>>();
            var result = _context.Users.Select(a => new EUsers
            {
                Id = a.Id,
                UserName = a.UserName,
                UserRole = a.UserRole,
                IsActive = a.IsActive,
                CreatedBy = a.CreatedBy,
                CreatedOn = a.CreatedOn
            }).ToList();
            BaseObj.Data = result;
            BaseObj.Count = result.Count;
            BaseObj.Success = true;
            return BaseObj;
        }

    }
}