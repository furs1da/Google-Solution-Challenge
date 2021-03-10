using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class DataTableElement
    {
        public int id { get; set; }
        public int lessonOrder { get; set; }
        public string subject { get; set; }
        public string teacher { get; set; }
        public int day { get; set; }
        public DataTableElement(int id, int lessonOrder, string subject, string teacher, int day)
        {
            this.id = id;
            this.lessonOrder = lessonOrder;
            this.subject = subject;
            this.teacher = teacher;
            this.day = day;
        }
    }
}
