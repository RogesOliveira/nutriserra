-- Adicionar coluna show_animal_names à tabela de produtos
ALTER TABLE public.produtossite ADD COLUMN IF NOT EXISTS show_animal_names BOOLEAN DEFAULT true;

-- Atualizar os produtos existentes para ter show_animal_names como true por padrão
UPDATE public.produtossite SET show_animal_names = true WHERE show_animal_names IS NULL; 