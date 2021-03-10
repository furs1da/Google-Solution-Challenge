using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class TeacherModelForAdmin
    {
        public int idTeacher { get; set; }
        public string fio { get; set; }
        public string mail { get; set; }
        public string phone { get; set; }

        public string adress { get; set; }
        public string subjects { get; set; }
        public byte[] imageOfTeacher { get; set; }
        public DateTime dateOfBirth { get; set; }
        public TeacherModelForAdmin(int idTeacher, string fio, string mail, string phone, string adress, DateTime dateOfBirth, string subjects, byte[] imageOfTeacher)
        {
            this.idTeacher = idTeacher;
            this.fio = fio;
            this.mail = mail;
            this.phone = phone;
            this.adress = adress;
            this.dateOfBirth = dateOfBirth;
            this.subjects = subjects;
            this.imageOfTeacher = imageOfTeacher;
        }
    }
}
