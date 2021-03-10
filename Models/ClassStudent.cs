using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class ClassStudent
    {
        public int Id { get; set; }
        public int IdClass { get; set; }
        public int IdStudent { get; set; }

        public virtual Classes IdClassNavigation { get; set; }
        public virtual Pupil IdStudentNavigation { get; set; }
    }
}
