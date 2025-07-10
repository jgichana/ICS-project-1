import express from "express"
import mysql from "mysql2"
import cors from "cors" 
import 'dotenv/config';
import bcrypt from 'bcrypt'
import multer from "multer"
import jsonwebtoken from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import transporter from './src/config/nodemailer.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saltRounds=10;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));



//  multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: 'Invalid token' });
    req.user = user;
    next();
  });
};


const dbPool= await mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await dbPool.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      const[adminRows]=await dbPool.promise().query('Select*from admin where email=?',[email]);
      if(adminRows.length===0){
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const admin=adminRows[0];
    const isPasswordValid=await bcrypt.compare(password,admin.password);
     if(!isPasswordValid){
      return res.status(401).json({ message: 'Invalid email or password.' });
     }
   res.status(200).json({
        message: 'Login successful',
        userId: admin.id,
        userType: 'admin',
        name: admin.name
      });
    }else{
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      userId: user.userid,
      userType: user.userType,
      name: user.name
    });
  }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// app.post('/register', async (req, res) => {
//     const { name, email, password, userType } = req.body; // userType comes from the frontend

//     // 1. Basic validation (can be more robust)
//     if (!name || !email || !password || !userType) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     // 2. Check if user already exists based on email
//     try {
//         const [existingUsers] = await dbPool.promise().query('SELECT id FROM users WHERE email = ?', [email]);
//         if (existingUsers.length > 0) {
//             return res.status(409).json({ message: 'Email is already registered. Please sign in instead.' });
//         }
//     } catch (err) {
//         console.error('Error checking for existing user:', err);
//         return res.status(500).json({ message: 'Server error during registration check.' });
//     }

//     let userId; // Declare userId here so it's accessible outside the try block

//     try {
//         // 3. Hash password
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // 4. Insert user into users table with is_verified = FALSE
//         const insertUserQuery = "INSERT INTO users (name, email, password, userType, is_verified) VALUES (?, ?, ?, ?, ?)";
//         const insertUserValues = [name, email, hashedPassword, userType.toLowerCase(), false]; // Set is_verified to false
//         const [userResult] = await dbPool.promise().query(insertUserQuery, insertUserValues);

//         userId = userResult.insertId; // Get the newly created user's ID

//         // 5. Insert into specific role tables (buyer, seller, admin)
//         // Ensure userType from frontend matches these lowercase checks
//         if (userType.toLowerCase() === 'buyer') {
//             const buyerQuery = "INSERT INTO buyers (userid) VALUES (?)";
//             await dbPool.promise().query(buyerQuery, [userId]);
//         } else if (userType.toLowerCase() === 'seller') {
//             const sellerQuery = "INSERT INTO sellers (userid) VALUES (?)";
//             await dbPool.promise().query(sellerQuery, [userId]);
//         } else if (userType.toLowerCase() === 'admin') { // Assuming 'admin' is also a userType
//             // For admin, it's generally better to just rely on the 'userType' column in 'users'
//             // or have a separate admin table that also links to 'userid' from the main users table.
//             // If you have a separate 'ADMIN' table, it should still reference 'userid' from the main 'users' table.
//             // For example: INSERT INTO ADMINS (userid) VALUES (?)
//             // Or if ADMIN is truly standalone and doesn't get a users.id:
//             // const adminInsertQuery = "INSERT INTO ADMIN (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)";
//             // await dbPool.promise().query(adminInsertQuery, [name, email, hashedPassword]);
//             // For consistency, I'll assume admin also gets a main user ID.
//             // If ADMIN table doesn't have userid, then the `userId` from `userResult.insertId` is irrelevant for it.
//             // Let's assume ADMIN also gets a users.id for simplicity here.
//             const adminQuery = "INSERT INTO admins (userid) VALUES (?)"; // Assuming 'admins' table
//             await dbPool.promise().query(adminQuery, [userId]);
//         }
//         // If userType is not buyer, seller, or admin, consider an error or default behavior.

//         // --- EMAIL VERIFICATION LOGIC ---

//         // 6. Generate a unique verification token
//         const verificationToken = uuidv4();
//         const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

//         // 7. Store the token in the database (in verification_tokens table)
//         await dbPool.promise().query(
//             'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
//             [userId, verificationToken, expiresAt]
//         );
//         console.log(`Verification token stored for user ${userId}.`);

//         // 8. Construct the verification URL
//         // IMPORTANT: Replace with your actual backend domain/port if not localhost:8000
//         const verificationLink = `http://localhost:8000/api/verify-email?token=${verificationToken}`;
//         console.log('Generated verification link:', verificationLink);

//         // 9. Send the verification email
//         await transporter.sendMail({
//             from: 'your_email@gmail.com', // Must match your Nodemailer auth user
//             to: email, // The user's registered email
//             subject: 'Verify Your Email Address for [Your App Name]',
//             html: `
//                 <p>Hello ${name},</p>
//                 <p>Thank you for registering with [Your App Name]!</p>
//                 <p>Please click the following link to verify your email address:</p>
//                 <p><a href="${verificationLink}">Verify My Email</a></p>
//                 <p>This link will expire in 24 hours.</p>
//                 <p>If you did not register for an account, please ignore this email.</p>
//                 <p>Best regards,<br/>The [Your App Name] Team</p>
//             `,
//         });
//         console.log('Verification email sent successfully.');

//         // 10. Send a success response to the frontend
//         res.status(201).json({
//             message: 'Registration successful! Please check your email to verify your account.',
//             userId: userId,
//             userType: userType.toLowerCase(),
//             user: {
//                 name,
//                 email,
//                 userType: userType.toLowerCase()
//             }
//         });

//     } catch (error) {
//         console.error('Error during user registration:', error);

//         // More specific error handling
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ message: 'Email already registered.' });
//         }
//         // If an error occurs after user insertion but before token/email,
//         // you might want to consider rolling back the user insertion in a transaction.
//         // For simplicity, we'll just return a 500 here.
//         res.status(500).json({
//             message: 'Registration failed. Please try again.',
//             error: error.message
//         });
//     }
// });

app.get("/categories", (req, res)=>{
    const q = "Select * from furniture_category"
    dbPool.query(q, (err, data)=>{
        if (err) return res.json(err)
            return res.json(data);
    })
});


app.post('/categories', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const [result] = await dbPool.promise().query(
      'INSERT INTO furniture_category (name) VALUES (?)',
      [name.trim()]
    );

    const newCategory = {
      id: result.insertId,
      name: name.trim()
    };


    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Failed to add category' });
  }
});

app.post('/products', upload.single('image'), async (req, res) => {
  const { name, description, price, userId, unavailable } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!image_url) {
    return res.status(400).json({ message: 'Image is required' });
  }
  try {
    await dbPool.promise().query(
      'INSERT INTO products (name, description, price,  image_url, seller_id, unavailable) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, userId, 0]
    );
    res.status(201).json({ message: 'Product uploaded successfully' });
  } catch (err) {
    console.log('BODY:', req.body);
console.log('FILE:', req.file);
    console.error('Error uploading product:', err);
    res.status(500).json({ message: 'Failed to upload product' });
  }
});

//get a single product by id
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id; // Get the ID from the URL

    try {
        const [rows] = await dbPool.promise().query('SELECT * FROM products WHERE id = ?', [productId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(rows[0]); // Return the first (and only) product found
    } catch (err) {
        console.error('Error fetching single product:', err);
        res.status(500).json({ message: 'Failed to fetch product.', error: err.message });
    }
});




// Update a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id; // Get product ID from URL
    const { name, description, price, unavailable } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let q;
        let params;

        if (image_url) {
            q = 'UPDATE products SET name=?, description=?, price=?, image_url=?, unavailable=? WHERE id=?';
            params = [name, description, price,  image_url, unavailable, productId];
        } else {
            // Case: No new image, keep existing one
            q = 'UPDATE products SET name=?, description=?, price=?, unavailable=? WHERE id=?';
            params = [name, description, price, unavailable, productId];
        }

        const [result] = await dbPool.promise().query(q, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error updating product:', err); // Log the actual error for debugging
        res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
});


// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    await dbPool.promise().query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await dbPool.promise().query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.get('/seller/products/:userId', async (req, res) => {
  const [rows] = await dbPool.promise().query('SELECT * FROM products WHERE seller_id = ?', [req.params.userId]);
  res.json(rows);
});

// Get all products (for buyers)
app.get('/products', async (req, res) => {
  const [rows] = await dbPool.promise().query('SELECT * FROM products');
  res.json(rows);
});

// Optional: Update availability when item is added to cart
app.post('/cart/mark-unavailable', async (req, res) => {
  const { productId } = req.body;
  try {
    await dbPool.promise().query('UPDATE products SET unavailable = 1 WHERE id = ?', [productId]);
    res.json({ message: 'Marked unavailable' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

app.post('/cart/mark-available', async (req, res) => {
  const { productId } = req.body;
  try {
    await dbPool.promise().query('UPDATE products SET unavailable = 0 WHERE id = ?', [productId]);
    res.json({ message: 'Marked available' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability' });
  }
});


const port = 8000;
app.listen(port, ()=>{
    console.log("Connected to the backend via port "+ port)
})



const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SHORTCODE,
  PASSKEY,
  CALLBACK_URL
} = process.env;

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';



async function getAccessToken() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('CONSUMER_KEY or CONSUMER_SECRET not set in .env');
    throw new Error('M-Pesa API credentials missing for access token.');
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Mpesa access token:', error.response?.data || error.message);
    throw new Error('Failed to get Mpesa access token.');
  }
}

app.post('/stkpush', async (req, res) => {
  console.log('Received POST /stkpush request from frontend');
  // CORRECTED: Changed 'phoneNumber' to 'phone' to match frontend's 'phone' field
  const { amount, phone } = req.body;
  console.log('Request body:', req.body);

  // CORRECTED: Validate 'phone' instead of 'phoneNumber'
  if (!amount || !phone) {
    return res.status(400).json({ message: 'Missing required fields: amount, phone' });
  }

  let formattedPhoneNumber;
  // CORRECTED: Use 'phone' for rawPhone variable
  const rawPhone = String(phone);

  const cleanedPhone = rawPhone.startsWith('+') ? rawPhone.substring(1) : rawPhone;

  if ((cleanedPhone.startsWith('07') || cleanedPhone.startsWith('01'))&& cleanedPhone.length === 10) {
    formattedPhoneNumber = `254${cleanedPhone.substring(1)}`;
  } else if ((cleanedPhone.startsWith('2547') || cleanedPhone.startsWith('2541')) && cleanedPhone.length === 12) {
    formattedPhoneNumber = cleanedPhone;
  } else if (cleanedPhone.length === 9 && (cleanedPhone.startsWith('7') || cleanedPhone.startsWith('1'))) {
    formattedPhoneNumber = `254${cleanedPhone}`;
  } else {
    return res.status(400).json({ error: 'Invalid phone number format. Please use 07XXXXXXXX, 2547XXXXXXXX, or 7XXXXXXXX.' });
  }

  if (!formattedPhoneNumber.match(/^254\d{9}$/)) {
    return res.status(400).json({ error: 'Final formatted phone number is invalid. Must be 2547XXXXXXXX.' });
  }

  try {
    const accessToken = await getAccessToken();
    console.log('Access Token obtained:', accessToken);

    const date = new Date();
    const timestamp = [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0'),
      date.getSeconds().toString().padStart(2, '0')
    ].join('');
    console.log('Generated Timestamp:', timestamp);

    const passwordString = SHORTCODE + PASSKEY + timestamp;
    const password = Buffer.from(passwordString).toString('base64');
    console.log('Generated Password:', password);

    const payload = {
      "BusinessShortCode": SHORTCODE,
      "Password": password,
      "Timestamp": timestamp,
      "TransactionType": "CustomerPayBillOnline",
      "Amount": parseFloat(amount),
      "PartyA": formattedPhoneNumber,
      "PartyB": SHORTCODE,
      "PhoneNumber": formattedPhoneNumber,
      "CallBackURL": CALLBACK_URL,
      "AccountReference": "Furnitureshop",
      "TransactionDesc": "Furniture Item Payment"
    };

    console.log('STK Push Payload:', payload);

    const response = await axios.post(MPESA_STK_PUSH_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Mpesa STK Push Response:', response.data);
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error processing STK Push:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to process Mpesa STK Push.',
      error: error.response?.data || error.message
    });
  }
});

app.post('/mpesa-callback', (req, res) => {
  console.log('Mpesa Callback Received:', JSON.stringify(req.body, null, 2));

  res.status(200).json({ "ResultCode": 0, "ResultDesc": "Callback received successfully" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`STK Push endpoint: http://localhost:${port}/stkpush`);
  console.log(`Mpesa Callback endpoint: http://localhost:${port}/mpesa-callback`);
  console.log('Ensure your .env file is correctly configured with M-Pesa credentials.');
});



app.post('/register', async (req, res) => {
    const { name, email, password, userType } = req.body;
    console.log('Registration request received:',{name,email,userType});
    try{
    const [rows] = await dbPool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const[adminRows]=await dbPool.promise().query('SELECT * FROM admin WHERE email = ?', [email]);
    
    if (rows.length > 0 || adminRows.length>0) {
    return res.status(400).json({ message: 'User is already registered. Sign in instead' });
  }
    
    
        const hashPassword = await bcrypt.hash(password, saltRounds);
          if (userType.toLowerCase() === 'admin') {
            const adminQuery = "INSERT INTO admin(name, email, password) VALUES (?, ?, ?)";
            const values = [name, email, hashPassword];
            const [result] = await dbPool.promise().query(adminQuery, values);
            
            res.status(201).json({
                message: 'Admin registered successfully!',
                userId: result.insertId,
                userType: 'admin',
                user: { 
                    name, 
                    email, 
                    userType: 'admin' 
                }
            });
        } else {

        const q = "INSERT INTO users (name, email, password,userType) VALUES (?, ?, ?, ?)";
        const values = [name, email, hashPassword, userType.toLowerCase()];
        const [result] = await dbPool.promise().query(q, values);
        
        const userId = result.insertId;
        
        if (userType.toLowerCase() === 'buyer') {
            const buyerquery = "INSERT INTO buyers(userid) VALUES(?)";
            await dbPool.promise().query(buyerquery, [userId]);
        } else if (userType.toLowerCase() === 'seller') {
            const sellerquery = "INSERT INTO sellers (userid) VALUES (?)";
            await dbPool.promise().query(sellerquery, [userId]);
        }     
          res.status(201).json({
            message: 'User registered successfully!',
            userId: userId,
            userType: userType.toLowerCase(),
            user: { 
                name, 
                email, 
                 userType: userType.toLowerCase() 
            }
        });
      }
    } catch (error) {
      
        
        console.error('Error during user registration:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        
        res.status(500).json({ 
            message: 'Registration failed. Please try again.',
            error: error.message 
        });
    }
});


app.get('/admin/users', async (req, res) => {
  try {
    const [users] = await dbPool.promise().query('SELECT userid, name, email, userType FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.delete('/admin/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // First delete from buyers/sellers tables
    await dbPool.promise().query('DELETE FROM buyers WHERE userid = ?', [userId]);
    await dbPool.promise().query('DELETE FROM sellers WHERE userid = ?', [userId]);
    
    // Then delete from users table
    const [result] = await dbPool.promise().query('DELETE FROM users WHERE userid = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

app.delete('/admin/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await dbPool.promise().query('Delete from product_sales_report where id=?',[productId]);
    const [result] = await dbPool.promise().query('DELETE FROM products WHERE id = ?', [productId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});


