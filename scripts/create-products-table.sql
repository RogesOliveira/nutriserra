-- Criar a tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  price_per_sack DECIMAL(10, 2) NOT NULL,
  sack_weight INTEGER NOT NULL,
  image TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  sub_type TEXT,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_products_animal_type ON public.products(animal_type);
CREATE INDEX IF NOT EXISTS idx_products_sub_type ON public.products(sub_type);
