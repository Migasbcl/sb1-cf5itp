-- Criar extensão para gerar UUIDs se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de guests
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar função para incrementar contador de guests
CREATE OR REPLACE FUNCTION increment_guest_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET guest_count = guest_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para incrementar contador
CREATE TRIGGER increment_guest_count_trigger
  AFTER INSERT ON guests
  FOR EACH ROW
  EXECUTE FUNCTION increment_guest_count();

-- Habilitar RLS para a tabela guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Permitir inserção de guests"
  ON guests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir leitura de guests pelos organizadores"
  ON guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN organizations o ON e.organization_id = o.id
      WHERE e.id = guests.event_id
      AND o.owner_id = auth.uid()
    )
  );