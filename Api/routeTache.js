const router = require('express').Router();
const conexion = require('./config/conexion');
const authenticateToken = require('./authMiddleware');

const { body, validationResult } = require('express-validator');



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'article
 *         title:
 *           type: string
 *           description: Titre de l'article
 *         description:
 *           type: string
 *           description: Contenu ou résumé de l'article
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *
 *     ArticleInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - nom 
 *       properties:
 *         title:
 *           type: string
 *           example: Titre exemple
 *         description:
 *           type: string
 *           example: Contenu de l'article
 *         Nom:
 *           type: string
 *           example: nom 
 */

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API de gestion des articles
 */

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Obtenir tous les articles
 *     security:
 *       - bearerAuth: []  
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

router.get('/', authenticateToken, (req, res) => {
    let sql;
    let params;

    if (req.user.role === 'admin') {
        sql = `SELECT a.*, u.nom FROM tb_article a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC`;
        params = [];
    } else {
        sql = `SELECT a.*, u.nom FROM tb_article a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = ? ORDER BY a.created_at DESC`;
        params = [req.user.id];
    }

    conexion.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ erreur: 'Erreur serveur' });
        res.json(rows);
    });
});


/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Obtenir un article par ID
 *     security:
 *       - bearerAuth: []  
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'article
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tb_article WHERE id = ?';
    conexion.query(sql, [id], (err, rows) => {
        if (err) {
            res.status(500).json({ erreur: 'Erreur serveur' });
        } else if (rows.length === 0) {
            res.status(404).json({ erreur: 'Article non trouvé' });
        } else {
            res.json(rows[0]);
        }
    });
});

/**
 * @swagger
 * /api:
 *   post:
 *     summary: Ajouter un nouvel article
 *     security:
 *       - bearerAuth: []  
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article ajouté avec succès
 */
router.post('/', authenticateToken,
    [
        body('title').notEmpty(),
        body('description').notEmpty()
    ],
    (req, res) => {
        const { title, description } = req.body;
        const sql = 'INSERT INTO tb_article (title, description, user_id) VALUES (?, ?, ?)';
        conexion.query(sql, [title, description, req.user.id], (err, result) => {
            if (err) return res.status(500).json({ erreur: 'Erreur serveur' });
            res.json({ message: 'Article ajouté', id: result.insertId });
        });
    }
);


/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Modifier un article existant
 *     security:
 *       - bearerAuth: []  
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'article
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id',
    [
        body('title').notEmpty().withMessage('Le titre est requis.'),
        body('description').notEmpty().withMessage('La description est requise.')
    ],
    (req, res) => {
        const erreurs = validationResult(req);
        if (!erreurs.isEmpty()) {
            return res.status(400).json({ erreurs: erreurs.array() });
        }

        const { id } = req.params;
        const { title, description } = req.body;

        const sql = `
            UPDATE tb_article 
            SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`;
        conexion.query(sql, [title, description, id], (err, result) => {
            if (err) {
                res.status(500).json({ erreur: 'Erreur serveur' });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ erreur: 'Article non trouvé' });
            } else {
                res.json({ status: 'Article modifié' });
            }
        });
    }
);

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     security:
 *       - bearerAuth: []  
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tb_article WHERE id = ?';
    conexion.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ erreur: 'Erreur serveur' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ erreur: 'Article non trouvé' });
        } else {
            res.json({ status: 'Article supprimé' });
        }
    });
});

module.exports = router;
