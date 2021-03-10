using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class FeedbackSender
    {
        public int IdFeedback { get; set; }
        public int? SenderIdAdmin { get; set; }
        public int? SenderIdTeacher { get; set; }
        public int? SenderIdStudent { get; set; }
        public int? SenderIdParent { get; set; }
        public int? ReceiverIdAdmin { get; set; }
        public int? ReceiverIdTeacher { get; set; }
        public int? ReceiverIdParent { get; set; }
        public int? ReceiverIdStudent { get; set; }
        public string FeedbackContent { get; set; }
        public byte[] Attachements { get; set; }
        public string AttchFormatExst { get; set; }
        public DateTime DateOfFeedBack { get; set; }
        public string TitleFeedBack { get; set; }
        public string Filename { get; set; }

        public virtual Admin ReceiverIdAdminNavigation { get; set; }
        public virtual Parent ReceiverIdParentNavigation { get; set; }
        public virtual Pupil ReceiverIdStudentNavigation { get; set; }
        public virtual Teacher ReceiverIdTeacherNavigation { get; set; }
        public virtual Admin SenderIdAdminNavigation { get; set; }
        public virtual Parent SenderIdParentNavigation { get; set; }
        public virtual Pupil SenderIdStudentNavigation { get; set; }
        public virtual Teacher SenderIdTeacherNavigation { get; set; }
    }
}
