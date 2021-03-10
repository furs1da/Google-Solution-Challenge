using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class ParentStudent
    {
        public int Id { get; set; }
        public int IdParent { get; set; }
        public int IdStudent { get; set; }

        public virtual Parent IdParentNavigation { get; set; }
        public virtual Pupil IdStudentNavigation { get; set; }
    }
}
