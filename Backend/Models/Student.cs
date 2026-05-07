namespace StudentRegistrationAPI.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Course { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
    }

    public class StudentCreateDto
    {
        public string StudentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Course { get; set; } = string.Empty;
    }
}