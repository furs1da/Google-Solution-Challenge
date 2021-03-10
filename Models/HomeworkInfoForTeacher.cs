using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace shagDiplom.Models
{
    public class HomeworkInfoForTeacher
    {
        public int idHomeworkInfo { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int flowNumber { get; set; }
        public string attechement { get; set; }
        public HomeworkInfoForTeacher(int idHomeworkInfo, string Description, DateTime DueDate, int flowNumber, string attechement, string Title)
        {
            this.idHomeworkInfo = idHomeworkInfo;
            this.Description = Description;
            this.DueDate = DueDate;
            this.flowNumber = flowNumber;
            this.attechement = attechement;
            this.Title = Title;
        }
    }
}
