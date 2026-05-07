using Microsoft.AspNetCore.Mvc;
using StudentRegistrationAPI.Data;
using StudentRegistrationAPI.Models;

namespace StudentRegistrationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public StudentsController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            try
            {
                var students = await _dbContext.GetAllStudentsAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] StudentCreateDto studentDto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(studentDto.StudentName))
                    return BadRequest("Student name is required");

                if (string.IsNullOrWhiteSpace(studentDto.Email))
                    return BadRequest("Email is required");

                if (!IsValidEmail(studentDto.Email))
                    return BadRequest("Invalid email format");

                if (studentDto.DateOfBirth == default)
                    return BadRequest("Date of birth is required");

                if (string.IsNullOrWhiteSpace(studentDto.Gender))
                    return BadRequest("Gender is required");

                if (string.IsNullOrWhiteSpace(studentDto.Course))
                    return BadRequest("Course is required");

                // Check if email already exists
                if (await _dbContext.IsEmailExistsAsync(studentDto.Email))
                    return Conflict("Email already exists");

                var id = await _dbContext.CreateStudentAsync(studentDto);
                var createdStudent = await _dbContext.GetStudentByIdAsync(id);

                return CreatedAtAction(nameof(GetStudents), new { id }, createdStudent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}