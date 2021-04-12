using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class FlowNumber
    {
        public FlowNumber()
        {
            AnnouncementSender = new HashSet<AnnouncementSender>();
            HomeworkInfo = new HashSet<HomeworkInfo>();
            TeacherPost = new HashSet<TeacherPost>();
        }

        public int IdFlow { get; set; }
        public int FlowNumber1 { get; set; }

        public virtual ICollection<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual ICollection<HomeworkInfo> HomeworkInfo { get; set; }
        public virtual ICollection<TeacherPost> TeacherPost { get; set; }
    }
}
