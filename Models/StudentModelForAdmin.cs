using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class StudentModelForAdmin
    {
        public int idStudent { get; set; }
        public string fio { get; set; }
        public string mail { get; set; }
        public string phone { get; set; }
        public string adress { get; set; }
        public string moto { get; set; }
        public string classInfo { get; set; }
        public byte[] imageOfStudent { get; set; }
        public DateTime dateOfBirth { get; set; }
        public StudentModelForAdmin(int idStudent, string fio, string mail, string phone, string adress, string moto, DateTime dateOfBirth, string classInfo, byte[] imageOfStudent)
        {
            this.idStudent = idStudent;
            this.fio = fio;
            this.mail = mail;
            this.phone = phone;
            this.adress = adress;
            this.moto = moto;
            this.dateOfBirth = dateOfBirth;
            this.classInfo = classInfo;
            this.imageOfStudent = imageOfStudent;
        }
    }
}
