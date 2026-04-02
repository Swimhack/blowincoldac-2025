const express = require('express');
const path = require('path');
const { GMRScraper } = require('gm-review-scraper');

const app = express();
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;
const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Blowin+Cold+AC/@29.7672232,-95.7436276,17z/data=!3m1!4b1!4m6!3m5!1s0x8641274f732a0b3d:0xba085f6f7ca56326!8m2!3d29.7672232!4d-95.7436276!16s%2Fg%2F12606lzyt?entry=ttu';
const REVIEWS_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

let cachedReviews = {
  fetchedAt: 0,
  reviews: []
};

function createReviewScraper() {
  return new GMRScraper({
    sort_type: 'newest',
    pages: 1,
    clean: true
  });
}

function relativeTimeFromMicros(micros) {
  if (!micros) return 'Recent review';

  const publishedMs = Math.floor(Number(micros) / 1000);
  const diffMs = Date.now() - publishedMs;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (diffMs < week) {
    const days = Math.max(1, Math.round(diffMs / day));
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (diffMs < month) {
    const weeks = Math.max(1, Math.round(diffMs / week));
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  if (diffMs < year) {
    const months = Math.max(1, Math.round(diffMs / month));
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }

  const years = Math.max(1, Math.round(diffMs / year));
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function normalizeReviews(rawReviews) {
  return rawReviews.slice(0, 6).map((item) => ({
    author: item?.author?.name || 'Google reviewer',
    rating: item?.review?.rating || 5,
    text: item?.review?.text || '',
    relativeTime:
      relativeTimeFromMicros(item?.time?.published) || 'Recent review',
    source: item?.source || 'Google',
    profileUrl: item?.author?.url || '',
    response: item?.response?.text || ''
  }));
}

async function fetchReviews() {
  const now = Date.now();
  if (
    cachedReviews.reviews.length &&
    now - cachedReviews.fetchedAt < REVIEWS_CACHE_TTL_MS
  ) {
    return cachedReviews.reviews;
  }

  const scraper = createReviewScraper();
  const result = await scraper.scrape(GOOGLE_MAPS_PLACE_URL);
  const reviews = normalizeReviews(result?.reviews || []);

  if (!reviews.length) {
    throw new Error('Google review scraper returned no reviews.');
  }

  cachedReviews = {
    fetchedAt: now,
    reviews
  };

  return reviews;
}

app.disable('x-powered-by');

app.use((req, res, next) => {
  if (req.hostname && req.hostname.startsWith('www.')) {
    return res.redirect(301, `${req.protocol}://${req.hostname.slice(4)}${req.originalUrl}`);
  }
  next();
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/api/google-reviews', async (_req, res) => {
  try {
    const reviews = await fetchReviews();
    res.set('Cache-Control', 'public, max-age=900');
    res.json({ reviews, fetchedAt: cachedReviews.fetchedAt });
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error);
    res.status(502).json({
      reviews: cachedReviews.reviews,
      fetchedAt: cachedReviews.fetchedAt,
      error: 'Unable to refresh Google reviews right now.'
    });
  }
});

app.use(
  express.static(ROOT_DIR, {
    extensions: ['html'],
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      if (['.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.webp', '.woff', '.woff2'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      } else if (ext === '.html') {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
      }
    }
  })
);

app.use((_req, res) => {
  res.status(404).sendFile(path.join(ROOT_DIR, '404.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Blowin' Cold AC server listening on ${HOST}:${PORT}`);
});

