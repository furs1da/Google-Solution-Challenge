using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class AdminModelForAdmin
    {
        public int idAdmin { get; set; }
        public string fio { get; set; }
        public string mail { get; set; }
        public string phone { get; set; }
        public string description { get; set; }
        public DateTime dateOfBirth { get; set; }
        public AdminModelForAdmin(int idAdmin, string fio, string mail, string phone, string description, DateTime dateOfBirth)
        {
            this.idAdmin = idAdmin;
            this.fio = fio;
            this.mail = mail;
            this.phone = phone;
            this.dateOfBirth = dateOfBirth;
            this.description = description;
        }
    }
}
