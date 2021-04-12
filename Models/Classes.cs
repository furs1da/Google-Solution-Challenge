using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Classes
    {
        public Classes()
        {
            AnnouncementSender = new HashSet<AnnouncementSender>();
            ClassStudent = new HashSet<ClassStudent>();
            Curricular = new HashSet<Curricular>();
        }

        public int IdClass { get; set; }
        public int FlowNumber { get; set; }
        public int ClassLetter { get; set; }
        public int IdClassroomTeacher { get; set; }
        public string AccessCode { get; set; }

        public virtual ClassLetters ClassLetterNavigation { get; set; }
        public virtual ICollection<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual ICollection<ClassStudent> ClassStudent { get; set; }
        public virtual ICollection<Curricular> Curricular { get; set; }
    }
}
