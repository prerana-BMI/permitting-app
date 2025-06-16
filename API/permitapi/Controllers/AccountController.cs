using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contract;
using contract.Entities;
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
        public BaseReturn<List<EUsers>> GetALLUsers(EPaginationReq Request)
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
                }).OrderByDescending(a=>a.Id).ToList();
                BaseObj.Count = Result.Count;
                if (Result.Count > 0 && Request.pageSize > 0)
                {
                    Result = Result.Skip((Request.pageIndex - 1) * Request.pageSize).Take(Request.pageSize).ToList();
                }
                BaseObj.Data = Result;
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

        [HttpGet]
        [Route("GetUserById")]
        public BaseReturn<EUsers> GetUserById(int Id)
        {
            var BaseObj = new BaseReturn<EUsers>();

            try
            {

                var Result = _context.Users.Where(c => c.Id == Id).Select(a => new EUsers
                {
                    UserName = a.UserName,
                    UserRole = a.UserRole,
                    CreatedOn = a.CreatedOn,
                    CreatedBy = a.CreatedBy,
                    IsActive = a.IsActive
                }).FirstOrDefault();
                BaseObj.Data = Result;
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
        [Route("SaveUser")]
        public BaseReturn<int> SaveUser(EUsers Request)
        {
            var BaseObj = new BaseReturn<int>();

            try
            {
                if (Request.Id > 0)
                {
                    var user = _context.Users.Where(a => a.Id == Request.Id).FirstOrDefault();
                    if (user != null)
                    {
                        user.UserRole = Request.UserRole;
                        user.IsActive = Request.IsActive;
                        _context.Users.Update(user);
                        BaseObj.Message = "User Data Updated";

                    }
                }
                else
                {
                    var UserObj = new User();
                    UserObj.UserName = Request.UserName;
                    UserObj.UserRole = Request.UserRole;
                    UserObj.IsActive = Request.IsActive;
                    _context.Users.Add(UserObj);
                    BaseObj.Message = "User Data Saved";

                }
                _context.SaveChanges();
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