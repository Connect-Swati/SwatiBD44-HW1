//npm install express sqlite3 sqlite
//node BD4.4_HW1/initDB.js
//node BD4.4_HW1
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.4_HW1/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.4_HW1" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Fetch All Courses

Create an endpoint /courses to return all the courses.

Create a function fetchAllCourses to fetch all the courses from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses

Expected Response:

{
  'courses': [
    {
      id: 1,
      title: 'Introduction to Python',
      release_year: 2018,
    },
    // Rest of the course entries in the database in the same format
  ]
}
*/
// fucntion to fetch all courses
async function fetchAllCourses() {
  let query = "SELECT * FROM courses";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No courses found");
    }
    return { courses: result };
  } catch (error) {
    console.log("Error in fetching courses ", error.message);
    throw error;
  }
}
// api call to fetch all courses
app.get("/courses", async (req, res) => {
  try {
    let courses = await fetchAllCourses();

    /*
    courses holds => JSON object that contains an array of JSON objects
    
    Outer JSON Object: The entire structure is a single JSON object.
    Key courses: The JSON object has one key, "courses", which maps to an array.
    Array of JSON Objects: The value of the "courses" key is an array. This array contains multiple JSON objects, each representing a course. ( based on the context).
    
    */
    console.log("Succesfully fetched all courses");
    console.log("Number of courses fetched are " + courses.courses.length);
    return res.status(200).json(courses);
  } catch (error) {
    if (error.message === "No courses found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 2: Fetch Courses by Instructor

Create an endpoint /courses/instructor/:instructor to return courses by the given instructor.

Create a function fetchCoursesByInstructor to fetch courses by the instructor from the database.

Extract only id, title, instructor & category columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/instructor/John%20Doe

Expected Response:

{
  courses: [
    {
      id: 3,
      title: 'Introduction to Databases',
      instructor: 'John Doe',
      category: 'Database',
    },
    {
      id: 4,
      title: 'Data Structures',
      instructor: 'John Doe',
      category: 'Computer Science',
    },
  ],
}
*/
// function to fetch id, title, instructor & category from courses by instructor
async function fetchCoursesByInstructor(instructor) {
  let query =
    "SELECT id, title, instructor, category FROM courses WHERE instructor = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [instructor]);
    if (!result || result.length == 0) {
      throw new Error("No courses found by instructor : " + instructor);
    }
    return { courses: result };
  } catch (error) {
    console.log(
      "Error in fetching courses by instructor :  " + instructor,
      error.message,
    );
    throw error;
  }
}
// api call to fetch id, title, instructor & category from courses by instructor
app.get("/courses/instructor/:instructor", async (req, res) => {
  try {
    let instructor = req.params.instructor;
    let courses = await fetchCoursesByInstructor(instructor);
    console.log("Succesfully fetched courses by instructor : " + instructor);
    console.log("Number of courses fetched are " + courses.courses.length);
    return res.status(200).json(courses);
  } catch (error) {
    if (error.message === "No courses found by instructor : " + instructor) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Fetch Courses by Category

Create an endpoint /courses/category/:category to return courses by the given category.

Create a function fetchCoursesByCategory to fetch courses by the category from the database.

Extract only id, title, release_year & category columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/category/Database


Expected Response:

{
  courses: [
    {
      id: 3,
      title: 'Introduction to Databases',
      category: 'Database',
      release_year: 2017,
    },
  ],
}
*/
// function to fetch id, title, release_year & category from courses by category
async function fetchCoursesByCategory(category) {
  let query =
    "SELECT id, title, release_year, category FROM courses WHERE category = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [category]);
    if (!result || result.length == 0) {
      throw new Error("No courses found by category : " + category);
    }
    return { courses: result };
  } catch (error) {
    console.log(
      "Error in fetching courses by category :  " + category,
      error.message,
    );
    throw error;
  }
}
// api call to fetch id, title, release_year & category from courses by category
app.get("/courses/category/:category", async (req, res) => {
  try {
    let category = req.params.category;
    let courses = await fetchCoursesByCategory(category);
    console.log("Succesfully fetched courses by category : " + category);
    console.log("Number of courses fetched are " + courses.courses.length);
    return res.status(200).json(courses);
  } catch (error) {
    if (error.message === "No courses found by category : " + category) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 4: Fetch Courses by Year

Create an endpoint /courses/year/:year to return courses by the given release year.

Create a function fetchCoursesByYear to fetch courses by the year from the database.

Extract only id, title, release_year & category columns

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/year/2021

Expected Response:

{
  courses: [
    {
      id: 6,
      title: 'Introduction to AI',
      category: 'Artificial Intelligence',
      release_year: 2021,
    },
    {
      id: 7,
      title: 'Deep Learning Fundamentals',
      category: 'Artificial Intelligence',
      release_year: 2021,
    },
  ],
}
*/
// function to fetch id, title, release_year & category from courses by year
async function fetchCoursesByYear(year) {
  let query =
    "SELECT id, title, release_year, category FROM courses WHERE release_year = ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [year]);
    if (!result || result.length == 0) {
      throw new Error("No courses found by year : " + year);
    }
    return { courses: result };
  } catch (error) {
    console.log("Error in fetching courses by year :  " + year, error.message);
    throw error;
  }
}
// api call to fetch id, title, release_year & category from courses by year
app.get("/courses/year/:year", async (req, res) => {
  try {
    let year = req.params.year;
    let courses = await fetchCoursesByYear(year);
    console.log("Succesfully fetched courses by year : " + year);
    console.log("Number of courses fetched are " + courses.courses.length);
    return res.status(200).json(courses);
  } catch (error) {
    if (error.message === "No courses found by year : " + year) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
