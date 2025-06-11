const express = require('express');
const router = express.Router();
const conexion = require('./config/conexion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const SECRET_KEY = 'begade';
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d’un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *               role:
 *                 type: string
 *                 format: string
 *                 example: admin ou user
 *     responses:
 *       200:
 *         description: Utilisateur inscrit avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur inscrit avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */


router.post('/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'utilisateur'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, password } = req.body;
    const email = req.body.email.trim();
    const role = req.body.role || 'utilisateur';  

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [name, email, password, role], (err, result) => {
      if (err) return res.status(500).json({ erreur: 'Erreur serveur ou email déjà utilisé' });
      res.json({ message: 'Utilisateur inscrit avec succès' });
    });
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean@gmail.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       400:
 *         description: Données manquantes
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */


// 🔐 Connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ erreur: 'Email et mot de passe requis' });
    }

    const cleanEmail = email.trim();
    const sql = 'SELECT * FROM users WHERE email = ?';


    conexion.query(sql, [cleanEmail], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ erreur: 'Erreur serveur' });
        }

        if (results.length === 0) {
            console.log(" Utilisateur non trouvé pour :", cleanEmail);
            return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
        }

        const user = results[0];
        console.log(" Utilisateur trouvé :", user);


        if (password !== user.password) {
            return res.status(401).json({ erreur: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );


            return res.status(200).json({
                message: 'Connexion réussie',
                token
            });
    
    });
});

module.exports = router;




module.exports = router;
