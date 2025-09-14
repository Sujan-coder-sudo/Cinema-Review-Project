import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();


// GET /movies
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, year, rating } = req.query;
    let query = {};
    if (genre) query.genre = { $in: [genre] };
    if (year) query.releaseYear = year;
    if (rating) query.averageRating = { $gte: rating };
    const movies = await Movie.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Movie.countDocuments(query);
    res.json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  
// POST /movies
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// POST /movies/favorite - mark a movie as favorite on TMDb
router.post('/favorite', authMiddleware, async (req, res) => {
  try {
    const { movie_id, favorite } = req.body;
    const response = await axios.post(
      `https://api.themoviedb.org/3/account/${process.env.TMDB_ACCOUNT_ID}/favorite`,
      {
        media_type: 'movie',
        media_id: movie_id,
        favorite: favorite
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movies/favorites - get favorite movies from TMDb
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/account/${process.env.TMDB_ACCOUNT_ID}/favorite/movies`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
