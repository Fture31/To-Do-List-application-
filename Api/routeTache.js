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
 *     tache:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'z
 *         title:
 *           type: string
 *           description: Titre de l'tache
 *         description:
 *           type: string
 *           description: Contenu ou résumé de l'tache
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *
 *     tacheInput:
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
 *           example: Contenu de l'tache
 *         Nom:
 *           type: string
 *           example: nom 
 */

/**
 * @swagger
 * tags:
 *   name: taches
 *   description: API de gestion des taches
 */

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Obtenir tous les taches
 *     security:
 *       - bearerAuth: []  
 *     tags: [taches]
 *     responses:
 *       200:
 *         description: Liste des taches récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tache'
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
 *     summary: Obtenir un tache par ID
 *     security:
 *       - bearerAuth: []  
 *     tags: [taches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'tache
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: tache trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tache'
 *       404:
 *         description: tache non trouvé
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
 *     summary: Ajouter un nouvel tache
 *     security:
 *       - bearerAuth: []  
 *     tags: [taches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tacheInput'
 *     responses:
 *       200:
 *         description: tache ajouté avec succès
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
 *     summary: Modifier un tache existant
 *     security:
 *       - bearerAuth: []  
 *     tags: [taches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'tache
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tacheInput'
 *     responses:
 *       200:
 *         description: tache modifié avec succès
 *       404:
 *         description: tache non trouvé
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
 *     summary: Supprimer un tache
 *     security:
 *       - bearerAuth: []  
 *     tags: [taches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: tache supprimé avec succès
 *       404:
 *         description: tache non trouvé
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
