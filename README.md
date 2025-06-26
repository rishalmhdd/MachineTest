✅ Project Overview
This system allows:

Creating products with variants and sub-variants

Listing all products

Managing stock (add/remove) by variant combination

Viewing stock reports with date filters

Clean modern UI using Material UI (MUI)

Validation & user-friendly error messages

📁 Folder Structure
product-inventory-system/
├── backend/                  # Django project
│   └── ...
└── frontend/                 # React + Vite project
    └── ...
⚙️ Backend Setup (Django)
1. Prerequisites
Python 3.8+

PostgreSQL

pip, virtualenv

2. Setup Instructions
# Step 1: Navigate to backend
cd backend

# Step 2: Create and activate virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Update PostgreSQL DB credentials in settings.py
# DATABASES → NAME, USER, PASSWORD, HOST, PORT

# Step 5: Apply migrations
python manage.py makemigrations
python manage.py migrate

# Step 6: Run the server
python manage.py runserver
The API will be running at: http://localhost:8000/api/

3. API Endpoints
Endpoint	Method	Description
/api/products/create/	POST	Create new product with variants
/api/products/	GET	List all products
/api/stock/add/	POST	Add stock to a variant
/api/stock/remove/	POST	Remove stock from a variant
/api/stock/report/	GET	Get stock transaction report

💻 Frontend Setup (React + Vite + MUI)
1. Prerequisites
Node.js 18+



2. Setup Instructions
# Step 1: Navigate to frontend
cd frontend

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
The app will run at: http://localhost:5173/

🔗 API Integration Setup
File: frontend/src/APIservices/base_url.js


const base_url = 'http://localhost:8000/api';
export default base_url;
Make sure Django server is running on port 8000.

📦 Important Frontend Packages Used

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-hook-form axios react-router-dom dayjs
🧪 Test Credentials & Examples
Add Product Payload

{
  "name": "Shirt",
  "variants": [
    {
      "name": "size",
      "options": ["S", "M", "L"]
    },
    {
      "name": "color",
      "options": ["Red", "Blue", "Black"]
    }
  ]
}
Add Stock Payload

{
  "product_id": "uuid-here",
  "combination": {
    "size": "M",
    "color": "Red"
  },
  "quantity": 10
}
🛠 Optional Improvements (Bonus)
✅ Authentication with tokens

✅ Error handling with MUI Alerts

✅ Modern Material UI layout

🔜 Product image upload

🔜 Product category support

