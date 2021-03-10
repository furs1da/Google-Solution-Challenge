using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class FeedBackWatchModel
    {
        public int idFeedback { get; set; }
        public string senderName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Filename { get; set; }
        public DateTime DateOfFeedback { get; set; }
        public FeedBackWatchModel(int idFeedback, string senderName, string Title, string Content, string Filename, DateTime DateOfFeedback)
        {
            this.idFeedback = idFeedback;
            this.senderName = senderName;
            this.Title = Title;
            this.Content = Content;
            this.Filename = Filename;
            this.DateOfFeedback = DateOfFeedback;
        }
    }
}
