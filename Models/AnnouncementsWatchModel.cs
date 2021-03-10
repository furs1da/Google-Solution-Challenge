using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class AnnouncementsWatchModel
    {
        public int idAnnouncement { get; set; }
        public string senderName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    
        public string Filename { get; set; }
        public DateTime DateOfAnnouncement { get; set; }
        public AnnouncementsWatchModel(int idAnnouncement, string senderName, string Title, string Content, string Filename, DateTime DateOfAnnouncement)
        {
            this.idAnnouncement = idAnnouncement;
            this.senderName = senderName;
            this.Title = Title;
            this.Content = Content;
            this.Filename = Filename;
            this.DateOfAnnouncement = DateOfAnnouncement;
        }
    }
}
