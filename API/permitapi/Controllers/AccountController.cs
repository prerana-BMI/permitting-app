using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contract;
using Data.DbEntities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace permitapi.Controllers
{
    [Route("api/[controller]")]

    // [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        public AccountController(permit_account_serviceContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetUsers")]
        public BaseReturn<List<EUsers>> GetALLUsers()
        {
            var BaseObj = new BaseReturn<List<EUsers>>();
            List<EUsers> Result = new List<EUsers>();
            try
            {

                Result = _context.Users.Select(a => new EUsers
                {
                    Id = a.Id,
                    UserName = a.UserName,
                    UserRole = a.UserRole,
                    IsActive = a.IsActive,
                    CreatedBy = a.CreatedBy,
                    CreatedOn = a.CreatedOn
                }).ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("IsUserExist")]
        public BaseReturn<bool> IsUserExisit(string UserName)
        {
            var BaseObj = new BaseReturn<bool>();

            try
            {

                var Result = _context.Users.Where(a => a.UserName == UserName && a.IsActive == true).AsNoTracking().FirstOrDefault();
                BaseObj.Data = Result != null ? true : false;
                BaseObj.Success = true;


            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }
    }
}