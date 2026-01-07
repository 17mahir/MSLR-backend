MSLR BACKEND API DOCUMENTATION

Tech: Node.js + Express + MongoDB
Base URL: http://localhost:5000

🔐 AUTHENTICATION APIs
1️⃣ Register Voter
Endpoint
POST /api/auth/register

Authentication

❌ Not required

Request Body (JSON)
{
  "email": "user@email.com",
  "fullName": "John Doe",
  "dob": "2000-01-01",
  "password": "password123",
  "scc": "1AZN0FXJVM"
}

Success Response
{
  "message": "Registration successful"
}

Error Responses
{ "message": "All fields are required" }
{ "message": "Email already linked to a registered voter" }
{ "message": "Invalid Shangri-La Citizen Code" }
{ "message": "SCC has already been used" }
{ "message": "Voter must be at least 18 years old" }

2️⃣ Login (Voter / Admin)
Endpoint
POST /api/auth/login

Authentication

❌ Not required

Request Body
{
  "email": "ec@referendum.gov.sr",
  "password": "Shangrilavote&2025@"
}

Success Response
{
  "token": "JWT_TOKEN_STRING",
  "role": "admin",
  "email": "ec@referendum.gov.sr"
}

Error Response
{ "message": "Invalid email or password" }

🗳️ VOTER APIs (Logged-in Voters Only)

⚠️ All voter APIs require JWT

Header
Authorization: Bearer <JWT_TOKEN>

3️⃣ Get All Referendums (Voter Dashboard)
Endpoint
GET /api/voter/referendums

Authentication

✅ Required (Voter)

Request Body

❌ None

Response
[
  {
    "_id": "65a1...",
    "title": "Should Shangri-La expand?",
    "description": "Boundary expansion proposal",
    "options": [
      {
        "optionText": "Expand",
        "votes": 10
      },
      {
        "optionText": "Remain",
        "votes": 5
      }
    ],
    "status": "open",
    "createdAt": "2026-01-01T10:00:00.000Z"
  }
]

4️⃣ Vote in a Referendum
Endpoint
POST /api/voter/vote/:referendumId

Authentication

✅ Required (Voter)

Request Body
{
  "optionIndex": 0
}

Success Response
{
  "message": "Vote cast successfully"
}

Error Responses
{ "message": "Referendum not found" }
{ "message": "Referendum is closed" }
{ "message": "You have already voted" }
{ "message": "Invalid option selected" }
{ "message": "Only voters can vote" }

🏛️ ADMIN APIs (Election Commission)

⚠️ Admin JWT required

Header
Authorization: Bearer <ADMIN_JWT_TOKEN>

5️⃣ Create Referendum
Endpoint
POST /api/admin/referendums

Request Body
{
  "title": "Should Shangri-La expand?",
  "description": "Boundary expansion proposal",
  "options": ["Expand", "Remain status quo"]
}

Success Response
{
  "message": "Referendum created successfully"
}

Error
{ "message": "Title, description and at least 2 options required" }

6️⃣ Update Referendum (Before Open)
Endpoint
PUT /api/admin/referendums/:id

Request Body
{
  "title": "Updated title",
  "description": "Updated description",
  "options": ["Option A", "Option B"]
}

Success Response
{
  "message": "Referendum updated successfully"
}

Error Responses
{ "message": "Referendum not found" }
{ "message": "Cannot edit an open referendum" }

7️⃣ Open Referendum
Endpoint
PUT /api/admin/referendums/:id/open

Response
{
  "message": "Referendum opened successfully"
}

8️⃣ Close Referendum (Manual)
Endpoint
PUT /api/admin/referendums/:id/close

Response
{
  "message": "Referendum closed successfully"
}

9️⃣ View All Referendums (Admin Stats)
Endpoint
GET /api/admin/referendums

Response
[
  {
    "_id": "65a1...",
    "title": "Should Shangri-La expand?",
    "status": "open",
    "options": [
      {
        "optionText": "Expand",
        "votes": 20
      },
      {
        "optionText": "Remain",
        "votes": 10
      }
    ]
  }
]

🌐 PUBLIC REST API (TASK 2 – 20%)

❌ No authentication
✔ Must match exact format

🔟 Get Referendums by Status
Endpoint
GET /mslr/referendums?status=open

Response
{
  "Referendums": [
    {
      "referendum_id": "65a1...",
      "status": "open",
      "referendum_title": "Should Shangri-La expand?",
      "referendum_desc": "Boundary expansion proposal",
      "referendum_options": {
        "options": [
          {
            "1": "Expand",
            "votes": "20"
          },
          {
            "2": "Remain status quo",
            "votes": "10"
          }
        ]
      }
    }
  ]
}

1️⃣1️⃣ Get Referendum by ID
Endpoint
GET /mslr/referendum/:id

Response
{
  "referendum_id": "65a1...",
  "status": "open",
  "referendum_title": "Should Shangri-La expand?",
  "referendum_desc": "Boundary expansion proposal",
  "referendum_options": {
    "options": [
      {
        "1": "Expand",
        "votes": "20"
      },
      {
        "2": "Remain status quo",
        "votes": "10"
      }
    ]
  }
}

🧾 SUMMARY TABLE (Quick View)
Role	Endpoint	Method
Public	/mslr/referendums	GET
Public	/mslr/referendum/:id	GET
Auth	/api/auth/register	POST
Auth	/api/auth/login	POST
Voter	/api/voter/referendums	GET
Voter	/api/voter/vote/:id	POST
Admin	/api/admin/referendums	POST
Admin	/api/admin/referendums/:id	PUT
Admin	/api/admin/referendums/:id/open	PUT
Admin	/api/admin/referendums/:id/close	PUT
Admin	/api/admin/referendums	GET