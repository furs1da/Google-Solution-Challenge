using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class ParentModelForAdmin
    {
        public int idParent { get; set; }
        public string fio { get; set; }
        public string mail { get; set; }
        public string phone { get; set; }
        public string adress { get; set; }
        public string workPlace { get; set; }
        public DateTime dateOfBirth { get; set; }
        public ParentModelForAdmin(int idParent, string fio, string mail, string phone, string adress, string workPlace, DateTime dateOfBirth)
        {
            this.idParent = idParent;
            this.fio = fio;
            this.mail = mail;
            this.phone = phone;
            this.adress = adress;
            this.workPlace = workPlace;
            this.dateOfBirth = dateOfBirth;      
        }
    }
}
