using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using shagDiplom.Models;
using shagDiplom.Helpers;
using System.Threading.Tasks;

namespace shagDiplom.Services
{
    public interface IUserService
    {
        Admin AuthenticateAdmin(string username, string password, schoolManagementSystemDatabaseContext db);
        Teacher AuthenticateTeacher(string username, string password, schoolManagementSystemDatabaseContext db);
        Pupil AuthenticatePupil(string username, string password, schoolManagementSystemDatabaseContext db);
        Parent AuthenticateParent(string username, string password, schoolManagementSystemDatabaseContext db);

        bool checkEmailExistence(string email, schoolManagementSystemDatabaseContext db);

        IEnumerable<FlowNumber> GetAllFlowsBySubjectAndTeacher(schoolManagementSystemDatabaseContext db, int teacherId, int idSubject);
        IEnumerable<Subject> GetAllSubjectForTeacher(schoolManagementSystemDatabaseContext db, int teacherId);
        IEnumerable<Teacher> GetAllTeachers(schoolManagementSystemDatabaseContext db);
        IEnumerable<Pupil> GetAllPupils(schoolManagementSystemDatabaseContext db);
        //Task<IEnumerable<Pupil>> GetAllPupils(schoolManagementSystemDatabaseContext db);
        IEnumerable<Parent> GetAllParents(schoolManagementSystemDatabaseContext db);
        //Task<IEnumerable<Admin>> GetAllAdmins(schoolManagementSystemDatabaseContext db);
        IEnumerable<Roles> GetAllRoles(schoolManagementSystemDatabaseContext db);
        IEnumerable<Teacher> GetAllClassromTeachers(schoolManagementSystemDatabaseContext db);
        IEnumerable<Pupil> GetAllStudentsForClass(schoolManagementSystemDatabaseContext db, int flowId, int letterId);
        IEnumerable<Parent> GetAllParentOfPupil(schoolManagementSystemDatabaseContext db, int studentId);
        IEnumerable<Teacher> GetAllSubjectTeachers(schoolManagementSystemDatabaseContext db, int subjectId);
        IEnumerable<Classes> GetAllClasses(schoolManagementSystemDatabaseContext db);
        IEnumerable<GenderTypes> GetAllGenders(schoolManagementSystemDatabaseContext db);
        IEnumerable<Subject> GetAllSubjects(schoolManagementSystemDatabaseContext db);
        IEnumerable<Pupil> GetStudentsClassroomTeacher(schoolManagementSystemDatabaseContext db, int teacherId);
        IEnumerable<Pupil> GetAllChildParent(schoolManagementSystemDatabaseContext db, int parentId);
        IEnumerable<Teacher> GetSubjectTeachersPupil(schoolManagementSystemDatabaseContext db, int subjectId, int idStudent);
        IEnumerable<Subject> GetAllSubjectsPupil(schoolManagementSystemDatabaseContext db, int idStudent);
        Teacher GetClassRoomTeacherForClassPupil(schoolManagementSystemDatabaseContext db, int idStudent);
        IEnumerable<Admin> GetAllAdmins(schoolManagementSystemDatabaseContext db);
        Pupil GetByIdPupil(int id, schoolManagementSystemDatabaseContext db);
        Teacher GetByIdTeacher(int id, schoolManagementSystemDatabaseContext db);
        Teacher GetTeacherOfClass(schoolManagementSystemDatabaseContext db, int flowId, int letterId);
        Admin GetByIdAdmin(int id, schoolManagementSystemDatabaseContext db);
        Parent GetByIdParent(int id, schoolManagementSystemDatabaseContext db);
        IEnumerable<FlowNumber> GetAllFlows(schoolManagementSystemDatabaseContext db);
        IEnumerable<ClassLetters> GetAllClassLetters(schoolManagementSystemDatabaseContext db);
        IEnumerable<ClassLetters> GetAllClassLettersBySubjectAndTeacherAndFlow(schoolManagementSystemDatabaseContext db, int IdTeacher, int idFlow, int idSubject);
        IEnumerable<HomeworkInfo> GetAllHomeworkTitlesBySubjectAndTeacherAndClass(schoolManagementSystemDatabaseContext db, int IdTeacher, int idFlow, int idSubject);
        IEnumerable<FlowNumber> GetAllFlowsTeacher(schoolManagementSystemDatabaseContext db, int teacherId);
        IEnumerable<ClassLetters> GetAllClassLettersTeacher(schoolManagementSystemDatabaseContext db, int flowId, int teacherId);
    }

    public class UserService : IUserService
    {
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications  

        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public Admin AuthenticateAdmin(string username, string password, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Admin.SingleOrDefault(x => x.Email == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }

        public Teacher AuthenticateTeacher(string username, string password, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Teacher.SingleOrDefault(x => x.Email == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, "Teacher")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }

        public Pupil AuthenticatePupil(string username, string password, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Pupil.SingleOrDefault(x => x.Email == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, "Pupil")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }


        public Parent AuthenticateParent(string username, string password, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Parent.SingleOrDefault(x => x.Email == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, "Parent")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user.WithoutPassword();
        }


        public bool checkEmailExistence(string email, schoolManagementSystemDatabaseContext db) 
        {
            bool checkEmail = false;
            if (db.Pupil.Where(acccount => acccount.Email == email).FirstOrDefault() != null)
            {
                checkEmail = true;
            }
            else if (db.Parent.Where(acccount => acccount.Email == email).FirstOrDefault() != null)
            {
                checkEmail = true;
            }
            else if (db.Teacher.Where(acccount => acccount.Email == email).FirstOrDefault() != null)
            {
                checkEmail = true;
            }
            else if (db.Admin.Where(acccount => acccount.Email == email).FirstOrDefault() != null)
            {
                checkEmail = true;
            }
            return checkEmail;
        }

        public IEnumerable<Classes> GetAllClasses(schoolManagementSystemDatabaseContext db)
        {
            return db.Classes.ToList().WithoutCods();
        }
        public IEnumerable<GenderTypes> GetAllGenders(schoolManagementSystemDatabaseContext db)
        {
            return db.GenderTypes.ToList();
        }
        public IEnumerable<Subject> GetAllSubjects(schoolManagementSystemDatabaseContext db)
        {
            return db.Subject.ToList();
        }

        public IEnumerable<ClassLetters> GetAllClassLetters(schoolManagementSystemDatabaseContext db)
        {
            return db.ClassLetters.ToList();
        }
        public IEnumerable<Roles> GetAllRoles(schoolManagementSystemDatabaseContext db)
        {
            return db.Roles.ToList();
        }
        public IEnumerable<FlowNumber> GetAllFlows(schoolManagementSystemDatabaseContext db)
        {
            return db.FlowNumber.ToList();
        }

        public IEnumerable<Teacher> GetAllTeachers(schoolManagementSystemDatabaseContext db)
        {
            return db.Teacher.ToList().WithoutPasswords();
        }
        public IEnumerable<Pupil> GetAllPupils(schoolManagementSystemDatabaseContext db)
        {
            return db.Pupil.ToList().WithoutPasswords();
        }
        public IEnumerable<Admin> GetAllAdmins(schoolManagementSystemDatabaseContext db)
        {
            return db.Admin.ToList().WithoutPasswords();
        }
        public IEnumerable<Parent> GetAllParents(schoolManagementSystemDatabaseContext db)
        {
            return db.Parent.ToList().WithoutPasswords();
        }

        public IEnumerable<Teacher> GetAllClassromTeachers(schoolManagementSystemDatabaseContext db)
        {
            return db.Teacher.ToList().Where(teacher => !db.Classes.Select(classesEntity => classesEntity.IdClassroomTeacher).Contains(teacher.IdTeacher)).WithoutPasswords();
        }


        public IEnumerable<Teacher> GetAllSubjectTeachers(schoolManagementSystemDatabaseContext db, int subjectId)
        {
            List<SubjectTeacher> subjects = db.SubjectTeacher.Where(subjectEntity => subjectEntity.SubjectId == subjectId).ToList();
            return db.Teacher.ToList().Where(teacher => subjects.Select(subjectTeacherEntity => subjectTeacherEntity.TeacherId).Contains(teacher.IdTeacher)).WithoutPasswords();
        }

        public IEnumerable<Subject> GetAllSubjectForTeacher(schoolManagementSystemDatabaseContext db, int teacherId)
        {
            List<SubjectTeacher> subjects = db.SubjectTeacher.Where(subjectEntity => subjectEntity.TeacherId == teacherId).ToList();
            return db.Subject.ToList().Where(subject => subjects.Select(subjectTeacherEntity => subjectTeacherEntity.SubjectId).Contains(subject.IdSubject));
        }

        public IEnumerable<Pupil> GetAllStudentsForClass(schoolManagementSystemDatabaseContext db, int flowId, int letterId)
        {
            Classes classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == flowId && (classEntity.ClassLetter == letterId)).FirstOrDefault();
            List<ClassStudent> classStudent = db.ClassStudent.Where(pupil => pupil.IdClass == classModel.IdClass).ToList();

            return db.Pupil.ToList().Where(pupil => classStudent.Select(classStudentEntity => classStudentEntity.IdStudent).Contains(pupil.IdPupil)).WithoutPasswords();
        }
        public IEnumerable<Parent> GetAllParentOfPupil(schoolManagementSystemDatabaseContext db, int studentId)
        {
            Pupil student = db.Pupil.Where(pupilEntity => pupilEntity.IdPupil == studentId).FirstOrDefault();

            List<ParentStudent> parentStudent = db.ParentStudent.Where(pupil => pupil.IdStudent == student.IdPupil).ToList();

            return db.Parent.ToList().Where(parent => parentStudent.Select(parentStudentEntity => parentStudentEntity.IdParent).Contains(parent.IdParent)).WithoutPasswords();
        }
        public IEnumerable<Pupil> GetAllChildParent(schoolManagementSystemDatabaseContext db, int parentId)
        {
            Parent parent = db.Parent.Where(parentEntity => parentEntity.IdParent == parentId).FirstOrDefault();

            List<ParentStudent> parentStudent = db.ParentStudent.Where(parentEntity => parentEntity.IdParent == parent.IdParent).ToList();

            return db.Pupil.ToList().Where(pupil => parentStudent.Select(parentStudentEntity => parentStudentEntity.IdStudent).Contains(pupil.IdPupil)).WithoutPasswords();
        }


        public Teacher GetTeacherOfClass(schoolManagementSystemDatabaseContext db, int flowId, int letterId)
        {
            Classes classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == flowId && (classEntity.ClassLetter == letterId)).FirstOrDefault();
            return db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == classModel.IdClassroomTeacher).FirstOrDefault();
        }

        public IEnumerable<Teacher> GetSubjectTeachersPupil(schoolManagementSystemDatabaseContext db, int subjectId, int idStudent)
        {

            ClassStudent classStudentModel = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == idStudent).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModel.IdClass).FirstOrDefault();

            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.ClassId == classModel.IdClass && curricular.SubjectId == subjectId).ToList();

            return db.Teacher.ToList().Where(teacher => curriculars.Select(curricularsEntity => curricularsEntity.TeacherId).Contains(teacher.IdTeacher)).WithoutPasswords();
        }
        public IEnumerable<Subject> GetAllSubjectsPupil(schoolManagementSystemDatabaseContext db, int idStudent)
        {
            ClassStudent classStudentModel = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == idStudent).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModel.IdClass).FirstOrDefault();
            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.ClassId == classModel.IdClass).ToList();

            return db.Subject.ToList().Where(subject => curriculars.Select(curricular => curricular.SubjectId).Contains(subject.IdSubject));
        }
        public Teacher GetClassRoomTeacherForClassPupil(schoolManagementSystemDatabaseContext db, int idStudent)
        {
            ClassStudent classStudentModel = db.ClassStudent.Where(classStudentEntity => classStudentEntity.IdStudent == idStudent).FirstOrDefault();
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClass == classStudentModel.IdClass).FirstOrDefault();
            return db.Teacher.Where(teacherEntity => teacherEntity.IdTeacher == classModel.IdClassroomTeacher).FirstOrDefault();
        }

        public IEnumerable<ClassLetters> GetAllClassLettersTeacher(schoolManagementSystemDatabaseContext db, int flowId, int teacherId)
        {
            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.TeacherId == teacherId).ToList();
            List<Classes> classModel = db.Classes.Where(classEntity => curriculars.Select(curricular => curricular.ClassId).Contains(classEntity.IdClass)).ToList();
            classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == flowId).ToList();
            return db.ClassLetters.ToList().Where(letters => classModel.Select(classEntity => classEntity.ClassLetter).Contains(letters.IdLetter));
        }     
        

        public IEnumerable<HomeworkInfo> GetAllHomeworkTitlesBySubjectAndTeacherAndClass(schoolManagementSystemDatabaseContext db, int IdTeacher, int idFlow, int idSubject)
        {
            return db.HomeworkInfo.Where(hwModel => hwModel.IdTeacher == IdTeacher && hwModel.IdSubject == idSubject && hwModel.IdFlow == idFlow).ToList();
        }



        public IEnumerable<ClassLetters> GetAllClassLettersBySubjectAndTeacherAndFlow(schoolManagementSystemDatabaseContext db, int IdTeacher, int idFlow, int idSubject)
        {
            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.TeacherId == IdTeacher && curricular.SubjectId == idSubject).ToList();
            List<Classes> classModel = db.Classes.Where(classEntity => curriculars.Select(curricular => curricular.ClassId).Contains(classEntity.IdClass)).ToList();
            classModel = db.Classes.Where(classEntity => classEntity.FlowNumber == idFlow).ToList();
            return db.ClassLetters.ToList().Where(letters => classModel.Select(classEntity => classEntity.ClassLetter).Contains(letters.IdLetter));
        }
        public IEnumerable<FlowNumber> GetAllFlowsTeacher(schoolManagementSystemDatabaseContext db, int teacherId)
        {
            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.TeacherId == teacherId).ToList();
            List<Classes> classModel = db.Classes.Where(classEntity => curriculars.Select(curricular => curricular.ClassId).Contains(classEntity.IdClass)).ToList();
            return db.FlowNumber.ToList().Where(flowEntity => classModel.Select(classEntity => classEntity.FlowNumber).Contains(flowEntity.IdFlow));
        }

        public IEnumerable<FlowNumber> GetAllFlowsBySubjectAndTeacher(schoolManagementSystemDatabaseContext db, int teacherId, int idSubject)
        {
            List<Curricular> curriculars = db.Curricular.Where(curricular => curricular.TeacherId == teacherId && curricular.SubjectId == idSubject).ToList();
            List<Classes> classModel = db.Classes.Where(classEntity => curriculars.Select(curricular => curricular.ClassId).Contains(classEntity.IdClass)).ToList();
            return db.FlowNumber.ToList().Where(flowEntity => classModel.Select(classEntity => classEntity.FlowNumber).Contains(flowEntity.IdFlow));
        }

        public IEnumerable<Pupil> GetStudentsClassroomTeacher(schoolManagementSystemDatabaseContext db, int teacherId)
        {
            Classes classModel = db.Classes.Where(classEntity => classEntity.IdClassroomTeacher == teacherId).FirstOrDefault();
            if (classModel == null)
                return null;
            List<ClassStudent> classStudent = db.ClassStudent.Where(classEntity => classEntity.IdClass == classModel.IdClass).ToList();

            return db.Pupil.ToList().Where(pupil => classStudent.Select(parentStudentEntity => parentStudentEntity.IdStudent).Contains(pupil.IdPupil)).WithoutPasswords();
        }

        public Pupil GetByIdPupil(int id, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Pupil.FirstOrDefault(x => x.IdPupil == id);
            return user.WithoutPassword();
        }

        public Teacher GetByIdTeacher(int id, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Teacher.FirstOrDefault(x => x.IdTeacher == id);
            return user.WithoutPassword();
        }

        public Admin GetByIdAdmin(int id, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Admin.FirstOrDefault(x => x.IdAdmin == id);
            return user.WithoutPassword();
        }

        public Parent GetByIdParent(int id, schoolManagementSystemDatabaseContext db)
        {
            var user = db.Parent.FirstOrDefault(x => x.IdParent == id);
            return user.WithoutPassword();
        }
    }
}