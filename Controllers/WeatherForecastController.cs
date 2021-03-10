using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using shagDiplom.Models;
using Microsoft.AspNetCore.Cors;
using shagDiplom.Services;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Text;
using Newtonsoft.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using F23.StringSimilarity;


namespace shagDiplom.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private IUserService _userService; // класс который помогает извлекать отсортированые данные с бд
        private schoolManagementSystemDatabaseContext db = new schoolManagementSystemDatabaseContext();  // контекст бд
        private const string adminAccessCode = "Sapere aude";  // пароль администратора, который нужен для многих операций для профиля администратора, когда данные либо удаляют, либо изменяют с большим влянием на систему 

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }


        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthenticateModel model) //аутентификация в систему и вход, всего есть 4 таблицы с данными пользователей "Администратор", "Родитель", "Ученик", "Учитель"
        {
            var userPupil = _userService.AuthenticatePupil(model.Username, model.Password, db);  //аутентификация в систему для учеников
            var userTeacher = _userService.AuthenticateTeacher(model.Username, model.Password, db);  //аутентификация в систему для учителей
            var userParent = _userService.AuthenticateParent(model.Username, model.Password, db);  //аутентификация в систему для родителей
            var userAdmin = _userService.AuthenticateAdmin(model.Username, model.Password, db);   //аутентификация в систему для администраторов
            // Когда находим подходящую почту и пароль, возвращаем данные на клиент без пароля, которые потом сохраняться localeStorage с указыванием роли и аутеризованым пользователем
            if (userPupil != null)
                return Ok(userPupil);
            else if (userTeacher != null)
                return Ok(userTeacher);
            else if (userParent != null)
                return Ok(userParent);
            else if (userAdmin != null)
                return Ok(userAdmin);
            else
                return BadRequest(new { message = "Ви ввели неправильну пошту чи пароль!" });
        }

        [AllowAnonymous]
        [HttpPost("registerPupil")]
        public IActionResult RegisterPupil([FromForm] RegistrationPupilModel model, [FromForm] string classCode)
        {

            if (_userService.checkEmailExistence(model.EmailPupil, db))
            {
                return BadRequest(new { message = "Ця електронна пошта вже зареєстрована!" });
            }
            else if (db.Classes.Where(classCodeCheck => classCodeCheck.AccessCode == classCode).FirstOrDefault() == null)
            {
                return BadRequest(new { message = "Код класу неправильний!" });
            }

            Pupil showPiece = db.Pupil
                      .OrderByDescending(p => p.IdPupil)
                      .FirstOrDefault();

            Pupil tempPupil = new Pupil();
            if (showPiece == null)
            {
                tempPupil.IdPupil = db.Pupil.Count() + 1;
            }
            else
            {
                tempPupil.IdPupil = (showPiece.IdPupil) + 1;
            }
            tempPupil.Name = model.NamePupil;
            tempPupil.Surname = model.SurnamePupil;
            tempPupil.Patronymic = model.PatronymicPupil;
            tempPupil.Password = model.PasswordPupil;
            tempPupil.Phone = model.PhonePupil;
            tempPupil.Adress = model.AdressPupil;
            tempPupil.RoleId = 2;
            tempPupil.Email = model.EmailPupil;
            tempPupil.Moto = model.MotoPupil;
            tempPupil.DateOfBirth = Convert.ToDateTime(model.DateOfBirthPupil);
            tempPupil.Gender = int.Parse(model.GenderPupil);
            using (var ms = new MemoryStream())
            {
                model.ImageOfPupil.CopyTo(ms);
                tempPupil.ImageOfPupil = ms.ToArray();
            }


            db.Pupil.Add(tempPupil);
            db.SaveChanges();

            ClassStudent classStudent = new ClassStudent();
            ClassStudent showPieceStudent = db.ClassStudent
                   .OrderByDescending(p => p.Id)
                   .FirstOrDefault();
            if (showPieceStudent == null)
            {
                classStudent.Id = db.ClassStudent.Count() + 1;
            }
            else
            {
                classStudent.Id = (showPieceStudent.Id) + 1;
            }
            classStudent.IdStudent = tempPupil.IdPupil;
            Classes classIdFinder = db.Classes.Where(classCodeCheck => classCodeCheck.AccessCode == classCode).FirstOrDefault();
            classStudent.IdClass = classIdFinder.IdClass;
            db.ClassStudent.Add(classStudent);

            db.SaveChanges();

            var userPupil = _userService.AuthenticatePupil(tempPupil.Email, tempPupil.Password, db);
            if (userPupil != null)
            {
                return Ok(userPupil);
            }
            else
                return BadRequest(new { message = "Помилка на сервері" });
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("createPupil")]
        public IActionResult CreatePupil([FromForm] RegistrationPupilModel model, [FromForm] string classCode)
        {
            if (_userService.checkEmailExistence(model.EmailPupil, db))
            {
                return BadRequest(new { message = "Ця електронна пошта вже зареєстрована!" });
            }
            else if (db.Classes.Where(classCodeCheck => classCodeCheck.AccessCode == classCode).FirstOrDefault() == null)
            {
                return BadRequest(new { message = "Код класу неправильний!" });
            }
            try
            {
                Pupil showPiece = db.Pupil
                     .OrderByDescending(p => p.IdPupil)
                     .FirstOrDefault();

                Pupil tempPupil = new Pupil();
                if (showPiece == null)
                {
                    tempPupil.IdPupil = db.Pupil.Count() + 1;
                }
                else
                {
                    tempPupil.IdPupil = (showPiece.IdPupil) + 1;
                }
                tempPupil.Name = model.NamePupil;
                tempPupil.Surname = model.SurnamePupil;
                tempPupil.Patronymic = model.PatronymicPupil;
                tempPupil.Password = model.PasswordPupil;
                tempPupil.Phone = model.PhonePupil;
                tempPupil.Adress = model.AdressPupil;
                tempPupil.RoleId = 2;
                tempPupil.Email = model.EmailPupil;
                tempPupil.Moto = model.MotoPupil;
                tempPupil.DateOfBirth = Convert.ToDateTime(model.DateOfBirthPupil);
                tempPupil.Gender = int.Parse(model.GenderPupil);
                if (model.ImageOfPupil == null)
                {
                    return BadRequest(new { message = "Ви забули додати фото" });
                }
                using (var ms = new MemoryStream())
                {
                    model.ImageOfPupil.CopyTo(ms);
                    tempPupil.ImageOfPupil = ms.ToArray();
                }


                db.Pupil.Add(tempPupil);
                db.SaveChanges();

                ClassStudent classStudent = new ClassStudent();
                classStudent.IdStudent = tempPupil.IdPupil;
                classStudent.Id = db.ClassStudent.Count() + 1; // поменять
                Classes classIdFinder = db.Classes.Where(classCodeCheck => classCodeCheck.AccessCode == classCode).FirstOrDefault();
                classStudent.IdClass = classIdFinder.IdClass;
                db.ClassStudent.Add(classStudent);

                db.SaveChanges();
                // Дождаться завершения сохранения 

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Помилка серверу" });
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("createTeacher")]
        public IActionResult CreateTeacher([FromForm] RegistrationTeacherModel model)
        {
            if (_userService.checkEmailExistence(model.EmailTeacher, db))
            {
                return BadRequest(new { message = "Ця електронна пошта вже зареєстрована!" });
            }
            try
            {
                List<SelectModel> listSelected = JsonConvert.DeserializeObject<List<SelectModel>>(Request.Form["selectedOption"]);

                Teacher showPiece = db.Teacher
                       .OrderByDescending(p => p.IdTeacher)
                       .FirstOrDefault();

                Teacher tempTeacher = new Teacher();
                if (showPiece == null)
                {
                    tempTeacher.IdTeacher = db.Teacher.Count() + 1;
                }
                else
                {
                    tempTeacher.IdTeacher = (showPiece.IdTeacher) + 1;
                }
                tempTeacher.Name = model.NameTeacher;
                tempTeacher.Surname = model.SurnameTeacher;
                tempTeacher.Patronymic = model.PatronymicTeacher;
                tempTeacher.Password = model.PasswordTeacher;
                tempTeacher.Phone = model.PhoneTeacher;
                tempTeacher.Adress = model.AdressTeacher;
                tempTeacher.RoleId = 4;
                tempTeacher.Email = model.EmailTeacher;
                tempTeacher.DateOfBirth = Convert.ToDateTime(model.DateOfBirthTeacher);
                tempTeacher.Gender = int.Parse(model.GenderTeacher);
                //tempPupil.ImageOfPupil = Encoding.ASCII.GetBytes(model.ImageOfPupil);
                if (model.ImageOfTeacher == null)
                {
                    return BadRequest(new { message = "Ви забули додати фото!" });
                }
                using (var ms = new MemoryStream())
                {
                    model.ImageOfTeacher.CopyTo(ms);
                    tempTeacher.ImageOfTeacher = ms.ToArray();
                }


                db.Teacher.Add(tempTeacher);
                db.SaveChanges();

                for (int i = 0; i < listSelected.Count(); i++)
                {
                    SubjectTeacher subjectTeacher = new SubjectTeacher();
                    subjectTeacher.TeacherId = tempTeacher.IdTeacher;
                    subjectTeacher.SubjectId = int.Parse(listSelected[i].value);
                    db.SubjectTeacher.Add(subjectTeacher);
                    db.SaveChanges();
                }

                // Дождаться завершения сохранения 

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [Authorize(Roles = roleContext.Teacher)]
        [HttpPut("changeTeacher")]
        public IActionResult changeTeacher([FromForm] RegistrationTeacherModel model, [FromForm] int teacherId, [FromForm] string adminCode)
        {
            if (adminAccessCode == adminCode)
            {

                try
                {
                    List<SelectModel> listSelected = JsonConvert.DeserializeObject<List<SelectModel>>(Request.Form["selectedOption"]);

                    Teacher tempTeacher = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == teacherId).SingleOrDefault();
                    if (_userService.checkEmailExistence(model.EmailTeacher, db) && tempTeacher.Email != model.EmailTeacher)
                    {
                        return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                    }
                    tempTeacher.Name = model.NameTeacher;
                    tempTeacher.Surname = model.SurnameTeacher;
                    tempTeacher.Patronymic = model.PatronymicTeacher;
                    tempTeacher.Password = model.PasswordTeacher;
                    tempTeacher.Phone = model.PhoneTeacher;
                    tempTeacher.Adress = model.AdressTeacher;
                    tempTeacher.Email = model.EmailTeacher;
                    tempTeacher.DateOfBirth = Convert.ToDateTime(model.DateOfBirthTeacher);
                    tempTeacher.Gender = int.Parse(model.GenderTeacher);
                    if (model.ImageOfTeacher != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.ImageOfTeacher.CopyTo(ms);
                            tempTeacher.ImageOfTeacher = ms.ToArray();
                        }
                    }
                    db.SaveChanges();

                    List<SubjectTeacher> subjectTeacherList = db.SubjectTeacher.Where(subjectEntity => subjectEntity.TeacherId == tempTeacher.IdTeacher).ToList();
                    foreach (SubjectTeacher stEntity in subjectTeacherList)
                    {
                        bool checkForRemoval = true;
                        for (int i = 0; i < listSelected.Count(); i++)
                        {
                            if (stEntity.SubjectId == int.Parse(listSelected[i].value))
                                checkForRemoval = false;
                        }
                        if (checkForRemoval)
                        {
                            List<Curricular> listCurricular = db.Curricular.Where(curricularEntity => curricularEntity.SubjectId == stEntity.SubjectId && curricularEntity.TeacherId == tempTeacher.IdTeacher).ToList();
                            foreach (Curricular crEntity in listCurricular)
                            {
                                db.Curricular.Remove(crEntity);
                                db.SaveChanges();
                            }
                            db.SubjectTeacher.Remove(stEntity);
                            db.SaveChanges();
                        }
                    }

                    for (int i = 0; i < listSelected.Count(); i++)
                    {
                        bool checkForAdding = true;
                        foreach (SubjectTeacher stEntity in subjectTeacherList)
                        {
                            if (stEntity.SubjectId == int.Parse(listSelected[i].value))
                                checkForAdding = false;
                        }
                        if (checkForAdding)
                        {
                            SubjectTeacher subjectTeacher = new SubjectTeacher();
                            subjectTeacher.TeacherId = tempTeacher.IdTeacher;
                            subjectTeacher.SubjectId = int.Parse(listSelected[i].value);
                            db.SubjectTeacher.Add(subjectTeacher);
                            db.SaveChanges();
                        }
                    }
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return Ok(JsonConvert.SerializeObject("У доступі відмовлено!"));
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpPut("changeAdmin")]
        public IActionResult changeAdmin([FromForm] RegistrationAdminModel model, [FromForm] int admminId, [FromForm] string adminCode)
        {
            if (adminAccessCode == adminCode)
            {

                try
                {
                    Admin tempAdmin = db.Admin.Where(adminEntity => adminEntity.IdAdmin == admminId).SingleOrDefault();
                    if (_userService.checkEmailExistence(model.EmailAdmin, db) && tempAdmin.Email != model.EmailAdmin)
                    {
                        return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                    }
                    tempAdmin.Name = model.NameAdmin;
                    tempAdmin.Surname = model.SurnameAdmin;
                    tempAdmin.Patronymic = model.PatronymicAdmin;
                    tempAdmin.Password = model.PasswordAdmin;
                    tempAdmin.Phone = model.PhoneAdmin;
                    tempAdmin.Email = model.EmailAdmin;
                    tempAdmin.Description = model.DescriptionAdmin;
                    tempAdmin.DateOfBirth = Convert.ToDateTime(model.DateOfBirthAdmin);
                    tempAdmin.Gender = int.Parse(model.GenderAdmin);
                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return BadRequest(JsonConvert.SerializeObject("У доступі відмовлено!"));
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpPut("ChangePersonalAdmin")]
        public IActionResult ChangePersonalAdmin([FromForm] string emailAdmin, [FromForm] string passwordAdmin, [FromForm] string phoneAdmin, [FromForm] string descriptionAdmin)
        {
            try
            {

                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Admin tempAdmin = db.Admin.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                if (_userService.checkEmailExistence(emailAdmin, db) && tempAdmin.Email != emailAdmin)
                {
                    return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                }

                tempAdmin.Password = passwordAdmin;
                tempAdmin.Phone = phoneAdmin;
                tempAdmin.Email = emailAdmin;
                tempAdmin.Description = descriptionAdmin;
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpPut("ChangePersonalParent")]
        public IActionResult ChangePersonalParent([FromForm] string emailParent, [FromForm] string passwordParent, [FromForm] string phoneParent, [FromForm] string addressParent, [FromForm] string workPlaceParent)
        {
            try
            {

                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Parent tempParent = db.Parent.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                if (_userService.checkEmailExistence(emailParent, db) && tempParent.Email != emailParent)
                {
                    return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                }

                tempParent.Password = passwordParent;
                tempParent.Phone = phoneParent;
                tempParent.Email = emailParent;
                tempParent.Adress = addressParent;
                tempParent.WorkPlace = workPlaceParent;
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = roleContext.Teacher)]
        [HttpPut("ChangePersonalTeacher")]
        public IActionResult ChangePersonalTeacher([FromForm] string emailTeacher, [FromForm] string passwordTeacher, [FromForm] string phoneTeacher, [FromForm] string addressTeacher, [FromForm] IFormFile imageTeacher)
        {
            try
            {

                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Teacher tempTeacher = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                if (_userService.checkEmailExistence(emailTeacher, db) && tempTeacher.Email != emailTeacher)
                {
                    return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                }

                tempTeacher.Password = passwordTeacher;
                tempTeacher.Phone = phoneTeacher;
                tempTeacher.Email = emailTeacher;
                tempTeacher.Adress = addressTeacher;
                if (imageTeacher != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        imageTeacher.CopyTo(ms);
                        tempTeacher.ImageOfTeacher = ms.ToArray();
                    }
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = roleContext.Pupil)]
        [HttpPut("ChangePersonalPupil")]
        public IActionResult ChangePersonalPupil([FromForm] string emailPupil, [FromForm] string passwordPupil, [FromForm] string phonePupil, [FromForm] string addressPupil, [FromForm] string moto, [FromForm] IFormFile imagePupil)
        {
            try
            {

                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Pupil tempPupil = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                if (_userService.checkEmailExistence(emailPupil, db) && tempPupil.Email != emailPupil)
                {
                    return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
                }

                tempPupil.Password = passwordPupil;
                tempPupil.Phone = phonePupil;
                tempPupil.Email = emailPupil;
                tempPupil.Adress = addressPupil;
                tempPupil.Moto = moto;
                if (imagePupil != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        imagePupil.CopyTo(ms);
                        tempPupil.ImageOfPupil = ms.ToArray();
                    }
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPut("ChangePupil")]
        public IActionResult ChangePupil([FromForm] RegistrationPupilModel model, [FromForm] int pupilId, [FromForm] string adminCode, [FromForm] string classCode)
        {

            if (adminAccessCode == adminCode)
            {
                try
                {
                    Classes classIdFinder = db.Classes.Where(classCodeCheck => classCodeCheck.AccessCode == classCode).FirstOrDefault();
                    if (classIdFinder == null)
                        return BadRequest(new { message = "Ви ввели невірний код класу!" });
                    Pupil tempPupil = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == pupilId).SingleOrDefault();
                    if (_userService.checkEmailExistence(model.EmailPupil, db) && tempPupil.Email != model.EmailPupil)
                    {
                        return BadRequest(new { message = "Ця електронна пошта вже зареєстрована!" });
                    }
                    tempPupil.Name = model.NamePupil;
                    tempPupil.Surname = model.SurnamePupil;
                    tempPupil.Patronymic = model.PatronymicPupil;
                    tempPupil.Password = model.PasswordPupil;
                    tempPupil.Phone = model.PhonePupil;
                    tempPupil.Adress = model.AdressPupil;
                    tempPupil.RoleId = 2;
                    tempPupil.Email = model.EmailPupil;
                    tempPupil.Moto = model.MotoPupil;
                    tempPupil.DateOfBirth = Convert.ToDateTime(model.DateOfBirthPupil);
                    tempPupil.Gender = int.Parse(model.GenderPupil);
                    if (model.ImageOfPupil != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.ImageOfPupil.CopyTo(ms);
                            tempPupil.ImageOfPupil = ms.ToArray();
                        }
                    }
                   
                    db.SaveChanges();

                    ClassStudent classStudentTemp = db.ClassStudent.Where(clStEntity => clStEntity.IdStudent == tempPupil.IdPupil).FirstOrDefault();
                    if (classIdFinder.IdClass != classStudentTemp.IdClass)
                    {
                        db.ClassStudent.Remove(classStudentTemp);
                        db.SaveChanges();

                        ClassStudent showPiece = db.ClassStudent
                            .OrderByDescending(p => p.Id)
                            .FirstOrDefault();

                        ClassStudent classStudent = new ClassStudent();
                        if (showPiece == null)
                        {
                            classStudent.Id = db.ClassStudent.Count() + 1;
                        }
                        else
                        {
                            classStudent.Id = (showPiece.Id) + 1;
                        }
                        classStudent.IdStudent = tempPupil.IdPupil;
                        classStudent.IdClass = classIdFinder.IdClass;
                        db.ClassStudent.Add(classStudent);
                    }

                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return BadRequest(JsonConvert.SerializeObject("У доступі відмовлено!"));
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPut("ChangeAnnouncement")]
        public IActionResult ChangeAnnouncement([FromForm] string title, [FromForm] string content, [FromForm] bool actual, [FromForm] IFormFile attachement, [FromForm] int idAnnouncement)
        {
            try
            {
                AnnouncementSender tempAnnouncement = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == idAnnouncement).FirstOrDefault();

                tempAnnouncement.AnnouncementContent = content;
                tempAnnouncement.TitleAnnouncement = title;
                tempAnnouncement.Actual = actual;

                if (attachement != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        attachement.CopyTo(ms);
                        tempAnnouncement.Attachements = ms.ToArray();
                        tempAnnouncement.AttchFormatExst = attachement.ContentType;
                        tempAnnouncement.Filename = attachement.FileName;
                    }
                }
                db.SaveChanges();


                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }



        [Authorize(Roles = roleContext.Admin)]
        [HttpPut("ChangeClass")]
        public IActionResult ChangeClass([FromForm] int idClassroomTeacher, [FromForm] string accessCode, [FromForm] int idClass, [FromForm] string adminCode)
        {
            if (adminAccessCode == adminCode)
            {
                try
                {
                    if (db.Classes.Where(clEntity => clEntity.AccessCode == accessCode).FirstOrDefault() != null)
                        return BadRequest(new { message = "Такий код доступу вже існує!" });

                    Classes tempClass = db.Classes.Where(clEntity => clEntity.IdClass == idClass).FirstOrDefault();
                    tempClass.IdClassroomTeacher = idClassroomTeacher;
                    tempClass.AccessCode = accessCode;
                    db.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else {
                return BadRequest(new { message = "Відмолено у доступі!" });
            }
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpPut("ChangeHomeworkInfo")]
        public IActionResult ChangeHomeworkInfo([FromForm] CreateHomeworkInfoModel model, [FromForm] int idHomework)
        {
            try
            {
                HomeworkInfo temphwInfo = db.HomeworkInfo.Where(hwEntity => hwEntity.IdHomework == idHomework).FirstOrDefault();
                temphwInfo.Title = model.Title;
                temphwInfo.Description = model.Content;
                temphwInfo.DueDate = Convert.ToDateTime(model.DueDate);
                if (model.Attachement != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        model.Attachement.CopyTo(ms);
                        temphwInfo.Attachements = ms.ToArray();
                        temphwInfo.AttchFormatExst = model.Attachement.ContentType;
                        temphwInfo.Filename = model.Attachement.FileName;
                    }
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpPut("ChangePost")]
        public IActionResult ChangePost([FromForm] TeacherPostModel model, [FromForm] int idPost)
        {
            try
            {
                TeacherPost tempPost = db.TeacherPost.Where(postEntity => postEntity.IdPost == idPost).FirstOrDefault();
                tempPost.Title = model.Title;
                tempPost.PostContent = model.Content;
                if (model.Attachement != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        model.Attachement.CopyTo(ms);
                        tempPost.Attachements = ms.ToArray();
                        tempPost.AttchFormatExst = model.Attachement.ContentType;
                        tempPost.Filename = model.Attachement.FileName;
                    }
                }
                db.SaveChanges();


                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordTeacherAdmin/{id}/{adminCode}")]
        public IActionResult DeleteRecordTeacherAdmin(int id, string adminCode)
        {
            if (adminAccessCode == adminCode)
            {
                try
                {
                    if (id == 0)
                    {
                        return BadRequest(new { message = "Не можна видаляти нульвого вчителя!!!" });
                    }
                    Teacher tempTeacher = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == id).SingleOrDefault();

                    List<SubjectTeacher> subjectTeacherList = db.SubjectTeacher.Where(subjectEntity => subjectEntity.TeacherId == tempTeacher.IdTeacher).ToList();
                    foreach (SubjectTeacher stEntity in subjectTeacherList)
                    {
                        List<Curricular> listCurricular = db.Curricular.Where(curricularEntity => curricularEntity.SubjectId == stEntity.SubjectId && curricularEntity.TeacherId == tempTeacher.IdTeacher).ToList();
                        foreach (Curricular crEntity in listCurricular)
                        {
                            db.Curricular.Remove(crEntity);
                            db.SaveChanges();
                        }
                        db.SubjectTeacher.Remove(stEntity);
                        db.SaveChanges();
                    }
                    List<FeedbackSender> listFeedback = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdTeacher == tempTeacher.IdTeacher || feedbackEntity.SenderIdTeacher == tempTeacher.IdTeacher).ToList();
                    foreach (FeedbackSender crEntity in listFeedback)
                    {
                        db.FeedbackSender.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<HomeworkInfo> listHwI = db.HomeworkInfo.Where(hwInfoEntity => hwInfoEntity.IdTeacher == tempTeacher.IdTeacher).ToList();
                    foreach (HomeworkInfo crEntity in listHwI)
                    {
                        crEntity.IdTeacher = 0;
                        db.SaveChanges();
                    }
                    List<HomeworkSubmission> listHwS = db.HomeworkSubmission.Where(hwEntity => hwEntity.IdTeacher == tempTeacher.IdTeacher).ToList();
                    foreach (HomeworkSubmission crEntity in listHwS)
                    {
                        crEntity.IdTeacher = 0;
                        db.SaveChanges();
                    }
                    List<Grade> listGrades = db.Grade.Where(gradeEntity => gradeEntity.TeacherId == tempTeacher.IdTeacher).ToList();
                    foreach (Grade crEntity in listGrades)
                    {
                        crEntity.TeacherId = 0;
                        db.SaveChanges();
                    }
                    List<TeacherPost> listPosts = db.TeacherPost.Where(postEntity => postEntity.IdTeacher == tempTeacher.IdTeacher).ToList();
                    foreach (TeacherPost crEntity in listPosts)
                    {
                        crEntity.IdTeacher = 0;
                        db.SaveChanges();
                    }


                    Classes classroomTeacher = db.Classes.Where(subjectEntity => subjectEntity.IdClassroomTeacher == tempTeacher.IdTeacher).FirstOrDefault();
                    if (classroomTeacher != null)
                        classroomTeacher.IdClassroomTeacher = 0; //default teacher "no data teacher"
                    db.SaveChanges();
                    db.Teacher.Remove(tempTeacher);
                    db.SaveChanges();
                    return Ok(JsonConvert.SerializeObject("Доступ дозволений!"));
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
            {
                return Ok(JsonConvert.SerializeObject("У доступі відмовлено!"));
            }
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordAdminAdmin/{id}/{adminCode}")]
        public IActionResult DeleteRecordAdminAdmin(int id, string adminCode)
        {
            if (adminAccessCode == adminCode)
            {
                try
                {
                    Admin tempAdmin = db.Admin.Where(teacherEntity => teacherEntity.IdAdmin == id).SingleOrDefault();

                    List<FeedbackSender> listFeedback = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdAdmin == tempAdmin.IdAdmin || feedbackEntity.SenderIdAdmin == tempAdmin.IdAdmin).ToList();
                    foreach (FeedbackSender crEntity in listFeedback)
                    {
                        db.FeedbackSender.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<AnnouncementSender> listHwI = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdAdminSender == tempAdmin.IdAdmin).ToList();
                    foreach (AnnouncementSender crEntity in listHwI)
                    {
                        db.AnnouncementSender.Remove(crEntity);
                        db.SaveChanges();
                    }

                    db.Admin.Remove(tempAdmin);
                    db.SaveChanges();
                    return Ok(JsonConvert.SerializeObject("Доступ дозволений!"));
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
            {
                return Ok(JsonConvert.SerializeObject("У доступі відмовлено!"));
            }
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordParentAdmin/{id}")]
        public IActionResult DeleteRecordParentAdmin(int id)
        {
            try
            {
                Parent tempParent = db.Parent.Where(teacherEntity => teacherEntity.IdParent == id).SingleOrDefault();

                List<FeedbackSender> listFeedback = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdParent == tempParent.IdParent || feedbackEntity.SenderIdParent == tempParent.IdParent).ToList();
                foreach (FeedbackSender crEntity in listFeedback)
                {
                    db.FeedbackSender.Remove(crEntity);
                    db.SaveChanges();
                }

                List<ParentStudent> listHwI = db.ParentStudent.Where(parStEntity => parStEntity.IdParent == tempParent.IdParent).ToList();
                foreach (ParentStudent crEntity in listHwI)
                {
                    db.ParentStudent.Remove(crEntity);
                    db.SaveChanges();
                }

                db.Parent.Remove(tempParent);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordPupilAdmin/{id}/{adminCode}")]
        public IActionResult DeleteRecordPupilAdmin(int id, string adminCode)
        {
            if (adminAccessCode == adminCode)
            {
                try
                {
                    Pupil tempPupil = db.Pupil.Where(teacherEntity => teacherEntity.IdPupil == id).SingleOrDefault();

                    List<FeedbackSender> listFeedback = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdStudent == tempPupil.IdPupil || feedbackEntity.SenderIdStudent == tempPupil.IdPupil).ToList();
                    foreach (FeedbackSender crEntity in listFeedback)
                    {
                        db.FeedbackSender.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<ParentStudent> listHwI = db.ParentStudent.Where(parStEntity => parStEntity.IdStudent == tempPupil.IdPupil).ToList();
                    foreach (ParentStudent crEntity in listHwI)
                    {
                        db.ParentStudent.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<Attendance> listAtt = db.Attendance.Where(attEntity => attEntity.IdStudent == tempPupil.IdPupil).ToList();
                    foreach (Attendance crEntity in listAtt)
                    {
                        db.Attendance.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<ClassStudent> listClSt = db.ClassStudent.Where(clStEntity => clStEntity.IdStudent == tempPupil.IdPupil).ToList();
                    foreach (ClassStudent crEntity in listClSt)
                    {
                        db.ClassStudent.Remove(crEntity);
                        db.SaveChanges();
                    }

                    List<FinalGrade> listFinalGrade = db.FinalGrade.Where(gradeEntity => gradeEntity.IdStudent == tempPupil.IdPupil).ToList();
                    foreach (FinalGrade crEntity in listFinalGrade)
                    {
                        db.FinalGrade.Remove(crEntity);
                        db.SaveChanges();
                    }
                    List<GradeThematical> listThematical = db.GradeThematical.Where(gradeEntity => gradeEntity.IdStudent == tempPupil.IdPupil).ToList();
                    foreach (GradeThematical crEntity in listThematical)
                    {
                        db.GradeThematical.Remove(crEntity);
                        db.SaveChanges();
                    }
                    List<Grade> listGrades = db.Grade.Where(gradeEntity => gradeEntity.StudentId == tempPupil.IdPupil).ToList();
                    foreach (Grade crEntity in listGrades)
                    {
                        db.Grade.Remove(crEntity);
                        db.SaveChanges();
                    }
                    List<HomeworkSubmission> listSubmission = db.HomeworkSubmission.Where(hwEntity => hwEntity.StudentId == tempPupil.IdPupil).ToList();
                    foreach (HomeworkSubmission crEntity in listSubmission)
                    {
                        db.HomeworkSubmission.Remove(crEntity);
                        db.SaveChanges();
                    }

                    db.Pupil.Remove(tempPupil);
                    db.SaveChanges();
                    return Ok(JsonConvert.SerializeObject("Доступ дозволений!"));
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
            {
                return Ok(JsonConvert.SerializeObject("У доступі відмовлено!"));
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordAnnouncementAdmin/{id}")]
        public IActionResult DeleteRecordAnnouncementAdmin(int id)
        {
            try
            {
                AnnouncementSender tempAnnouncement = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdAnnouncement == id).SingleOrDefault();
                db.AnnouncementSender.Remove(tempAnnouncement);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [Authorize(Roles = roleContext.Parent)]
        [HttpDelete("DeleteRecordChildParent/{id}")]
        public IActionResult DeleteRecordChildParent(int id)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Parent parentModel = db.Parent.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();

                ParentStudent tempRelationshipParentStudent = db.ParentStudent.Where(parStEntity => parStEntity.IdStudent == id && parStEntity.IdParent == parentModel.IdParent).SingleOrDefault();
                db.ParentStudent.Remove(tempRelationshipParentStudent);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [Authorize(Roles = roleContext.Admin)]
        [HttpDelete("DeleteRecordLessonAdmin/{dayId}/{lessonId}/{flowId}/{classId}")]
        public IActionResult DeleteRecordLessonAdmin(int dayId, int lessonId, int flowId, int classId)
        {
            try
            {
                Classes classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == flowId && classEntity.ClassLetter == classId).FirstOrDefault();
                if (classModel != null)
                {
                    Curricular tempLesson = db.Curricular.Where(lessonEntity => lessonEntity.DayId == dayId && lessonEntity.LessonOrder == lessonId && lessonEntity.ClassId == classModel.IdClass).SingleOrDefault();
                    db.Curricular.Remove(tempLesson);
                    db.SaveChanges();
                    return Ok();
                }
                else {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpDelete("DeleteRecordPostTeacher/{id}")]
        public IActionResult DeleteRecordPostTeacher(int id)
        {
            try
            {
                TeacherPost tempPost = db.TeacherPost.Where(postEntity => postEntity.IdPost == id).SingleOrDefault();
                db.TeacherPost.Remove(tempPost);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = roleContext.Teacher)]
        [HttpDelete("DeleteRecordHomeworkTeacher/{id}")]
        public IActionResult DeleteRecordHomeworkTeacher(int id)
        {
            try
            {
                HomeworkInfo tempHwInfo = db.HomeworkInfo.Where(postEntity => postEntity.IdHomework == id).SingleOrDefault();
                List<HomeworkSubmission> listSubmission = db.HomeworkSubmission.Where(hwEntity => hwEntity.HomeworkId == tempHwInfo.IdHomework).ToList();
                foreach (HomeworkSubmission crEntity in listSubmission)
                {
                    db.HomeworkSubmission.Remove(crEntity);
                    db.SaveChanges();
                }

                db.HomeworkInfo.Remove(tempHwInfo);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateAttendance")]
        public IActionResult CreateAttendance([FromForm] WriteAttendanceModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                List<AttendanceModel> listAttendance = JsonConvert.DeserializeObject<List<AttendanceModel>>(Request.Form["pupils"]);

                for (int i = 0; i < listAttendance.Count(); i++)
                {
                    Attendance tempAttendance = new Attendance();

                    Attendance showPiece = db.Attendance
                      .OrderByDescending(p => p.IdAttendance)
                      .FirstOrDefault();

                    if (showPiece == null)
                    {
                        tempAttendance.IdAttendance = db.Attendance.Count() + 1;
                    }
                    else
                    {
                        tempAttendance.IdAttendance = (showPiece.IdAttendance) + 1;
                    }

                    tempAttendance.IdSubject = int.Parse(model.zeroSelect);
                    tempAttendance.IdStudent = listAttendance[i].idStudent;
                    tempAttendance.DateOfLesson = DateTime.Today;
                    if (listAttendance[i].attendance == 0)
                        tempAttendance.AttendanceCheck = true;
                    else
                        tempAttendance.AttendanceCheck = false;
                    if (listAttendance[i].grade > 0)
                    {
                        Grade showGrade = db.Grade
                              .OrderByDescending(p => p.IdGrade)
                              .FirstOrDefault();
                        Grade tempGrade = new Grade();
                        if (showGrade == null)
                        {
                            tempGrade.IdGrade = db.Grade.Count() + 1;
                        }
                        else
                        {
                            tempGrade.IdGrade = (showGrade.IdGrade) + 1;
                        }
                        tempGrade.StudentId = listAttendance[i].idStudent;
                        tempGrade.TeacherId = teacherModel.IdTeacher;
                        tempGrade.SubjectId = int.Parse(model.zeroSelect);
                        tempGrade.DateOfGrade = DateTime.Today;
                        tempGrade.ClassGrade = true;
                        tempGrade.Grade1 = listAttendance[i].grade;
                        tempGrade.Feedback = listAttendance[i].feedback;
                        db.Grade.Add(tempGrade);
                        db.SaveChanges();
                    }
                    db.Attendance.Add(tempAttendance);
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }






        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateThematical")]
        public IActionResult CreateThematical([FromForm] WriteThematicalModel model)
        {
            try
            {
                List<ThematicalStudentModel> listThematical = JsonConvert.DeserializeObject<List<ThematicalStudentModel>>(Request.Form["pupils"]);

                for (int i = 0; i < listThematical.Count(); i++)
                {
                    GradeThematical tempThem = new GradeThematical();

                    GradeThematical showPiece = db.GradeThematical
                      .OrderByDescending(p => p.IdThematic)
                      .FirstOrDefault();

                    if (showPiece == null)
                    {
                        tempThem.IdThematic = db.GradeThematical.Count() + 1;
                    }
                    else
                    {
                        tempThem.IdThematic = (showPiece.IdThematic) + 1;
                    }

                    tempThem.IdSubject = int.Parse(model.zeroSelect);
                    tempThem.IdStudent = listThematical[i].idStudent;
                    tempThem.DateFrom = Convert.ToDateTime(model.startDate);
                    tempThem.DateTo = Convert.ToDateTime(model.endDate);
                    tempThem.Grade = listThematical[i].grade;

                    db.GradeThematical.Add(tempThem);
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateFinal")]
        public IActionResult CreateFinal([FromForm] WriteThematicalModel model)
        {
            try
            {
                List<ThematicalStudentModel> listThematical = JsonConvert.DeserializeObject<List<ThematicalStudentModel>>(Request.Form["pupils"]);

                for (int i = 0; i < listThematical.Count(); i++)
                {
                    FinalGrade tempFinal = new FinalGrade();

                    FinalGrade showPiece = db.FinalGrade
                      .OrderByDescending(p => p.IdFinalGrade)
                      .FirstOrDefault();

                    if (showPiece == null)
                    {
                        tempFinal.IdFinalGrade = db.FinalGrade.Count() + 1;
                    }
                    else
                    {
                        tempFinal.IdFinalGrade = (showPiece.IdFinalGrade) + 1;
                    }

                    tempFinal.IdSubject = int.Parse(model.zeroSelect);
                    tempFinal.IdStudent = listThematical[i].idStudent;
                    tempFinal.Grade = listThematical[i].grade;

                    db.FinalGrade.Add(tempFinal);
                    db.SaveChanges();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("createClass")]
        public IActionResult CreateClass([FromForm] RegistrationClassModel model)
        {
            if (db.Classes.Where(classEntity => (classEntity.FlowNumber == int.Parse(model.flow)) && (classEntity.ClassLetter == int.Parse(model.letter))).FirstOrDefault() != null)
            {
                return BadRequest(new { message = "Такий клас вже існує" });
            }
            else if (db.Classes.Where(classEntity => classEntity.AccessCode == model.accessCode).FirstOrDefault() != null)
            {
                return BadRequest(new { message = "Такий код доступу вже існує" });
            }
            try
            {
                Classes showPiece = db.Classes
                       .OrderByDescending(p => p.IdClass)
                       .FirstOrDefault();

                Classes tempClass = new Classes();
                if (showPiece == null)
                {
                    tempClass.IdClass = db.Classes.Count() + 1;
                }
                else
                {
                    tempClass.IdClass = (showPiece.IdClass) + 1;
                }
                tempClass.FlowNumber = int.Parse(model.flow);
                tempClass.ClassLetter = int.Parse(model.letter);
                tempClass.IdClassroomTeacher = int.Parse(model.idClassroomTeacher);
                tempClass.AccessCode = model.accessCode;

                db.Classes.Add(tempClass);
                db.SaveChanges();
                // Дождаться завершения сохранения 

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("createAdmin")]
        public IActionResult CreateAdmin([FromForm] RegistrationAdminModel model, [FromForm] string adminCode)
        {
            if (_userService.checkEmailExistence(model.EmailAdmin, db))
            {
                return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
            }
            else if (adminAccessCode != adminCode)
            {
                return BadRequest(new { message = "Відмовлено в доступі... Неправильний код доступу..." });
            }
            try
            {
                Admin showPiece = db.Admin
                  .OrderByDescending(a => a.IdAdmin)
                  .FirstOrDefault();
                Admin tempAdmin = new Admin();
                if (showPiece == null)
                {
                    tempAdmin.IdAdmin = db.Admin.Count() + 1;
                }
                else
                {
                    tempAdmin.IdAdmin = (showPiece.IdAdmin) + 1;
                }

                tempAdmin.Name = model.NameAdmin;
                tempAdmin.Surname = model.SurnameAdmin;
                tempAdmin.Patronymic = model.PatronymicAdmin;
                tempAdmin.Password = model.PasswordAdmin;
                tempAdmin.Phone = model.PhoneAdmin;
                tempAdmin.RoleId = 1;
                tempAdmin.Email = model.EmailAdmin;
                tempAdmin.Description = model.DescriptionAdmin;
                tempAdmin.DateOfBirth = Convert.ToDateTime(model.DateOfBirthAdmin);
                tempAdmin.Gender = int.Parse(model.GenderAdmin);
                db.Admin.Add(tempAdmin);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("registerParentCodeCheck")]
        public IActionResult RegisterParentCodeCheck([FromForm] string classCode)
        {
            Classes classIdFinder = db.Classes.Where(classCodeAccess => classCodeAccess.AccessCode == classCode).FirstOrDefault();
            if (classCode == null)
                return BadRequest(new { message = "Неправильний код доступу!" });
            else if (classIdFinder != null)
            {
                return Ok(classIdFinder.IdClass);
            }
            else
                return BadRequest(new { message = "Неправильний код доступу!" });
        }

        [AllowAnonymous]
        [HttpGet("pupilsClassById/{id}")]
        public IActionResult pupilsClassById(int id)
        {
            var users = _userService.GetAllPupils(db);
            var userIdClass = db.ClassStudent.Where(record => record.IdClass == id);
            users = users.Where(student => userIdClass.Any(selectedItem => student.IdPupil == selectedItem.IdStudent)).ToList();

            if (users != null)
            {
                return Ok(users);
            }
            else
                return BadRequest(new { message = "У цьому класі ще немає студентів!" });
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllStudentsFromClassRegisteredParent/{id}")]
        public IActionResult GetAllStudentsFromClassRegisteredParent(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();
            var students = _userService.GetAllPupils(db);
            var userIdClass = db.ClassStudent.Where(record => record.IdClass == id);
            var studentParentCheck = db.ParentStudent.Where(record => record.IdParent == parentModel.IdParent);
            if(students == null || studentParentCheck == null)
                return BadRequest(new { message = "У цьому класі ще немає студентів!" });
            students = students.Where(student => userIdClass.Any(selectedItem => student.IdPupil == selectedItem.IdStudent)).ToList();
            if (students == null)
                return BadRequest(new { message = "У цьому класі ще немає студентів!" });
            students = students.Where(student => studentParentCheck.Any(selectedItem => student.IdPupil != selectedItem.IdStudent)).ToList();
            if (students != null)
            {
                return Ok(students);
            }
            else
                return BadRequest(new { message = "У цьому класі ще немає студентів!" });
        }


        [AllowAnonymous]
        [HttpPost("registerParent")]
        public IActionResult registerParent([FromForm] RegistrationParentModel model, [FromForm] string idPupil)
        {
            if (_userService.checkEmailExistence(model.EmailParent, db))
            {
                return BadRequest(new { message = "Ця пошта вже зареєстрована!" });
            }
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.IdPupil == int.Parse(idPupil)).FirstOrDefault();
            bool checkForParent = false;
            var jw = new JaroWinkler();
            if (jw.Similarity(model.SurnameParent, pupilModel.Surname) > 0.5)
                checkForParent = true;
            else if (jw.Similarity(model.AdressParent, pupilModel.Adress) > 0.5)
                checkForParent = true;
            else if (jw.Similarity(model.NameParent, pupilModel.Patronymic) > 0.5)
                checkForParent = true;
            if (checkForParent)
            {
                Parent showPiece = db.Parent
                      .OrderByDescending(p => p.IdParent)
                      .FirstOrDefault();

                Parent tempParent = new Parent();
                if (showPiece == null)
                {
                    tempParent.IdParent = db.Parent.Count() + 1;
                }
                else
                {
                    tempParent.IdParent = (showPiece.IdParent) + 1;
                }
                tempParent.Name = model.NameParent;
                tempParent.Surname = model.SurnameParent;
                tempParent.Patronymic = model.PatronymicParent;
                tempParent.Password = model.PasswordParent;
                tempParent.Phone = model.PhoneParent;
                tempParent.Adress = model.AdressParent;
                tempParent.RoleId = 3;
                tempParent.Email = model.EmailParent;
                tempParent.WorkPlace = model.WorkPlace;
                tempParent.DateOfBirth = Convert.ToDateTime(model.DateOfBirthParent);
                tempParent.Gender = int.Parse(model.GenderParent);

                db.Parent.Add(tempParent);

                db.SaveChanges();

                ParentStudent parentStudent = new ParentStudent();
                ParentStudent showPieceStudent = db.ParentStudent
                   .OrderByDescending(p => p.Id)
                   .FirstOrDefault();
                if (showPieceStudent == null)
                {
                    parentStudent.Id = db.ParentStudent.Count() + 1;
                }
                else
                {
                    parentStudent.Id = (showPieceStudent.Id) + 1;
                }
                parentStudent.IdStudent = int.Parse(idPupil);
                parentStudent.IdParent = tempParent.IdParent;

                db.ParentStudent.Add(parentStudent);
                db.SaveChanges();



                var userParent = _userService.AuthenticateParent(model.EmailParent, model.PasswordParent, db);

                return Ok(userParent);

            }
            else
                return BadRequest(new { message = "Ми не можемо дозволити вам указати цю дитину як вашу. Не співпадають ні один з критеріїв: по-батькові, адреса проживання та прізвище." });
        }




        [Authorize(Roles = roleContext.Parent)]
        [HttpPost("AddChild")]
        public IActionResult AddChild([FromForm] int studentId)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.IdPupil == studentId).FirstOrDefault();
            bool checkForParent = false;
            var jw = new JaroWinkler();
            if (jw.Similarity(parentModel.Surname, pupilModel.Surname) > 0.5)
                checkForParent = true;
            else if (jw.Similarity(parentModel.Adress, pupilModel.Adress) > 0.5)
                checkForParent = true;
            else if (jw.Similarity(parentModel.Name, pupilModel.Patronymic) > 0.5)
                checkForParent = true;

            if (checkForParent)
            {
                ParentStudent showPiece = db.ParentStudent
                  .OrderByDescending(p => p.Id)
                  .FirstOrDefault();
                ParentStudent parentStudent = new ParentStudent();
                if (showPiece == null)
                {
                    parentStudent.Id = db.ParentStudent.Count() + 1;
                }
                else
                {
                    parentStudent.Id = (showPiece.Id) + 1;
                }


                parentStudent.IdStudent = studentId;
                parentStudent.IdParent = parentModel.IdParent;

                db.ParentStudent.Add(parentStudent);
                db.SaveChanges();

                return Ok();
            }
            else
                return BadRequest(new { message = "Ми не можемо дозволити вам указати цю дитину як вашу. Не співпадають ні один з критеріїв: по-батькові, адреса проживання та прізвище." });
        }








        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("createLesson")]
        public IActionResult CreateLesson([FromForm] RegistrationLessonModel model)
        {
            Classes classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == int.Parse(model.flow) && (classEntity.ClassLetter == int.Parse(model.letter))).FirstOrDefault();

            if (db.Curricular.Where(lessonEntity => lessonEntity.ClassId == classModel.IdClass && lessonEntity.LessonOrder == int.Parse(model.lessonOrder) && lessonEntity.DayId == int.Parse(model.dayId)).FirstOrDefault() != null)
            {
                return BadRequest(new { message = "У цьому класі вже є урок у цей час!" });
            }
            else if (db.Curricular.Where(lessonEntity => lessonEntity.TeacherId == int.Parse(model.teacherId) && lessonEntity.LessonOrder == int.Parse(model.lessonOrder) && lessonEntity.DayId == int.Parse(model.dayId)).FirstOrDefault() != null)
            {
                return BadRequest(new { message = "У вчителя є урок у цей час!" });
            }
            try
            {
                Curricular showPiece = db.Curricular
                       .OrderByDescending(p => p.IdCurricularItem)
                       .FirstOrDefault();

                Curricular tempLesson = new Curricular();
                if (showPiece == null)
                {
                    tempLesson.IdCurricularItem = db.Curricular.Count() + 1;
                }
                else
                {
                    tempLesson.IdCurricularItem = (showPiece.IdCurricularItem) + 1;
                }
                tempLesson.ClassId = classModel.IdClass;
                tempLesson.DayId = int.Parse(model.dayId);
                tempLesson.SubjectId = int.Parse(model.subjectId);
                tempLesson.TeacherId = int.Parse(model.teacherId);
                tempLesson.LessonOrder = int.Parse(model.lessonOrder);
                db.Curricular.Add(tempLesson);
                db.SaveChanges();
                // Дождаться завершения сохранения 

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet]
        public IActionResult GetAllTeachers()
        {
            var users = _userService.GetAllTeachers(db);
            return Ok(users);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("classroomTeachers")]
        public IActionResult GetAllTeachersClassroom()
        {
            var users = _userService.GetAllClassromTeachers(db);

            return Ok(users);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllClassroomTeachersAdmin/{id}")]
        public IActionResult GetAllClassroomTeachersAdmin(int id)
        {
            var teachers = _userService.GetAllClassromTeachers(db);
            Classes classEntity = db.Classes.Where(cl => cl.IdClass == id).FirstOrDefault();
            Teacher classRoomTeacher = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == classEntity.IdClassroomTeacher).FirstOrDefault();

            List<SelectModel> teachersSelect = new List<SelectModel>();
            teachersSelect.Add(new SelectModel(classRoomTeacher.IdTeacher.ToString(), classRoomTeacher.Name + " " + classRoomTeacher.Patronymic + " " + classRoomTeacher.Surname));
            if (teachers != null)
            {
                foreach (Teacher teacher in teachers)
                {
                    teachersSelect.Add(new SelectModel(teacher.IdTeacher.ToString(), teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
                }

            }
            return Ok(teachersSelect);
        }

        [Authorize]
        [HttpGet("subjectTeachers/{id}")]
        public IActionResult subjectTeachers(int id)
        {
            var teachers = _userService.GetAllSubjectTeachers(db, id);
            if (teachers != null)
            {
                List<SelectModel> teachersSelect = new List<SelectModel>();
                foreach (Teacher teacher in teachers)
                {
                    teachersSelect.Add(new SelectModel(teacher.IdTeacher.ToString(), teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
                }
                return Ok(teachersSelect);
            }
            else
                return BadRequest(new { message = "Поки що нема вчителів, які навчають цьому предмету!" });
        }

        [Authorize]
        [HttpGet("subjectTeacherIdentity")]
        public IActionResult subjectTeacherIdentity()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            var teachers = _userService.GetAllSubjectTeachers(db, teacherModel.IdTeacher);

            if (teachers != null)
            {
                List<SelectModel> teachersSelect = new List<SelectModel>();
                foreach (Teacher teacher in teachers)
                {
                    teachersSelect.Add(new SelectModel(teacher.IdTeacher.ToString(), teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
                }
                return Ok(teachersSelect);
            }
            else
                return BadRequest(new { message = "Поки що нема вчителів, які навчають цьому предмету!" });
        }

        [Authorize]
        [HttpGet("GetAllSubjectForTeacher")]
        public IActionResult GetAllSubjectForTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            var subjects = _userService.GetAllSubjectForTeacher(db, teacherModel.IdTeacher);

            if (subjects != null)
            {
                List<SelectModel> subjectsSelect = new List<SelectModel>();
                foreach (Subject subject in subjects)
                {
                    subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
                }
                return Ok(subjectsSelect);
            }
            else
                return BadRequest(new { message = "Цей вчитель ще не навчає нічого!" });
        }


        [Authorize]
        [HttpGet("classesByFlow/{id}")]
        public IActionResult classesByFlow(string id)
        {
            List<Classes> classes = db.Classes.Where(classesEntity => classesEntity.FlowNumber == int.Parse(id)).ToList();
            List<ClassLetters> classLetters = db.ClassLetters.Where(classLetter => classes.Select(classEntity => classEntity.ClassLetter).Contains(classLetter.IdLetter)).ToList();
            if (classLetters != null)
            {
                List<SelectModel> lettersSelect = new List<SelectModel>();
                foreach (ClassLetters letter in classLetters)
                {
                    lettersSelect.Add(new SelectModel(letter.IdLetter.ToString(), letter.ClassLetter));
                }
                return Ok(lettersSelect);
            }
            else
                return BadRequest(new { message = "У нас немає класів на цій паралелі!" });
        }

        [Authorize]
        [HttpGet("curricularForDay/{dayId}/{flowId}/{letterId}")]
        public IActionResult CurricularPerDay(string dayId, string flowId, string letterId)
        {
            Classes classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == int.Parse(flowId) && (classEntity.ClassLetter == int.Parse(letterId))).FirstOrDefault();
            List<Curricular> lessons = db.Curricular.Where(lessonEntity => (lessonEntity.ClassId == classModel.IdClass) && (lessonEntity.DayId == int.Parse(dayId))).ToList();
            List<DataTableElement> dataTableList = new List<DataTableElement>();
            for (int i = 0; i < lessons.Count(); i++)
            {

                string subjectName = db.Subject.Where(subject => subject.IdSubject == lessons[i].SubjectId).FirstOrDefault().SubjectName;
                Teacher tempTeacher = db.Teacher.Where(subject => subject.IdTeacher == lessons[i].TeacherId).FirstOrDefault();
                string teacherName = tempTeacher.Name + " " + tempTeacher.Patronymic + " " + tempTeacher.Surname;
                dataTableList.Add(new DataTableElement(i + 1, lessons[i].LessonOrder, subjectName, teacherName, int.Parse(dayId)));
            }
            if (dataTableList != null)
            {
                return Ok(dataTableList);
            }
            else
                return Ok();
        }

        [Authorize]
        [HttpGet("getAllPupilsForClass/{idFlow}/{idLetter}")]
        public IActionResult AllPupilsPerClass(string idFlow, string idLetter)
        {
            var students = _userService.GetAllStudentsForClass(db, int.Parse(idFlow), int.Parse(idLetter));
            if (students != null)
            {
                List<SelectModel> studentsSelect = new List<SelectModel>();
                foreach (Pupil student in students)
                {
                    studentsSelect.Add(new SelectModel(student.IdPupil.ToString(), student.Name + " " + student.Patronymic + " " + student.Surname));
                }
                return Ok(studentsSelect);
            }
            else
                return BadRequest(new { message = "У цьому класі немає учнів!" });
        }

        [Authorize]
        [HttpGet("GetAllPupilsForClassAttendance/{idFlow}/{idLetter}")]
        public IActionResult GetAllPupilsForClassAttendance(string idFlow, string idLetter)
        {
            var students = _userService.GetAllStudentsForClass(db, int.Parse(idFlow), int.Parse(idLetter));
            if (students != null)
            {
                List<AttendanceModel> studentsAttendance = new List<AttendanceModel>();
                foreach (Pupil student in students)
                {
                    studentsAttendance.Add(new AttendanceModel(student.IdPupil, student.Name + " " + student.Patronymic + " " + student.Surname, 0, -1, "No feedback"));
                }
                return Ok(studentsAttendance);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllPupilsForThematicalGrade/{startDate}/{dateEnd}/{idSubject}/{idFlow}/{idLetter}")]
        public IActionResult GetAllPupilsForThematicalGrade(string startDate, string dateEnd, string idSubject, string idFlow, string idLetter)
        {
            var students = _userService.GetAllStudentsForClass(db, int.Parse(idFlow), int.Parse(idLetter));
            if (students != null)
            {
                List<ThematicalStudentModel> studentsThematical = new List<ThematicalStudentModel>(); 
                foreach (Pupil student in students)
                {
                    string themGrades = "";
                    List<Grade> gradesOfStudent = db.Grade.Where(gradeEntity => gradeEntity.StudentId == student.IdPupil && gradeEntity.SubjectId == int.Parse(idSubject) && gradeEntity.DateOfGrade >= Convert.ToDateTime(startDate) && gradeEntity.DateOfGrade <= Convert.ToDateTime(dateEnd)).ToList();
                    foreach (Grade gradeEntity in gradesOfStudent)
                    {
                        themGrades += gradeEntity.Grade1 + ", ";
                    }
                    if (themGrades == "")
                        themGrades = "Не має оцінок";
                    studentsThematical.Add(new ThematicalStudentModel(student.IdPupil, student.Name + " " + student.Patronymic + " " + student.Surname,  -1, themGrades));
                }
                return Ok(studentsThematical);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }


        [Authorize]
        [HttpGet("GetAllAbsenceSubject/{startDate}/{dateEnd}/{idSubject}/{idStudent}")]
        public IActionResult GetAllAbsenceSubject(string startDate, string dateEnd, string idSubject, string idStudent)
        {
            Pupil pupilModel = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == int.Parse(idStudent)).FirstOrDefault();
            if(pupilModel == null)
                return Ok(JsonConvert.SerializeObject("Будь ласка виберіть учня."));
            List<Attendance> attendanceList = db.Attendance.Where(attendanceEntity => attendanceEntity.AttendanceCheck == false && attendanceEntity.IdStudent == pupilModel.IdPupil && attendanceEntity.IdSubject == int.Parse(idSubject) && attendanceEntity.DateOfLesson >= Convert.ToDateTime(startDate) && attendanceEntity.DateOfLesson <= Convert.ToDateTime(dateEnd)).ToList();
            Subject subjectModel = db.Subject.Where(subjectModel => subjectModel.IdSubject == int.Parse(idSubject)).FirstOrDefault();
            if (attendanceList == null || attendanceList.Count() == 0)
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " не пропускав уроків."));
            else if (pupilModel.Gender == 2)
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " пропустила " + attendanceList.Count() + " уроків по предмету " + subjectModel.SubjectName));
            else
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " пропустив " + attendanceList.Count() + " уроків по предмету " + subjectModel.SubjectName));
        }

        [Authorize]
        [HttpGet("GetAllAbsence/{startDate}/{dateEnd}/{idStudent}")]
        public IActionResult GetAllAbsence(string startDate, string dateEnd, string idStudent)
        {
            Pupil pupilModel = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == int.Parse(idStudent)).FirstOrDefault();
            if (pupilModel == null)
                return Ok(JsonConvert.SerializeObject("Будь ласка виберіть учня."));
            List<Attendance> attendanceList = db.Attendance.Where(attendanceEntity => attendanceEntity.AttendanceCheck == false && attendanceEntity.IdStudent == pupilModel.IdPupil && attendanceEntity.DateOfLesson >= Convert.ToDateTime(startDate) && attendanceEntity.DateOfLesson <= Convert.ToDateTime(dateEnd)).ToList();
            if (attendanceList == null || attendanceList.Count() == 0)
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " не пропускав уроків."));
            else if (pupilModel.Gender == 2)
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " пропустила " + attendanceList.Count() + " уроків."));
            else
                return Ok(JsonConvert.SerializeObject("За цей період часу учень " + pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname + " пропустив " + attendanceList.Count() + " уроків."));
        }


        [Authorize]
        [HttpGet("GetAllGradesPupil/{id}")]
        public IActionResult GetAllGradesPupil( int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List<Grade> listGrades = db.Grade.Where(gradeEntity => gradeEntity.SubjectId == id && gradeEntity.StudentId == pupilModel.IdPupil).ToList();
            if (listGrades != null)
            {
                List<WatchGradesModel> studentsGrades = new List<WatchGradesModel>();
                foreach (Grade gradeModel in listGrades)
                {
                    Teacher teacherModel = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == gradeModel.TeacherId).FirstOrDefault();

                    if (gradeModel.HomeworkGrade == false)
                    {
                        studentsGrades.Add(new WatchGradesModel(gradeModel.IdGrade, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, gradeModel.Grade1, "Робота в класі", gradeModel.DateOfGrade, gradeModel.Feedback));
                    }
                    else 
                    {
                        studentsGrades.Add(new WatchGradesModel(gradeModel.IdGrade, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, gradeModel.Grade1, "Домашня робота", gradeModel.DateOfGrade, gradeModel.Feedback));
                    }
                 }
                return Ok(studentsGrades.OrderByDescending(p => p.dateGrade));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllThemGradesPupil/{id}")]
        public IActionResult GetAllThemGradesPupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List<GradeThematical> listGrades = db.GradeThematical.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == pupilModel.IdPupil).ToList();
            if (listGrades != null)
            {
                List<WatchThematicalGrades> studentsGrades = new List<WatchThematicalGrades>();
                foreach (GradeThematical gradeModel in listGrades)
                {        
                   studentsGrades.Add(new WatchThematicalGrades(gradeModel.IdThematic, gradeModel.Grade, gradeModel.DateFrom, gradeModel.DateTo));
                  
                }
                return Ok(studentsGrades.OrderByDescending(p => p.idGrade));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllFinalGradePupil/{id}")]
        public IActionResult GetAllFinalGradePupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            FinalGrade finalGrade = db.FinalGrade.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == pupilModel.IdPupil).FirstOrDefault();

            if (finalGrade != null)
            {
                return Ok(JsonConvert.SerializeObject(finalGrade.Grade));              
            }
            else
                return Ok(JsonConvert.SerializeObject("Ще не виставлена"));
        }

        [Authorize]
        [HttpGet("GetAllAttendancePupil/{id}")]
        public IActionResult GetAllAttendancePupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List<Attendance> listAttendance = db.Attendance.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == pupilModel.IdPupil).ToList();
            if (listAttendance != null)
            {
                List<AttendanceWatchModel> attendanceGrades = new List<AttendanceWatchModel>();
                foreach (Attendance attendanceModel in listAttendance)
                {
                    if (attendanceModel.AttendanceCheck == false)
                    {
                        if (pupilModel.Gender == 1)
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "IndianRed", "Відсутній", attendanceModel.DateOfLesson));
                        else
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "IndianRed", "Відсутня", attendanceModel.DateOfLesson));
                    }

                    else
                    {
                        if (pupilModel.Gender == 1)
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "LightGreen", "Присутній", attendanceModel.DateOfLesson));
                        else
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "LightGreen", "Присутня", attendanceModel.DateOfLesson));
                    }
                       
                }
                return Ok(attendanceGrades.OrderByDescending(p => p.dateOfLesson));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }


        [Authorize]
        [HttpGet("GetAllAttendanceParent/{id}/{studentId}")]
        public IActionResult GetAllAttendanceParent(int id, int studentId)
        {
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.IdPupil == studentId).FirstOrDefault();

            List<Attendance> listAttendance = db.Attendance.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == pupilModel.IdPupil).ToList();
            if (listAttendance != null)
            {
                List<AttendanceWatchModel> attendanceGrades = new List<AttendanceWatchModel>();
                foreach (Attendance attendanceModel in listAttendance)
                {
                    if (attendanceModel.AttendanceCheck == false)
                    {
                        if (pupilModel.Gender == 1)
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "IndianRed", "Відсутній", attendanceModel.DateOfLesson));
                        else
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "IndianRed", "Відсутня", attendanceModel.DateOfLesson));
                    }

                    else
                    {
                        if (pupilModel.Gender == 1)
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "LightGreen", "Присутній", attendanceModel.DateOfLesson));
                        else
                            attendanceGrades.Add(new AttendanceWatchModel(attendanceModel.IdAttendance, "LightGreen", "Присутня", attendanceModel.DateOfLesson));
                    }

                }
                return Ok(attendanceGrades.OrderByDescending(p => p.dateOfLesson));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllGradesPupilParent/{id}/{studentId}")]
        public IActionResult GetAllGradesPupilParent(int id, int studentId)
        {
            List<Grade> listGrades = db.Grade.Where(gradeEntity => gradeEntity.SubjectId == id && gradeEntity.StudentId == studentId).ToList();
            if (listGrades != null)
            {
                List<WatchGradesModel> studentsGrades = new List<WatchGradesModel>();
                foreach (Grade gradeModel in listGrades)
                {
                    Teacher teacherModel = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == gradeModel.TeacherId).FirstOrDefault();

                    if (gradeModel.HomeworkGrade == false)
                    {
                        studentsGrades.Add(new WatchGradesModel(gradeModel.IdGrade, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, gradeModel.Grade1, "Робота в класі", gradeModel.DateOfGrade, gradeModel.Feedback));
                    }
                    else
                    {
                        studentsGrades.Add(new WatchGradesModel(gradeModel.IdGrade, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, gradeModel.Grade1, "Домашня робота", gradeModel.DateOfGrade, gradeModel.Feedback));
                    }
                }
                return Ok(studentsGrades.OrderByDescending(p => p.dateGrade));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllThemGradesPupilParent/{id}/{studentId}")]
        public IActionResult GetAllThemGradesPupilParent(int id, int studentId)
        {
            List<GradeThematical> listGrades = db.GradeThematical.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == studentId).ToList();
            if (listGrades != null)
            {
                List<WatchThematicalGrades> studentsGrades = new List<WatchThematicalGrades>();
                foreach (GradeThematical gradeModel in listGrades)
                {
                    studentsGrades.Add(new WatchThematicalGrades(gradeModel.IdThematic, gradeModel.Grade, gradeModel.DateFrom, gradeModel.DateTo));

                }
                return Ok(studentsGrades.OrderByDescending(p => p.idGrade));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("GetAllFinalGradePupilParent/{id}/{studentId}")]
        public IActionResult GetAllFinalGradePupilParent(int id, int studentId)
        {
            FinalGrade finalGrade = db.FinalGrade.Where(gradeEntity => gradeEntity.IdSubject == id && gradeEntity.IdStudent == studentId).FirstOrDefault();
            if (finalGrade != null)
            {
                return Ok(JsonConvert.SerializeObject(finalGrade.Grade));
            }
            else
                return Ok(JsonConvert.SerializeObject("Ще не виставлена"));
        }







        [Authorize]
        [HttpGet("GetAllPupilsForFinalGrade/{idSubject}/{idFlow}/{idLetter}")]
        public IActionResult GetAllPupilsForFinalGrade(string idSubject, string idFlow, string idLetter)
        {
            var students = _userService.GetAllStudentsForClass(db, int.Parse(idFlow), int.Parse(idLetter));
            if (students != null)
            {
                List<ThematicalStudentModel> studentsThematical = new List<ThematicalStudentModel>();
                foreach (Pupil student in students)
                {
                    string finalGrades = "";
                    List<GradeThematical> gradesOfStudent = db.GradeThematical.Where(gradeEntity => gradeEntity.IdStudent == student.IdPupil && gradeEntity.IdSubject == int.Parse(idSubject)).ToList();
                    foreach (GradeThematical gradeEntity in gradesOfStudent)
                    {
                        finalGrades += gradeEntity.Grade + ", ";
                    }
                    if (finalGrades == "")
                        finalGrades = "Не має оцінок";
                    studentsThematical.Add(new ThematicalStudentModel(student.IdPupil, student.Name + " " + student.Patronymic + " " + student.Surname, -1, finalGrades));
                }
                return Ok(studentsThematical);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }


        
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoTeacher/{id}")]
        public IActionResult GetAllInfoTeacher(int id)
        {
           Teacher teacher = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == id).FirstOrDefault();      
           return Ok(teacher);
          
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoAnnouncementAdmin/{id}")]
        public IActionResult GetAllInfoAnnouncementAdmin(int id)
        {
            AnnouncementSender annModel = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == id).FirstOrDefault();
            if (annModel.Filename == null) annModel.Filename = "no data";

            return Ok(annModel);
        }
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllInfoHomeworkTeacher/{id}")]
        public IActionResult GetAllInfoHomeworkTeacher(int id)
        {
            HomeworkInfo hwInfo = db.HomeworkInfo.Where(hwEntity => hwEntity.IdHomework == id).FirstOrDefault();
         
                string hwFileCheck = "nodata";
                if (hwInfo.Filename != null)
                {
                    hwFileCheck = hwInfo.Filename;
                }
            HomeworkInfoForTeacher hwInfoTeacher = new HomeworkInfoForTeacher(hwInfo.IdHomework, hwInfo.Description, hwInfo.DueDate, hwInfo.IdFlow, hwFileCheck, hwInfo.Title);

            
            return Ok(hwInfoTeacher);

        }
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllInfoPostTeacher/{id}")]
        public IActionResult GetAllInfoPostTeacher(int id)
        {
            TeacherPost postInfo = db.TeacherPost.Where(hwEntity => hwEntity.IdPost == id).FirstOrDefault();

            string hwFileCheck = "nodata";
            if (postInfo.Filename != null)
            {
                hwFileCheck = postInfo.Filename;
            }
            TeacherPostWatchModel postTeacher = new TeacherPostWatchModel(postInfo.IdPost, "", postInfo.Title, postInfo.PostContent, hwFileCheck,  postInfo.DateOfPost);


            return Ok(postTeacher);

        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoClass/{id}")]
        public IActionResult GetAllInfoClass(int id)
        {
            Classes classEntity = db.Classes.Where(classEntity => classEntity.IdClass == id).FirstOrDefault();
            return Ok(classEntity);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoAdmin/{id}")]
        public IActionResult GetAllInfoAdmin(int id)
        {
            Admin admin = db.Admin.Where(adminEntity => adminEntity.IdAdmin == id).FirstOrDefault();
            return Ok(admin);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoPersonalAdmin")]
        public IActionResult GetAllInfoPersonalAdmin()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Admin adminModel = db.Admin.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            return Ok(adminModel);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllInfoPersonalTeacher")]
        public IActionResult GetAllInfoPersonalTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            return Ok(teacherModel);
        }
        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetAllInfoPersonalPupil")]
        public IActionResult GetAllInfoPersonalPupil()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            return Ok(pupilModel);
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllInfoPersonalParent")]
        public IActionResult GetAllInfoPersonalParent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            return Ok(parentModel);
        }




        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllInfoPupil/{id}")]
        public IActionResult GetAllInfoPupil(int id)
        {
            Pupil student = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == id).FirstOrDefault();
            return Ok(student);
        }
        
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetClassCodeStudent/{id}")]
        public IActionResult GetClassCodeStudent(int id)
        {
            ClassStudent findClass = db.ClassStudent.Where(clEntity => clEntity.IdStudent == id).FirstOrDefault();
            Classes classModel = db.Classes.Where(clEntity => clEntity.IdClass == findClass.IdClass).FirstOrDefault();
            return Ok(JsonConvert.SerializeObject(classModel.AccessCode));
        }



        [Authorize]
        [HttpGet("classroomTeacherForClass/{idFlow}/{idLetter}")]
        public IActionResult classroomTeacherForClass(string idFlow, string idLetter)
        {
            var teacher = _userService.GetTeacherOfClass(db, int.Parse(idFlow), int.Parse(idLetter));
            if (teacher != null)
            {
                return Ok(JsonConvert.SerializeObject(teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
            }
            else
                return BadRequest(new { message = "Server error!" });
        }

        [Authorize]
        [HttpGet("getAllParentsForPupil/{idStudent}")]
        public IActionResult AllParentsForPupil(string idStudent)
        {
            var parents = _userService.GetAllParentOfPupil(db, int.Parse(idStudent));
            if (parents != null)
            {
                List<SelectModel> parentsSelect = new List<SelectModel>();
                foreach (Parent parent in parents)
                {
                    parentsSelect.Add(new SelectModel(parent.IdParent.ToString(), parent.Name + " " + parent.Patronymic + " " + parent.Surname));
                }
                return Ok(parentsSelect);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }


        [Authorize]
        [HttpGet("pupils")]
        public IActionResult GetAllPupils()
        {
            var users = _userService.GetAllPupils(db);

            return Ok(users);
        }

        [Authorize]
        [HttpGet("admins")]
        public IActionResult GetAllAdmins()
        {
            var admins = _userService.GetAllAdmins(db);
            if (admins != null)
            {
                List<SelectModel> adminsSelect = new List<SelectModel>();
                foreach (Admin admin in admins)
                {
                    adminsSelect.Add(new SelectModel(admin.IdAdmin.ToString(), admin.Name + " " + admin.Patronymic + " " + admin.Surname));
                }
                return Ok(adminsSelect);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("CreateAdminFeedBack")]
        public IActionResult CreateAdminFeedBack([FromForm] CreateFeedBackAdminModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Admin adminModel = db.Admin.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                    .OrderByDescending(p => p.IdFeedback)
                    .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdAdmin = adminModel.IdAdmin;
                    feedbackSenderTemp.ReceiverIdAdmin = int.Parse(model.SecondSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdAdmin = adminModel.IdAdmin;
                    feedbackSenderTemp.ReceiverIdTeacher = int.Parse(model.ThirdSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "3")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdAdmin = adminModel.IdAdmin;

                    Teacher teacher = _userService.GetTeacherOfClass(db, int.Parse(model.SecondSelect), int.Parse(model.ThirdSelect));
                    feedbackSenderTemp.ReceiverIdTeacher = teacher.IdTeacher;

                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "4")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdAdmin = adminModel.IdAdmin;
                    feedbackSenderTemp.ReceiverIdStudent = int.Parse(model.FourthSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "5")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdAdmin = adminModel.IdAdmin;
                    feedbackSenderTemp.ReceiverIdParent = int.Parse(model.FifthSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача!" });
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateTeacherFeedBack")]
        public IActionResult CreateTeacherFeedBack([FromForm] CreateFeedBackAdminModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                    .OrderByDescending(p => p.IdFeedback)
                    .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdAdmin = int.Parse(model.SecondSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdTeacher = int.Parse(model.ThirdSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "3")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;

                    Teacher teacher = _userService.GetTeacherOfClass(db, int.Parse(model.SecondSelect), int.Parse(model.ThirdSelect));
                    feedbackSenderTemp.ReceiverIdTeacher = teacher.IdTeacher;

                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "4")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdStudent = int.Parse(model.FourthSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "5")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdParent = int.Parse(model.FifthSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача!" });
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }


        [Authorize(Roles = roleContext.Pupil)]
        [HttpPost("CreatePupilFeedBack")]
        public IActionResult CreatePupilFeedBack([FromForm] CreateFeedBackPupil model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Pupil studentModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                    .OrderByDescending(p => p.IdFeedback)
                    .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdStudent = studentModel.IdPupil;
                    feedbackSenderTemp.ReceiverIdAdmin = int.Parse(model.SecondSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdStudent = studentModel.IdPupil;
                    feedbackSenderTemp.ReceiverIdTeacher = int.Parse(model.ThirdSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "3")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdStudent = studentModel.IdPupil;

                    Teacher teacher = _userService.GetClassRoomTeacherForClassPupil(db, studentModel.IdPupil);
                    feedbackSenderTemp.ReceiverIdTeacher = teacher.IdTeacher;

                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача!" });
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateClassRoomTeacherFeedBack")]
        public IActionResult CreateClassRoomTeacherFeedBack([FromForm] CreateFeedBackPupil model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdStudent = int.Parse(model.SecondSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdTeacher = teacherModel.IdTeacher;
                    feedbackSenderTemp.ReceiverIdParent = int.Parse(model.ThirdSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача!" });
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateHomeworkInfo")]
        public IActionResult CreateHomeworkInfo([FromForm] CreateHomeworkInfoModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

                    HomeworkInfo showPiece = db.HomeworkInfo
                   .OrderByDescending(p => p.IdHomework)
                   .FirstOrDefault();
                    HomeworkInfo homeworkInfoTemp = new HomeworkInfo();
                    if (showPiece == null)
                    {
                    homeworkInfoTemp.IdHomework = db.HomeworkInfo.Count() + 1;
                    }
                    else
                    {
                    homeworkInfoTemp.IdHomework = (showPiece.IdHomework) + 1;
                    }
                homeworkInfoTemp.IdTeacher = teacherModel.IdTeacher;
                homeworkInfoTemp.IdSubject = int.Parse(model.zeroSelect);
                homeworkInfoTemp.IdFlow = int.Parse(model.FirstSelect);
                homeworkInfoTemp.Title = model.Title;
                homeworkInfoTemp.Description = model.Content;
                homeworkInfoTemp.DueDate = Convert.ToDateTime(model.DueDate);
                if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                        homeworkInfoTemp.Attachements = ms.ToArray();
                        homeworkInfoTemp.AttchFormatExst = model.Attachement.ContentType;
                        homeworkInfoTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.HomeworkInfo.Add(homeworkInfoTemp);
                    db.SaveChanges();            
               
               
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Pupil)]
        [HttpPost("SubmitHomeworkPupil")]
        public IActionResult SubmitHomeworkPupil([FromForm] SubmitHomeworkModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Pupil pupilModel = db.Pupil.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();
                HomeworkSubmission checkForUpdate = db.HomeworkSubmission.Where(hwEntity => hwEntity.HomeworkId == int.Parse(model.homeworkId) && hwEntity.StudentId == pupilModel.IdPupil).FirstOrDefault();
                if (checkForUpdate != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        model.attachement.CopyTo(ms);
                        checkForUpdate.HomeworkFile = ms.ToArray();
                        checkForUpdate.FileFormatAttr = model.attachement.ContentType;
                        checkForUpdate.Filename = model.attachement.FileName;
                    }
                    checkForUpdate.Comments = model.comment;
                    checkForUpdate.DateOfSubmission = DateTime.Today;
                    db.SaveChanges();
                }

                else
                {
                    HomeworkSubmission showPiece = db.HomeworkSubmission
                   .OrderByDescending(p => p.IdSubmission)
                   .FirstOrDefault();
                    HomeworkSubmission homeworkSubmissionTemp = new HomeworkSubmission();
                    if (showPiece == null)
                    {
                        homeworkSubmissionTemp.IdSubmission = db.HomeworkSubmission.Count() + 1;
                    }
                    else
                    {
                        homeworkSubmissionTemp.IdSubmission = (showPiece.IdSubmission) + 1;
                    }
                    HomeworkInfo hwInfo =  db.HomeworkInfo.Where(hwEntity => hwEntity.IdHomework == int.Parse(model.homeworkId)).FirstOrDefault();

                    homeworkSubmissionTemp.StudentId = pupilModel.IdPupil;
                    homeworkSubmissionTemp.IdTeacher = hwInfo.IdTeacher;
                    homeworkSubmissionTemp.HomeworkId = int.Parse(model.homeworkId);
                    homeworkSubmissionTemp.DateOfSubmission = DateTime.Today;
                    homeworkSubmissionTemp.Comments = model.comment;
                    if (model.attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.attachement.CopyTo(ms);
                            homeworkSubmissionTemp.HomeworkFile = ms.ToArray();
                            homeworkSubmissionTemp.FileFormatAttr = model.attachement.ContentType;
                            homeworkSubmissionTemp.Filename = model.attachement.FileName;
                        }
                    }
                    db.HomeworkSubmission.Add(homeworkSubmissionTemp);
                    db.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("SubmitHomeworkGradeTeacher")]
        public IActionResult SubmitHomeworkGradeTeacher([FromForm] int idSubmission, [FromForm] string comment, [FromForm] int gradeStudent)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
                Teacher teacherModel = db.Teacher.Where(teacherEntity => teacherEntity.Email == emailCurrentUser).FirstOrDefault();

                HomeworkSubmission tempSub = db.HomeworkSubmission.Where(hwEntity => hwEntity.IdSubmission == idSubmission).FirstOrDefault();
                HomeworkInfo tempInfo = db.HomeworkInfo.Where(hwEntity => hwEntity.IdHomework == tempSub.HomeworkId).FirstOrDefault();

                Grade showGrade = db.Grade
                             .OrderByDescending(p => p.IdGrade)
                             .FirstOrDefault();
                Grade tempGrade = new Grade();
                if (showGrade == null)
                {
                    tempGrade.IdGrade = db.Grade.Count() + 1;
                }
                else
                {
                    tempGrade.IdGrade = (showGrade.IdGrade) + 1;
                }
                tempGrade.StudentId = tempSub.StudentId;
                tempGrade.TeacherId = teacherModel.IdTeacher;
                tempGrade.SubjectId = tempInfo.IdSubject;
                tempGrade.DateOfGrade = DateTime.Today;
                tempGrade.HomeworkGrade = true;
                tempGrade.Grade1 = gradeStudent;
                tempGrade.Feedback = comment;
                db.Grade.Add(tempGrade);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }











        [Authorize(Roles = roleContext.Parent)]
        [HttpPost("CreateParentFeedBack")]
        public IActionResult CreateParentFeedBack([FromForm] CreateFeedBackParent model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Parent parentModel = db.Parent.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                    .OrderByDescending(p => p.IdFeedback)
                    .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdParent = parentModel.IdParent;
                    feedbackSenderTemp.ReceiverIdAdmin = int.Parse(model.SecondSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdParent = parentModel.IdParent;
                    feedbackSenderTemp.ReceiverIdTeacher = int.Parse(model.ThirdSelect);
                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "3")
                {
                    FeedbackSender showPiece = db.FeedbackSender
                   .OrderByDescending(p => p.IdFeedback)
                   .FirstOrDefault();
                    FeedbackSender feedbackSenderTemp = new FeedbackSender();
                    if (showPiece == null)
                    {
                        feedbackSenderTemp.IdFeedback = db.FeedbackSender.Count() + 1;
                    }
                    else
                    {
                        feedbackSenderTemp.IdFeedback = (showPiece.IdFeedback) + 1;
                    }
                    feedbackSenderTemp.SenderIdParent = parentModel.IdParent;

                    Teacher teacher = _userService.GetClassRoomTeacherForClassPupil(db, int.Parse(model.ZeroSelect));
                    feedbackSenderTemp.ReceiverIdTeacher = teacher.IdTeacher;

                    feedbackSenderTemp.FeedbackContent = model.Content;
                    feedbackSenderTemp.TitleFeedBack = model.Title;
                    feedbackSenderTemp.DateOfFeedBack = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            feedbackSenderTemp.Attachements = ms.ToArray();
                            feedbackSenderTemp.AttchFormatExst = model.Attachement.ContentType;
                            feedbackSenderTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.FeedbackSender.Add(feedbackSenderTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача." });
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
        }



        [Authorize(Roles = roleContext.Admin)]
        [HttpPost("CreateAdminAnnouncement")]
        public IActionResult CreateAdminAnnouncement([FromForm] AnnouncementModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Admin adminModel = db.Admin.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                if (model.FirstSelect == "1")
                {
                    AnnouncementSender showPiece = db.AnnouncementSender
                    .OrderByDescending(p => p.IdAnnouncement)
                    .FirstOrDefault();
                    AnnouncementSender announcementTemp = new AnnouncementSender();
                    if (showPiece == null)
                    {
                        announcementTemp.IdAnnouncement = db.AnnouncementSender.Count() + 1;
                    }
                    else
                    {
                        announcementTemp.IdAnnouncement = (showPiece.IdAnnouncement) + 1;
                    }
                    announcementTemp.IdAdminSender = adminModel.IdAdmin;
                    announcementTemp.IdSubject = int.Parse(model.SecondSelect);
                    announcementTemp.AnnouncementContent = model.Content;
                    announcementTemp.TitleAnnouncement = model.Title;
                    announcementTemp.Actual = true;
                    announcementTemp.DateOfAnnouncement = DateTime.Today;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            announcementTemp.Attachements = ms.ToArray();
                            announcementTemp.AttchFormatExst = model.Attachement.ContentType;
                            announcementTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.AnnouncementSender.Add(announcementTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "2")
                {
                    AnnouncementSender showPiece = db.AnnouncementSender
                   .OrderByDescending(p => p.IdAnnouncement)
                   .FirstOrDefault();
                    AnnouncementSender announcementTemp = new AnnouncementSender();
                    if (showPiece == null)
                    {
                        announcementTemp.IdAnnouncement = db.AnnouncementSender.Count() + 1;
                    }
                    else
                    {
                        announcementTemp.IdAnnouncement = (showPiece.IdAnnouncement) + 1;
                    }
                    announcementTemp.IdAdminSender = adminModel.IdAdmin;
                    announcementTemp.IdFlow = int.Parse(model.SecondSelect);
                    announcementTemp.AnnouncementContent = model.Content;
                    announcementTemp.TitleAnnouncement = model.Title;
                    announcementTemp.DateOfAnnouncement = DateTime.Today;
                    announcementTemp.Actual = true;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            announcementTemp.Attachements = ms.ToArray();
                            announcementTemp.AttchFormatExst = model.Attachement.ContentType;
                            announcementTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.AnnouncementSender.Add(announcementTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "3")
                {
                    AnnouncementSender showPiece = db.AnnouncementSender
                   .OrderByDescending(p => p.IdAnnouncement)
                   .FirstOrDefault();
                    AnnouncementSender announcementTemp = new AnnouncementSender();
                    if (showPiece == null)
                    {
                        announcementTemp.IdAnnouncement = db.AnnouncementSender.Count() + 1;
                    }
                    else
                    {
                        announcementTemp.IdAnnouncement = (showPiece.IdAnnouncement) + 1;
                    }
                    announcementTemp.IdAdminSender = adminModel.IdAdmin;
                    announcementTemp.IdRole = int.Parse(model.SecondSelect);
                    announcementTemp.AnnouncementContent = model.Content;
                    announcementTemp.TitleAnnouncement = model.Title;
                    announcementTemp.DateOfAnnouncement = DateTime.Today;
                    announcementTemp.Actual = true;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            announcementTemp.Attachements = ms.ToArray();
                            announcementTemp.AttchFormatExst = model.Attachement.ContentType;
                            announcementTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.AnnouncementSender.Add(announcementTemp);
                    db.SaveChanges();
                }
                else if (model.FirstSelect == "4")
                {
                    AnnouncementSender showPiece = db.AnnouncementSender
                   .OrderByDescending(p => p.IdAnnouncement)
                   .FirstOrDefault();
                    AnnouncementSender announcementTemp = new AnnouncementSender();
                    if (showPiece == null)
                    {
                        announcementTemp.IdAnnouncement = db.AnnouncementSender.Count() + 1;
                    }
                    else
                    {
                        announcementTemp.IdAnnouncement = (showPiece.IdAnnouncement) + 1;
                    }
                    announcementTemp.IdAdminSender = adminModel.IdAdmin;
                    Classes tempClass = db.Classes.Where(clEnt => clEnt.ClassLetter == int.Parse(model.ThirdSelect) &&clEnt.FlowNumber == int.Parse(model.SecondSelect)).FirstOrDefault();
                    announcementTemp.IdClass = tempClass.IdClass;

                    announcementTemp.AnnouncementContent = model.Content;
                    announcementTemp.TitleAnnouncement = model.Title;
                    announcementTemp.DateOfAnnouncement = DateTime.Today;
                    announcementTemp.Actual = true;
                    if (model.Attachement != null)
                    {
                        using (var ms = new MemoryStream())
                        {
                            model.Attachement.CopyTo(ms);
                            announcementTemp.Attachements = ms.ToArray();
                            announcementTemp.AttchFormatExst = model.Attachement.ContentType;
                            announcementTemp.Filename = model.Attachement.FileName;
                        }
                    }
                    db.AnnouncementSender.Add(announcementTemp);
                    db.SaveChanges();
                }
                else
                    return BadRequest(new { message = "Будь ласка оберіть тип отримувача." });
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" + ex });
            }
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpPost("CreateTeacherPost")]
        public IActionResult CreateTeacherPost([FromForm] TeacherPostModel model)
        {
            try
            {
                string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;

                Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();


                TeacherPost showPiece = db.TeacherPost
                .OrderByDescending(p => p.IdPost)
                .FirstOrDefault();
                TeacherPost postTemp = new TeacherPost();
                if (showPiece == null)
                {
                    postTemp.IdPost = db.TeacherPost.Count() + 1;
                }
                else
                {
                    postTemp.IdPost = (showPiece.IdPost) + 1;
                }
                postTemp.IdTeacher = teacherModel.IdTeacher;
                postTemp.IdSubject = int.Parse(model.FirstSelect);
                postTemp.IdFlow = int.Parse(model.SecondSelect);
                postTemp.Title = model.Title;
                postTemp.PostContent = model.Content;
                postTemp.DateOfPost = DateTime.Today;
                if (model.Attachement != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        model.Attachement.CopyTo(ms);
                        postTemp.Attachements = ms.ToArray();
                        postTemp.AttchFormatExst = model.Attachement.ContentType;
                        postTemp.Filename = model.Attachement.FileName;
                    }
                }
                db.TeacherPost.Add(postTemp);
                db.SaveChanges();


                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetClassRoomTeacherForClassPupil")]
        public IActionResult GetTeacherOfClassByStudent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil studentModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var teacher = _userService.GetClassRoomTeacherForClassPupil(db, studentModel.IdPupil);
            if (teacher != null)
            {
                return Ok(JsonConvert.SerializeObject(teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetClassRoomTeacherForClassPupilParent/{studentid}")]
        public IActionResult GetClassRoomTeacherForClassPupilParent(int studentId)
        {
            var teacher = _userService.GetClassRoomTeacherForClassPupil(db, studentId);
            if (teacher != null)
            {
                return Ok(JsonConvert.SerializeObject(teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }



        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllClassLettersBySubjectAndTeacherAndFlow/{idFlow}/{idSubject}")]
        public IActionResult GetAllClassLettersBySubjectAndTeacherAndFlow(int idFlow, int idSubject)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var classLetters = _userService.GetAllClassLettersBySubjectAndTeacherAndFlow(db, teacherModel.IdTeacher, idFlow, idSubject);

            List<SelectModel> lettersSelect = new List<SelectModel>();
            foreach (ClassLetters letter in classLetters)
            {
                lettersSelect.Add(new SelectModel(letter.IdLetter.ToString(), letter.ClassLetter));
            }
            return Ok(lettersSelect);

        }
        
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllHomeworkTitlesBySubjectAndTeacherAndClass/{idFlow}/{idSubject}")]
        public IActionResult GetAllHomeworkTitlesBySubjectAndTeacherAndClass(int idFlow, int idSubject)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var hwInfoList = _userService.GetAllHomeworkTitlesBySubjectAndTeacherAndClass(db, teacherModel.IdTeacher, idFlow, idSubject);
            hwInfoList = hwInfoList.OrderByDescending(hwInfo => hwInfo.IdHomework);

            List<SelectModel> hwsSelect = new List<SelectModel>();
            hwsSelect.Add(new SelectModel("-1", ""));
            foreach (HomeworkInfo hw in hwInfoList)
            {
                hwsSelect.Add(new SelectModel(hw.IdHomework.ToString(), hw.Title));
            }
            return Ok(hwsSelect);
        }

        
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllHomeworkSubmissionBySubjectAndTeacherAndClass/{idClassLetter}/{idFlow}/{idSubject}")]
        public IActionResult GetAllHomeworkSubmissionBySubjectAndTeacherAndClass(int idClassLetter, int idFlow, int idSubject)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List<HomeworkInfo> homeworkInfoList = db.HomeworkInfo.Where(hwInfoModel => hwInfoModel.IdSubject == idSubject && hwInfoModel.IdTeacher == teacherModel.IdTeacher).ToList();

            List<Pupil> pupilList = _userService.GetAllStudentsForClass(db, idFlow, idClassLetter).ToList();
            List<HomeworkSubmission> homeworkSubmList = db.HomeworkSubmission.Where(hwSub => pupilList.Select(pupilEntity => pupilEntity.IdPupil).Contains(hwSub.StudentId)).ToList();
            homeworkSubmList = db.HomeworkSubmission.Where(hwSub => homeworkInfoList.Select(hwInfoEntity => hwInfoEntity.IdHomework).Contains(hwSub.HomeworkId)).OrderByDescending(hwSub => hwSub.IdSubmission).ToList();

            List <HomeworkSubmissionModel> homeworkSubmInfo = new List<HomeworkSubmissionModel>();
            if(homeworkSubmList != null)
            foreach (HomeworkSubmission hw in homeworkSubmList)
            {
                HomeworkInfo homeworkInfoTemp = db.HomeworkInfo.Where(hwInfoModel => hwInfoModel.IdHomework == hw.HomeworkId).FirstOrDefault();
                Pupil studentTemp = pupilList.Where(studentEntity => studentEntity.IdPupil == hw.StudentId).FirstOrDefault();
                if (studentTemp != null)
                {
                    if (DateTime.Compare(hw.DateOfSubmission, homeworkInfoTemp.DueDate) <= 0)
                        homeworkSubmInfo.Add(new HomeworkSubmissionModel(hw.IdSubmission, hw.Comments, hw.DateOfSubmission, studentTemp.Name + " " + studentTemp.Patronymic + " " + studentTemp.Surname, hw.Filename, homeworkInfoTemp.Title, "Вчасно.", "LightGreen"));
                    else
                        homeworkSubmInfo.Add(new HomeworkSubmissionModel(hw.IdSubmission, hw.Comments, hw.DateOfSubmission, studentTemp.Name + " " + studentTemp.Patronymic + " " + studentTemp.Surname, hw.Filename, homeworkInfoTemp.Title, "З запізненням.", "LightCoral"));
                }
            }
            return Ok(homeworkSubmInfo);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle/{idSubject}/{idFlow}/{idClassLetter}/{idStudent}/{idHWTitle}")]
        public IActionResult GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle(int idSubject, int idFlow, int idClassLetter, int idStudent, int idHWTitle)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List<HomeworkInfo> homeworkInfoList = new List<HomeworkInfo>();
            List<HomeworkSubmission> homeworkSubmList = new List<HomeworkSubmission>();          
            
            if (idHWTitle == -1)
            {
                homeworkInfoList = db.HomeworkInfo.Where(hwInfoModel => hwInfoModel.IdSubject == idSubject && hwInfoModel.IdTeacher == teacherModel.IdTeacher).ToList();
            }
            else
            {
                homeworkInfoList = db.HomeworkInfo.Where(hwInfoModel => hwInfoModel.IdHomework == idHWTitle).ToList();
            }

            if (idStudent == -1)
            {
                List<Pupil> pupilList = _userService.GetAllStudentsForClass(db, idFlow, idClassLetter).ToList();
                homeworkSubmList = db.HomeworkSubmission.Where(hwSub => pupilList.Select(pupilEntity => pupilEntity.IdPupil).Contains(hwSub.StudentId)).ToList();
                homeworkSubmList = homeworkSubmList.Where(hwSub => homeworkInfoList.Select(hwInfoEntity => hwInfoEntity.IdHomework).Contains(hwSub.HomeworkId)).OrderByDescending(hwSub => hwSub.IdSubmission).ToList();
            }
            else 
            {
                homeworkSubmList = db.HomeworkSubmission.Where(hwSub => hwSub.StudentId == idStudent).ToList();
                homeworkSubmList = homeworkSubmList.Where(hwSub => homeworkInfoList.Select(hwInfoEntity => hwInfoEntity.IdHomework).Contains(hwSub.HomeworkId)).OrderByDescending(hwSub => hwSub.IdSubmission).ToList();
            }
           

            List<HomeworkSubmissionModel> homeworkSubmInfo = new List<HomeworkSubmissionModel>();
            if(homeworkSubmList!=null)
            foreach (HomeworkSubmission hw in homeworkSubmList)
            {
                HomeworkInfo homeworkInfoTemp = db.HomeworkInfo.Where(hwInfoModel => hwInfoModel.IdHomework == hw.HomeworkId).FirstOrDefault();
                Pupil studentTemp = db.Pupil.Where(studentEntity => studentEntity.IdPupil == hw.StudentId).FirstOrDefault();

                if (DateTime.Compare(hw.DateOfSubmission, homeworkInfoTemp.DueDate) <= 0)
                    homeworkSubmInfo.Add(new HomeworkSubmissionModel(hw.IdSubmission, hw.Comments, hw.DateOfSubmission, studentTemp.Name + " " + studentTemp.Patronymic + " " + studentTemp.Surname, hw.Filename, homeworkInfoTemp.Title, "Вчасно.", "LightGreen"));
                else
                    homeworkSubmInfo.Add(new HomeworkSubmissionModel(hw.IdSubmission, hw.Comments, hw.DateOfSubmission, studentTemp.Name + " " + studentTemp.Patronymic + " " + studentTemp.Surname, hw.Filename, homeworkInfoTemp.Title, "З запізненням.", "LightCoral"));
            }
            return Ok(homeworkSubmInfo);
        }

        [Authorize]
        [HttpGet("classes")]
        public IActionResult GetAllClasses()
        {
            var classes = _userService.GetAllClasses(db);
            return Ok(classes);
        }

        [AllowAnonymous]
        [HttpGet("genders")]
        public IActionResult GetAllGenders()
        {
            var genders = _userService.GetAllGenders(db);
            return Ok(genders);
        }
        [Authorize]
        [HttpGet("subjects")]
        public IActionResult GetAllSubjects()
        {
            var subjects = _userService.GetAllSubjects(db);
            List<SelectModel> subjectsSelect = new List<SelectModel>();
            foreach (Subject subject in subjects)
            {
                subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
            }
            return Ok(subjectsSelect);
        }

        [Authorize]
        [HttpGet("GetAllSubjectsTeacher/{id}")]
        public IActionResult GetAllSubjectsTeacher(int id)
        {
            var subjectsTeacher = db.SubjectTeacher.Where(subjectTeacherEntity => subjectTeacherEntity.TeacherId == id).ToList();
            List<Subject> subjects = db.Subject.ToList().Where(subject => subjectsTeacher.Select(subjectTeacherEntity => subjectTeacherEntity.SubjectId).Contains(subject.IdSubject)).ToList();
            List<SelectModel> subjectsSelect = new List<SelectModel>();
            foreach (Subject subject in subjects)
            {
                subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
            }
            return Ok(subjectsSelect);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllSubjectsAdmin")]
        public IActionResult GetAllSubjectsAdmin()
        {         
            List<Subject> subjects = db.Subject.ToList();
            List<SelectModel> subjectsSelect = new List<SelectModel>();
            subjectsSelect.Add(new SelectModel("-1", "Усі предмети"));
            foreach (Subject subject in subjects)
            {
                subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
            }
            return Ok(subjectsSelect);
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllTeachersAdminList/{idSubject}")]
        public IActionResult GetAllTeachersAdminList(int idSubject)
        {
            List<Teacher> teachers = new List<Teacher>();
            if (idSubject == -1)
              teachers = _userService.GetAllTeachers(db).ToList();
            else
            {
                List<SubjectTeacher> teacherSubject = db.SubjectTeacher.Where(subjectEntity => subjectEntity.SubjectId == idSubject).ToList();
                teachers = db.Teacher.Where(teacher => teacherSubject.Select(subjectTeacherEntity => subjectTeacherEntity.TeacherId).Contains(teacher.IdTeacher)).ToList();
            }
            if (teachers != null)
            {
                List<TeacherModelForAdmin> teachersList = new List<TeacherModelForAdmin>();
                foreach (Teacher teacher in teachers)
                {
                    List<SubjectTeacher> teacherSubject = db.SubjectTeacher.Where(teacherEntity => teacherEntity.TeacherId == teacher.IdTeacher).ToList();
                    List<Subject> subjectList = db.Subject.Where(subject => teacherSubject.Select(subjectTeacherEntity => subjectTeacherEntity.SubjectId).Contains(subject.IdSubject)).ToList();
                    string subjectString = "";
                    foreach (Subject subject in subjectList)
                    {
                        subjectString += subject.SubjectName + ", ";
                    }
                    teachersList.Add(new TeacherModelForAdmin(teacher.IdTeacher, teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname, teacher.Email, teacher.Phone, teacher.Adress, teacher.DateOfBirth, subjectString, teacher.ImageOfTeacher));

                }
                return Ok(teachersList);
            }
            else
                return BadRequest(new { message = "На жаль, в школі ще нема вчителів!" });
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllStudentsAdmin/{idFlow}/{idClassLetter}")]
        public IActionResult GetAllStudentsAdmin(int idFlow, int idClassLetter)
        {
            Classes classModel = db.Classes.Where(classesEntity => classesEntity.FlowNumber == idFlow && classesEntity.ClassLetter == idClassLetter).FirstOrDefault();
            ClassLetters classLetterEntity = db.ClassLetters.Where(classLetterEntity => classLetterEntity.IdLetter == idClassLetter).FirstOrDefault();
            List<ClassStudent> classStudentList = db.ClassStudent.Where(classesEntity => classesEntity.IdClass == classModel.IdClass).ToList();
            List<Pupil> students = db.Pupil.Where(pupilEntity => classStudentList.Select(classEntity => classEntity.IdStudent).Contains(pupilEntity.IdPupil)).ToList();
            if (students != null)
            {
                List<StudentModelForAdmin> studentsList = new List<StudentModelForAdmin>();
                foreach (Pupil student in students)
                {
                    studentsList.Add(new StudentModelForAdmin(student.IdPupil, student.Name + " " + student.Patronymic + " " + student.Surname, student.Email, student.Phone, student.Adress, student.Moto, student.DateOfBirth, idFlow + " - " + classLetterEntity.ClassLetter, student.ImageOfPupil));

                }
                return Ok(studentsList);
            }
            else
                return BadRequest(new { message = "У цьому класі ще немає учнів!" });
        }

        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllChildrenParent")]
        public IActionResult GetAllChildrenParent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();

            List<ParentStudent> parentStudentList = db.ParentStudent.Where(parStEntity => parStEntity.IdParent == parentModel.IdParent).ToList();
            List<Pupil> students = db.Pupil.Where(pupilEntity => parentStudentList.Select(parStEntity => parStEntity.IdStudent).Contains(pupilEntity.IdPupil)).ToList();
            if (students != null)
            {
                List<StudentModelForAdmin> studentsList = new List<StudentModelForAdmin>();
                foreach (Pupil student in students)
                {
                    ClassStudent classStudentTemp = db.ClassStudent.Where(stEntity => stEntity.IdStudent == student.IdPupil).FirstOrDefault();
                    Classes classTemp = db.Classes.Where(clEntity => clEntity.IdClass == classStudentTemp.IdClass).FirstOrDefault();
                    ClassLetters clTemp = db.ClassLetters.Where(ltEntity => ltEntity.IdLetter == classTemp.ClassLetter).FirstOrDefault();
                    studentsList.Add(new StudentModelForAdmin(student.IdPupil, student.Name + " " + student.Patronymic + " " + student.Surname, student.Email, student.Phone, student.Adress, student.Moto, student.DateOfBirth, classTemp.FlowNumber + " - " + clTemp.ClassLetter, student.ImageOfPupil));

                }
                return Ok(studentsList);
            }
            else
                return BadRequest(new { message = "Додайте одного з ваших дітей..." });
        }


        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllAdminsForAdmin")]
        public IActionResult GetAllAdminsForAdmin()
        {
            List<Admin> admins = _userService.GetAllAdmins(db).ToList();
            if (admins != null)
            {
                List<AdminModelForAdmin> adminsList = new List<AdminModelForAdmin>();
                foreach (Admin admin in admins)
                {
                    adminsList.Add(new AdminModelForAdmin(admin.IdAdmin, admin.Name + " " + admin.Patronymic + " " + admin.Surname, admin.Email, admin.Phone, admin.Description, admin.DateOfBirth));

                }
                return Ok(adminsList);
            }
            else
                return BadRequest(new { message = "Помилка на сервері!" });
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllClassesByFlowAdmin/{flowId}")]
        public IActionResult GetAllClassesByFlowAdmin(int flowId)
        {
            List<Classes> classList = db.Classes.Where(classesEntity => classesEntity.FlowNumber == flowId).ToList();
            
            if (classList != null)
            {
                List<ClassesModelForAdmin> classAdminList = new List<ClassesModelForAdmin>();
                foreach (Classes classEntity in classList)
                {
                    ClassLetters classLetterModel = db.ClassLetters.Where(classLetterEntity => classLetterEntity.IdLetter == classEntity.ClassLetter).FirstOrDefault();
                    Teacher teacherModel = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == classEntity.IdClassroomTeacher).FirstOrDefault();
                    List<ClassStudent> amountStudents = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdClass == classEntity.IdClass).ToList();
                    classAdminList.Add(new ClassesModelForAdmin(classEntity.IdClass, classEntity.FlowNumber + " - " + classLetterModel.ClassLetter, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, amountStudents.Count(), classEntity.AccessCode));

                }
                return Ok(classAdminList);
            }
            else
                return BadRequest(new { message = "На цій паралелі ще немає класів!" });
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllHomeworkInfoTeacher/{subjectId}")]
        public IActionResult GetAllHomeworkInfoTeacher(int subjectId)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();

            List<HomeworkInfo> homeworkInfoList = db.HomeworkInfo.Where(hwInfoEntity => hwInfoEntity.IdSubject == subjectId && hwInfoEntity.IdTeacher == teacherModel.IdTeacher).ToList();

            if (homeworkInfoList != null)
            {
                List<HomeworkInfoForTeacher> hwInfoTeacherList = new List<HomeworkInfoForTeacher>();
                foreach (HomeworkInfo hwInfoEntity in homeworkInfoList)
                {
                    string hwFileCheck = "nodata";
                    if (hwInfoEntity.Filename != null)
                    {
                        hwFileCheck = hwInfoEntity.Filename;
                    }
                    hwInfoTeacherList.Add(new HomeworkInfoForTeacher(hwInfoEntity.IdHomework, hwInfoEntity.Description, hwInfoEntity.DueDate, hwInfoEntity.IdFlow, hwFileCheck, hwInfoEntity.Title));

                }
                return Ok(hwInfoTeacherList);
            }
            else
                return BadRequest(new { message = "Будь ласка опублікуйте хоча б одне домашнє завдання з цього предмету!" });
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllPostsInfoTeacher/{subjectId}")]
        public IActionResult GetAllPostsInfoTeacher(int subjectId)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();

            List<TeacherPost> teacherPostList = db.TeacherPost.Where(postEntity => postEntity.IdSubject == subjectId && postEntity.IdTeacher == teacherModel.IdTeacher).ToList();

            if (teacherPostList != null)
            {
                List<TeacherPostForTeacher> PostTeacherList = new List<TeacherPostForTeacher>();
                foreach (TeacherPost postEntity in teacherPostList)
                {
                    string hwFileCheck = "nodata";
                    if (postEntity.Filename != null)
                    {
                        hwFileCheck = postEntity.Filename;
                    }
                    PostTeacherList.Add(new TeacherPostForTeacher(postEntity.IdPost, postEntity.Title, postEntity.DateOfPost, postEntity.IdFlow, hwFileCheck, postEntity.PostContent));
                }
                return Ok(PostTeacherList);
            }
            else
                return BadRequest(new { message = "Будь ласка опублікуйте хоча б один пост з цього предмету!" });
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllAnnouncementsForAdmin")]
        public IActionResult GetAllAnnouncementsForAdmin(int subjectId)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Admin adminModel = db.Admin.Where(adminEntity => adminEntity.Email == emailCurrentUser).FirstOrDefault();

            List<AnnouncementSender> announcementsList = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdAdminSender == adminModel.IdAdmin).ToList();

            if (announcementsList != null)
            {
                List<AnnouncementForAdmin> announcementAdminList = new List<AnnouncementForAdmin>();
                foreach (AnnouncementSender announcementEntity in announcementsList)
                {
                    string actual = "", receiver = "";
                    if (announcementEntity.Actual == true)
                    {
                        actual = "Актуальне оголошення";
                    }
                    else
                        actual = "Неактуальне оголошення";

                    if (announcementEntity.IdClass != null)
                    {
                        Classes classesModel = db.Classes.Where(classEntity => classEntity.IdClass == announcementEntity.IdClass).FirstOrDefault();
                        ClassLetters classLettersModel = db.ClassLetters.Where(classLetterEntity => classLetterEntity.IdLetter == classesModel.ClassLetter).FirstOrDefault();
                        receiver = classesModel.FlowNumber + " - " + classLettersModel.ClassLetter + " клас";
                    }
                    else if (announcementEntity.IdFlow != null)
                    {                                     
                        receiver = announcementEntity.IdFlow +  " паралель";
                    }
                    else if (announcementEntity.IdRole != null)
                    {
                        if (announcementEntity.IdRole == 1)
                        {
                            receiver = "Для всіх адміністраторів";
                        }
                        else if (announcementEntity.IdRole == 2)
                        {
                            receiver = "Для всіх учнів";
                        }
                        else if (announcementEntity.IdRole == 3)
                        {
                            receiver = "Для всіх батьків";
                        }
                        else 
                        {
                            receiver = "Для всіх вчителів";
                        }
                    }
                    else 
                    {
                        Subject subjectModel = db.Subject.Where(subjectEntity => subjectEntity.IdSubject == announcementEntity.IdSubject).FirstOrDefault();
                        receiver = "Вчителі з предмету \"" + subjectModel.SubjectName + "\"";
                    }


                    announcementAdminList.Add(new AnnouncementForAdmin(announcementEntity.IdAnnouncement, announcementEntity.AnnouncementContent, announcementEntity.DateOfAnnouncement, actual, receiver, announcementEntity.Filename, announcementEntity.TitleAnnouncement));
                }
                return Ok(announcementAdminList);
            }
            else
                return BadRequest(new { message = "Будь ласка зробіть хоча б одно оголошення, щоб переглядати даті цієї сторінки!" });
        }




        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllParentsAdmin/{idChild}")]
        public IActionResult GetAllParentsAdmin(int idChild)
        {
            var parents = _userService.GetAllParentOfPupil(db, idChild);
            if (parents != null)
            {
                List<ParentModelForAdmin> parentsList = new List<ParentModelForAdmin>();
                foreach (Parent parent in parents)
                {
                    parentsList.Add(new ParentModelForAdmin(parent.IdParent, parent.Name + " " + parent.Patronymic + " " + parent.Surname, parent.Email, parent.Phone, parent.Adress, parent.WorkPlace, parent.DateOfBirth));
                }
                return Ok(parentsList);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }































        [Authorize]
        [HttpGet("roles")]
        public IActionResult GetAllRoles()
        {
            var roles = _userService.GetAllRoles(db);
            List<SelectModel> rolesSelect = new List<SelectModel>();
            foreach (Roles role in roles)
            {              
                rolesSelect.Add(new SelectModel(role.IdRole.ToString(), role.Role));
            }
            return Ok(rolesSelect);
        }

        [Authorize]
        [HttpGet("GetAllSubjectsPupil")]
        public IActionResult GetAllSubjectsPupil()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil studentModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var subjects = _userService.GetAllSubjectsPupil(db, studentModel.IdPupil);

            List<SelectModel> subjectsSelect = new List<SelectModel>();
            foreach (Subject subject in subjects)
            {
                subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
            }
            return Ok(subjectsSelect);
        }

        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllChildsParent")]
        public IActionResult GetAllChildsParent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var pupils = _userService.GetAllChildParent(db, parentModel.IdParent);

            List<SelectModel> pupilsSelect = new List<SelectModel>();
            foreach (Pupil pupil in pupils)
            {
                pupilsSelect.Add(new SelectModel(pupil.IdPupil.ToString(), pupil.Name + " " + pupil.Patronymic + " " + pupil.Surname));
            }
            return Ok(pupilsSelect);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetStudentsClassroomTeacher")]
        public IActionResult GetStudentsClassroomTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var pupils = _userService.GetStudentsClassroomTeacher(db, teacherModel.IdTeacher);

            if (pupils == null)
            {
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
            }
            List<SelectModel> pupilsSelect = new List<SelectModel>();
            foreach (Pupil pupil in pupils)
            {
                pupilsSelect.Add(new SelectModel(pupil.IdPupil.ToString(), pupil.Name + " " + pupil.Patronymic + " " + pupil.Surname));
            }
            return Ok(pupilsSelect);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("CheckTeacherForClassroomTeacher")]
        public IActionResult CheckTeacherForClassroomTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClassroomTeacher == teacherModel.IdTeacher).FirstOrDefault();

            if (classModel != null)
                return Content("true");
            else { return Content("false"); }
        }

        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetAllHomeworkBySubjectPupil/{id}")]
        public IActionResult GetAllHomeworkBySubjectPupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            ClassStudent classStudentModel = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == pupilModel.IdPupil).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModel.IdClass).FirstOrDefault();

            List<HomeworkInfo>  hwModelList = db.HomeworkInfo.Where(hwEntity => hwEntity.IdFlow == classModel.FlowNumber && hwEntity.IdSubject == id).ToList();

            List<HomeworkInfoModel> homeworkInfo = new List<HomeworkInfoModel>();
            foreach (HomeworkInfo hw in hwModelList)
            {
                Teacher teacherModel = db.Teacher.Where(teaherEntity => teaherEntity.IdTeacher == hw.IdTeacher).FirstOrDefault();
                HomeworkSubmission hwSubModel = db.HomeworkSubmission.Where(hwEntity => hwEntity.HomeworkId == hw.IdHomework && hwEntity.StudentId == pupilModel.IdPupil).FirstOrDefault();
                string hwFileCheck = "nodata";
                if(hw.Filename != null)
                {
                    hwFileCheck = hw.Filename;
                }
              if(hwSubModel != null)
                homeworkInfo.Add(new HomeworkInfoModel(hw.IdHomework, hw.Description, hw.DueDate, teacherModel.Name +  " " + teacherModel.Patronymic + " " + teacherModel.Surname, hwFileCheck, hw.Title, "Зроблено."));
              else
                homeworkInfo.Add(new HomeworkInfoModel(hw.IdHomework, hw.Description, hw.DueDate, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, hwFileCheck, hw.Title, "Очікує завантаження..."));
            }
            return Ok(homeworkInfo);
        }


        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetAllPostsBySubjectPupil/{id}")]
        public IActionResult GetAllPostsBySubjectPupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            ClassStudent classStudentModel = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == pupilModel.IdPupil).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModel.IdClass).FirstOrDefault();

            List<TeacherPost> postModelList = db.TeacherPost.Where(postEntity => postEntity.IdFlow == classModel.FlowNumber && postEntity.IdSubject == id).ToList();

            List<TeacherPostWatchModel> postInfo = new List<TeacherPostWatchModel>();
            foreach (TeacherPost post in postModelList)
            {
                Teacher teacherModel = db.Teacher.Where(teaherEntity => teaherEntity.IdTeacher == post.IdTeacher).FirstOrDefault();
                string hwFileCheck = "nodata";
                if (post.Filename != null)
                {
                    hwFileCheck = post.Filename;
                }

                postInfo.Add(new TeacherPostWatchModel(post.IdPost, teacherModel.Name + " " + teacherModel.Patronymic + " " + teacherModel.Surname, post.Title, post.PostContent, hwFileCheck, post.DateOfPost));
            }
            return Ok(postInfo);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllAnnouncementTeacher")]
        public IActionResult GetAllAnnouncementTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            List <SubjectTeacher> subjectTeacherModelList = db.SubjectTeacher.Where(subjectTeachertEntity => subjectTeachertEntity.TeacherId == teacherModel.IdTeacher).ToList();


            List<AnnouncementSender> announcementListSubject = db.AnnouncementSender.Where(announcementEntity => subjectTeacherModelList.Select(stEntity => stEntity.SubjectId).ToList().Contains((int)announcementEntity.IdSubject)).ToList();
            List<AnnouncementSender> announcementListRole = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdRole == 4).ToList();
            List<AnnouncementsWatchModel> announcementsInfo = new List<AnnouncementsWatchModel>();
            
            foreach (AnnouncementSender anncmnt in announcementListSubject)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (anncmnt.Filename != null)
                    {
                        hwFileCheck = anncmnt.Filename;
                    }
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }
            }
            foreach (AnnouncementSender anncmnt in announcementListRole)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                string hwFileCheck = "nodata";
                if (anncmnt.Filename != null)
                {
                    hwFileCheck = anncmnt.Filename;
                }         
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }               
            }
            return Ok(announcementsInfo.OrderByDescending(p => p.idAnnouncement));
        }


        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetAllAnnouncementStudent")]
        public IActionResult GetAllAnnouncementStudent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            ClassStudent classStudentModelList = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == pupilModel.IdPupil).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModelList.IdClass).FirstOrDefault();

            List<AnnouncementSender> announcementListClass = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdClass == classModel.IdClass || announcementEntity.IdFlow == classModel.FlowNumber).ToList();
            List<AnnouncementSender> announcementListRole = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdRole == 2).ToList();
            List<AnnouncementsWatchModel> announcementsInfo = new List<AnnouncementsWatchModel>();

            foreach (AnnouncementSender anncmnt in announcementListClass)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (anncmnt.Filename != null)
                    {
                        hwFileCheck = anncmnt.Filename;
                    }
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }
            }
            foreach (AnnouncementSender anncmnt in announcementListRole)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (anncmnt.Filename != null)
                    {
                        hwFileCheck = anncmnt.Filename;
                    }
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }
            }
            return Ok(announcementsInfo.OrderByDescending(p => p.idAnnouncement));
        }

        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllAnnouncementParent")]
        public IActionResult GetAllAnnouncementParent()
        {
            
            List<AnnouncementSender> announcementListRole = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdRole == 3).ToList();
            List<AnnouncementsWatchModel> announcementsInfo = new List<AnnouncementsWatchModel>();         
            foreach (AnnouncementSender anncmnt in announcementListRole)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (anncmnt.Filename != null)
                    {
                        hwFileCheck = anncmnt.Filename;
                    }
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }
            }
            return Ok(announcementsInfo.OrderByDescending(p => p.idAnnouncement));
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllAnnouncementAdmin")]
        public IActionResult GetAllAnnouncementAdmin()
        {

            List<AnnouncementSender> announcementListRole = db.AnnouncementSender.Where(announcementEntity => announcementEntity.IdRole == 1).ToList();
            List<AnnouncementsWatchModel> announcementsInfo = new List<AnnouncementsWatchModel>();
            foreach (AnnouncementSender anncmnt in announcementListRole)
            {
                if (anncmnt.Actual == true)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == anncmnt.IdAdminSender).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (anncmnt.Filename != null)
                    {
                        hwFileCheck = anncmnt.Filename;
                    }
                    announcementsInfo.Add(new AnnouncementsWatchModel(anncmnt.IdAnnouncement, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, anncmnt.TitleAnnouncement, anncmnt.AnnouncementContent, hwFileCheck, anncmnt.DateOfAnnouncement));
                }
            }
            return Ok(announcementsInfo.OrderByDescending(p => p.idAnnouncement));
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllFeedbackTeacher")]
        public IActionResult GetAllFeedbackTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
         
            List<FeedbackSender> feedbackList = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdTeacher == teacherModel.IdTeacher).ToList();
            List<FeedBackWatchModel> feedbackInfo = new List<FeedBackWatchModel>();
            foreach (FeedbackSender feedback in feedbackList)
            {
                if (feedback.SenderIdAdmin != null)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == feedback.SenderIdAdmin).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdParent != null)
                {
                    Parent parentModel = db.Parent.Where(parentEntity => parentEntity.IdParent == feedback.SenderIdParent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, parentModel.Name + " " + parentModel.Patronymic + " " + parentModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdStudent != null)
                {
                    Pupil pupilModel = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == feedback.SenderIdStudent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, pupilModel.Name + " " + pupilModel.Patronymic + " " + pupilModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }

                else {
                    Teacher teacherSender = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == feedback.SenderIdTeacher).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, teacherSender.Name + " " + teacherSender.Patronymic + " " + teacherSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
            }          
            return Ok(feedbackInfo.OrderByDescending(p => p.DateOfFeedback));
        }
        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetAllFeedbackStudent")]
        public IActionResult GetAllFeedbackStudent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil pupilModel = db.Pupil.Where(pupilEntity => pupilEntity.Email == emailCurrentUser).FirstOrDefault();

            List<FeedbackSender> feedbackList = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdStudent == pupilModel.IdPupil).ToList();
            List<FeedBackWatchModel> feedbackInfo = new List<FeedBackWatchModel>();
            foreach (FeedbackSender feedback in feedbackList)
            {
                if (feedback.SenderIdAdmin != null)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == feedback.SenderIdAdmin).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdParent != null)
                {
                    Parent parentModel = db.Parent.Where(parentEntity => parentEntity.IdParent == feedback.SenderIdParent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, parentModel.Name + " " + parentModel.Patronymic + " " + parentModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdStudent != null)
                {
                    Pupil pupilSender = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == feedback.SenderIdStudent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, pupilSender.Name + " " + pupilSender.Patronymic + " " + pupilSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }

                else
                {
                    Teacher teacherSender = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == feedback.SenderIdTeacher).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, teacherSender.Name + " " + teacherSender.Patronymic + " " + teacherSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
            }
            return Ok(feedbackInfo.OrderByDescending(p => p.DateOfFeedback));
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetAllFeedbackParent")]
        public IActionResult GetAllFeedbackParent()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Parent parentModel = db.Parent.Where(parentEntity => parentEntity.Email == emailCurrentUser).FirstOrDefault();

            List<FeedbackSender> feedbackList = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdParent == parentModel.IdParent).ToList();
            List<FeedBackWatchModel> feedbackInfo = new List<FeedBackWatchModel>();
            foreach (FeedbackSender feedback in feedbackList)
            {
                if (feedback.SenderIdAdmin != null)
                {
                    Admin adminModel = db.Admin.Where(adminEntity => adminEntity.IdAdmin == feedback.SenderIdAdmin).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, adminModel.Name + " " + adminModel.Patronymic + " " + adminModel.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdParent != null)
                {
                    Parent parentSender = db.Parent.Where(parentEntity => parentEntity.IdParent == feedback.SenderIdParent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, parentSender.Name + " " + parentSender.Patronymic + " " + parentSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdStudent != null)
                {
                    Pupil pupilSender = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == feedback.SenderIdStudent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, pupilSender.Name + " " + pupilSender.Patronymic + " " + pupilSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }

                else
                {
                    Teacher teacherSender = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == feedback.SenderIdTeacher).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, teacherSender.Name + " " + teacherSender.Patronymic + " " + teacherSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
            }
            return Ok(feedbackInfo.OrderByDescending(p => p.DateOfFeedback));
        }

        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetAllFeedbackAdmin")]
        public IActionResult GetAllFeedbackAdmin()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Admin  adminModel = db.Admin.Where(adminEntity => adminEntity.Email == emailCurrentUser).FirstOrDefault();

            List<FeedbackSender> feedbackList = db.FeedbackSender.Where(feedbackEntity => feedbackEntity.ReceiverIdAdmin == adminModel.IdAdmin).ToList();
            List<FeedBackWatchModel> feedbackInfo = new List<FeedBackWatchModel>();
            foreach (FeedbackSender feedback in feedbackList)
            {
                if (feedback.SenderIdAdmin != null)
                {
                    Admin adminSender = db.Admin.Where(adminEntity => adminEntity.IdAdmin == feedback.SenderIdAdmin).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, adminSender.Name + " " + adminSender.Patronymic + " " + adminSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdParent != null)
                {
                    Parent parentSender = db.Parent.Where(parentEntity => parentEntity.IdParent == feedback.SenderIdParent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, parentSender.Name + " " + parentSender.Patronymic + " " + parentSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
                else if (feedback.SenderIdStudent != null)
                {
                    Pupil pupilSender = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == feedback.SenderIdStudent).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, pupilSender.Name + " " + pupilSender.Patronymic + " " + pupilSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }

                else
                {
                    Teacher teacherSender = db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == feedback.SenderIdTeacher).FirstOrDefault();
                    string hwFileCheck = "nodata";
                    if (feedback.Filename != null)
                    {
                        hwFileCheck = feedback.Filename;
                    }
                    feedbackInfo.Add(new FeedBackWatchModel(feedback.IdFeedback, teacherSender.Name + " " + teacherSender.Patronymic + " " + teacherSender.Surname, feedback.TitleFeedBack, feedback.FeedbackContent, hwFileCheck, feedback.DateOfFeedBack));
                }
            }
            return Ok(feedbackInfo.OrderByDescending(p => p.DateOfFeedback));
        }





        [Authorize]
        [HttpGet("GetHomeworkFilePupil/{id}")]
        public IActionResult GetHomeworkFilePupil(int id)
        {
            HomeworkInfo hwModel = db.HomeworkInfo.Where(hwEntity => hwEntity.IdHomework == id).FirstOrDefault();
            if (hwModel == null)
                return NotFound();
            else
                return File(hwModel.Attachements, hwModel.AttchFormatExst, hwModel.Filename);
        }

        [Authorize]
        [HttpGet("GetHomeworkFilePupilPost/{id}")]
        public IActionResult GetHomeworkFilePupilPost(int id)
        {
            TeacherPost postModel = db.TeacherPost.Where(hwEntity => hwEntity.IdPost == id).FirstOrDefault();
            if (postModel == null)
                return NotFound();
            else
                return File(postModel.Attachements, postModel.AttchFormatExst, postModel.Filename);
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetHomeworkFileTeacher/{id}")]
        public IActionResult GetHomeworkFileTeacher(int id)
        {
            HomeworkSubmission hwModel = db.HomeworkSubmission.Where(hwEntity => hwEntity.IdSubmission == id).FirstOrDefault();
            if (hwModel == null)
                return NotFound();
            else
                return File(hwModel.HomeworkFile, hwModel.FileFormatAttr, hwModel.Filename);
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetFileTeacherAnnouncement/{id}")]
        public IActionResult GetFileTeacherAnnouncement(int id)
        {
            AnnouncementSender annModel = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == id).FirstOrDefault();
            if (annModel == null)
                return NotFound();
            else
                return File(annModel.Attachements, annModel.AttchFormatExst, annModel.Filename);
        }
        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetFileStudentAnnouncement/{id}")]
        public IActionResult GetFileStudentAnnouncement(int id)
        {
            AnnouncementSender annModel = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == id).FirstOrDefault();
            if (annModel == null)
                return NotFound();
            else
                return File(annModel.Attachements, annModel.AttchFormatExst, annModel.Filename);
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetFileAdminAnnouncement/{id}")]
        public IActionResult GetFileAdminAnnouncement(int id)
        {
            AnnouncementSender annModel = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == id).FirstOrDefault();
            if (annModel == null)
                return NotFound();
            else
                return File(annModel.Attachements, annModel.AttchFormatExst, annModel.Filename);
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetFileParentAnnouncement/{id}")]
        public IActionResult GetFileParentAnnouncement(int id)
        {
            AnnouncementSender annModel = db.AnnouncementSender.Where(annEntity => annEntity.IdAnnouncement == id).FirstOrDefault();
            if (annModel == null)
                return NotFound();
            else
                return File(annModel.Attachements, annModel.AttchFormatExst, annModel.Filename);
        }

        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetFileTeacherFeedback/{id}")]
        public IActionResult GetFileTeacherFeedback(int id)
        {
            FeedbackSender feedbackModel = db.FeedbackSender.Where(annEntity => annEntity.IdFeedback == id).FirstOrDefault();
            if (feedbackModel == null)
                return NotFound();
            else
                return File(feedbackModel.Attachements, feedbackModel.AttchFormatExst, feedbackModel.Filename);
        }
        [Authorize(Roles = roleContext.Pupil)]
        [HttpGet("GetFileStudentFeedback/{id}")]
        public IActionResult GetFileStudentFeedback(int id)
        {
            FeedbackSender feedbackModel = db.FeedbackSender.Where(annEntity => annEntity.IdFeedback == id).FirstOrDefault();
            if (feedbackModel == null)
                return NotFound();
            else
                return File(feedbackModel.Attachements, feedbackModel.AttchFormatExst, feedbackModel.Filename);
        }
        [Authorize(Roles = roleContext.Admin)]
        [HttpGet("GetFileAdminFeedback/{id}")]
        public IActionResult GetFileAdminFeedback(int id)
        {
            FeedbackSender feedbackModel = db.FeedbackSender.Where(annEntity => annEntity.IdFeedback == id).FirstOrDefault();
            if (feedbackModel == null)
                return NotFound();
            else
                return File(feedbackModel.Attachements, feedbackModel.AttchFormatExst, feedbackModel.Filename);
        }
        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetFileParentFeedback/{id}")]
        public IActionResult GetFileParentFeedback(int id)
        {
            FeedbackSender feedbackModel = db.FeedbackSender.Where(annEntity => annEntity.IdFeedback == id).FirstOrDefault();
            if (feedbackModel == null)
                return NotFound();
            else
                return File(feedbackModel.Attachements, feedbackModel.AttchFormatExst, feedbackModel.Filename);
        }













        [Authorize]
        [HttpGet("GetAllSubjectsParent/{studentId}")]
        public IActionResult GetAllSubjectsParent(int studentId)
        {
            var subjects = _userService.GetAllSubjectsPupil(db, studentId);

            List<SelectModel> subjectsSelect = new List<SelectModel>();
            foreach (Subject subject in subjects)
            {
                subjectsSelect.Add(new SelectModel(subject.IdSubject.ToString(), subject.SubjectName));
            }
            return Ok(subjectsSelect);
        }

        [Authorize]
        [HttpGet("GetSubjectTeachersPupil/{id}")]
        public IActionResult GetSubjectTeachersPupil(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Pupil studentModel = db.Pupil.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var teachers = _userService.GetSubjectTeachersPupil(db, id, studentModel.IdPupil);
            if (teachers != null)
            {
                List<SelectModel> teachersSelect = new List<SelectModel>();
                foreach (Teacher teacher in teachers)
                {
                    teachersSelect.Add(new SelectModel(teacher.IdTeacher.ToString(), teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
                }
                return Ok(teachersSelect);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize(Roles = roleContext.Parent)]
        [HttpGet("GetSubjectTeachersPupilParent/{subjectId}/{studentId}")]
        public IActionResult GetSubjectTeachersPupilParent(int subjectId, int studentId)
        {
            var teachers = _userService.GetSubjectTeachersPupil(db, subjectId, studentId);
            if (teachers != null)
            {
                List<SelectModel> teachersSelect = new List<SelectModel>();
                foreach (Teacher teacher in teachers)
                {
                    teachersSelect.Add(new SelectModel(teacher.IdTeacher.ToString(), teacher.Name + " " + teacher.Patronymic + " " + teacher.Surname));
                }
                return Ok(teachersSelect);
            }
            else
                return BadRequest(new { message = "Не має відповідної інформації до вашого запиту!" });
        }

        [Authorize]
        [HttpGet("classLetters")]
        public IActionResult GetAllClassLetters()
        {
            var letters = _userService.GetAllClassLetters(db);
            return Ok(letters);
        }
        [Authorize]
        [HttpGet("flows")]
        public IActionResult GetAllFlows()
        {
            var flows = _userService.GetAllFlows(db);
            List<SelectModel> flowsSelect = new List<SelectModel>();
            foreach (FlowNumber flow in flows)
            {
                flowsSelect.Add(new SelectModel(flow.IdFlow.ToString(), flow.FlowNumber1.ToString()));
            }
            return Ok(flowsSelect);
        }



        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetFlowClassLettersTeacher/{id}")]
        public IActionResult GetFlowClassLettersTeacher(int id)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();
            List<ClassLetters> letters = _userService.GetAllClassLettersTeacher(db, id, teacherModel.IdTeacher).ToList();
            List<SelectModel> classLetterSelect = new List<SelectModel>();
            foreach (ClassLetters classLetter in letters)
            {
                classLetterSelect.Add(new SelectModel(classLetter.IdLetter.ToString(), classLetter.ClassLetter));
            }
            return Ok(classLetterSelect);
        }
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("flowsTeacher")]
        public IActionResult GetAllFlowsTeacher()
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var flows = _userService.GetAllFlowsTeacher(db, teacherModel.IdTeacher);
            List<SelectModel> flowsSelect = new List<SelectModel>();
            foreach (FlowNumber flow in flows)
            {
                flowsSelect.Add(new SelectModel(flow.IdFlow.ToString(), flow.FlowNumber1.ToString()));
            }
            return Ok(flowsSelect);
        }


        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet("GetAllFlowsBySubjectAndTeacher/{subjectId}")]
        public IActionResult GetAllFlowsBySubjectAndTeacher(int subjectId)
        {
            string emailCurrentUser = User.FindFirst(ClaimTypes.Name).Value;
            Teacher teacherModel = db.Teacher.Where(classEntity => classEntity.Email == emailCurrentUser).FirstOrDefault();

            var flows = _userService.GetAllFlowsBySubjectAndTeacher(db, teacherModel.IdTeacher, subjectId);
            List<SelectModel> flowsSelect = new List<SelectModel>();
            foreach (FlowNumber flow in flows)
            {
                flowsSelect.Add(new SelectModel(flow.IdFlow.ToString(), flow.FlowNumber1.ToString()));
            }
            return Ok(flowsSelect);
        }

        [Authorize(Roles = roleContext.Admin)]
        [Authorize(Roles = roleContext.Teacher)]
        [HttpGet]
        public IActionResult GetAllParents()
        {
            var users = _userService.GetAllParents(db);
            return Ok(users);
        }
    }
}
