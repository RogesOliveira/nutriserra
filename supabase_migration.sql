-- Add sack_weight, commission fields to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS sack_weight INTEGER DEFAULT 50;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS commission_type VARCHAR(20) DEFAULT 'percentage';
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS commission_value NUMERIC(10, 2) DEFAULT 0;

-- Add origin and destination fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS origin VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS destination VARCHAR(255);

-- Update existing order_items to have default sack_weight of 50kg if null
UPDATE order_items SET sack_weight = 50 WHERE sack_weight IS NULL;

-- Make sure existing order_items have default commission values
UPDATE order_items SET commission_type = 'percentage' WHERE commission_type IS NULL;
UPDATE order_items SET commission_value = 0 WHERE commission_value IS NULL; 