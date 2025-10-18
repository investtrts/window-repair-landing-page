CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    service_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_comment TEXT
);

CREATE INDEX idx_reviews_approved ON reviews(is_approved, created_at DESC);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);