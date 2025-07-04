import express from "express"
import mysql from "mysql2"
import cors from "cors" 
import 'dotenv/config';
import bcrypt from 'bcrypt'
import multer from "multer"
import jsonwebtoken from 'jsonwebtoken'
import { body, validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saltRounds=10;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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


// app.post('/login', (req, res) => {
//   const q = "SELECT * FROM users WHERE email = ? AND password = ?";
//   const values = [req.body.email, req.body.password];

//   dbPool.query(q, values, (err, results) => {
//     if (err) return res.status(500).json({ message: 'Database error.' });
//     if (results.length === 0) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }
//     res.status(200).json({ message: 'Login successful', user: results[0] });
//   });
// });

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await dbPool.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful',
      userId: user.userid,
      userType: user.usertype,
      name: user.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/register', async (req, res) => {
    const { name, email, password, userType } = req.body;
    const [rows] = await dbPool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    return res.status(400).json({ message: 'User is already registered. Sign in instead' });
  }
    
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds);
          
        const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const values = [name, email, hashPassword];
        const [result] = await dbPool.promise().query(q, values);
        
        const userId = result.insertId;
        
        if (userType.toLowerCase() === 'buyer') {
            const buyerquery = "INSERT INTO buyers(userid) VALUES(?)";
            await dbPool.promise().query(buyerquery, [userId]);
        } else if (userType.toLowerCase() === 'seller') {
            const sellerquery = "INSERT INTO sellers (userid) VALUES (?)";
            await dbPool.promise().query(sellerquery, [userId]);
        }     
        else {
          const adminquery = "INSERT INTO ADMIN (NAME,EMAIL, PASSWORD) VALUES ?, ?, ?";
           const values = [name, email, hashPassword];
           await dbPool.promise().query(adminquery, values);

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
  const { name, description, price, category_id, userId, unavailable } = req.body;
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


// Update a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
  const { name, description, price, category_id, unavailable } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const q = image_url
      ? 'UPDATE products SET name=?, description=?, price=?, category_id=?, image_url=? unavailable=? WHERE id=?'
      : 'UPDATE products SET name=?, description=?, price=?, category_id=? unavailable=?  WHERE id=?';

    const params = image_url
      ? [name, description, price, category_id, image_url, unavailable, req.params.id]
      : [name, description, price, category_id, unavailable, req.params.id];

    await dbPool.promise().query(q, params);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
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