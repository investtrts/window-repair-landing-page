CREATE INDEX IF NOT EXISTS idx_services_is_active_order ON services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved_created ON reviews(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_is_active_order ON pricing_tiers(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_is_active_order ON gallery(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_benefits_is_active_order ON benefits(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_additional_services_is_active_order ON additional_services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);