using Npgsql;
using Dapper;
using StudentRegistrationAPI.Models;

namespace StudentRegistrationAPI.Data
{
    public class DatabaseContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DatabaseContext(IConfiguration configuration)
        {
            _configuration = configuration;

            _connectionString = _configuration
                .GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string not found");
        }

        // Get All Students
        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            const string sql = @"
                SELECT 
                    id,
                    student_name AS ""StudentName"",
                    email,
                    date_of_birth::timestamp AS ""DateOfBirth"",
                    gender,
                    course,
                    registration_date::timestamp AS ""RegistrationDate""
                FROM students
                ORDER BY registration_date DESC";

            return await connection.QueryAsync<Student>(sql);
        }

        // Get Student By Id
        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            const string sql = @"
                SELECT 
                    id,
                    student_name AS ""StudentName"",
                    email,
                    date_of_birth::timestamp AS ""DateOfBirth"",
                    gender,
                    course,
                    registration_date::timestamp AS ""RegistrationDate""
                FROM students
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<Student>(
                sql,
                new { Id = id }
            );
        }

        // Create Student
        public async Task<int> CreateStudentAsync(StudentCreateDto studentDto)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            const string sql = @"
                INSERT INTO students
                (
                    student_name,
                    email,
                    date_of_birth,
                    gender,
                    course,
                    registration_date
                )
                VALUES
                (
                    @StudentName,
                    @Email,
                    @DateOfBirth,
                    @Gender,
                    @Course,
                    @RegistrationDate
                )
                RETURNING id";

            var parameters = new
            {
                studentDto.StudentName,
                studentDto.Email,
                studentDto.DateOfBirth,
                studentDto.Gender,
                studentDto.Course,
                RegistrationDate = DateTime.Now
            };

            return await connection.ExecuteScalarAsync<int>(
                sql,
                parameters
            );
        }

        // Check Duplicate Email
        public async Task<bool> IsEmailExistsAsync(string email)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            const string sql =
                "SELECT COUNT(1) FROM students WHERE email = @Email";

            return await connection.ExecuteScalarAsync<int>(
                sql,
                new { Email = email }
            ) > 0;
        }
    }
}