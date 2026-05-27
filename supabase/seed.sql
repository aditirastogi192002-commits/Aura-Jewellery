-- ─── AURA Jewellery — Seed Data ──────────────────────────────────────────────
-- Run AFTER schema.sql
-- Paste into: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.products (name, slug, description, price, images, category, stock, featured)
values
  (
    'The Executive Ring',
    'executive-ring',
    'A statement halo ring crafted in 925 sterling silver. Set with a brilliant-cut centre stone surrounded by a pavé diamond halo — designed to command attention in the boardroom and beyond.',
    349900,
    array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    'ring',
    50,
    true
  ),
  (
    'The Commuter Cuff',
    'commuter-cuff',
    'A sleek bangle cuff in 925 sterling silver with a delicate engraved pattern. Lightweight enough to wear all day, bold enough to wear alone.',
    299900,
    array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80'],
    'cuff',
    75,
    true
  ),
  (
    'The Meeting Pendant',
    'meeting-pendant',
    'A sapphire-inspired pendant on a delicate 45cm sterling silver chain. The baguette-cut surround catches light with every movement — from morning meeting to evening drinks.',
    249900,
    array['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
    'pendant',
    60,
    true
  ),
  (
    'The Friday Set',
    'friday-set',
    'The complete AURA collection — Executive Ring, Commuter Cuff, and Meeting Pendant together in a luxury gift box. Everything you need to own the room, every day of the week.',
    599900,
    array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=80'],
    'set',
    30,
    true
  )
on conflict (slug) do nothing;  -- safe to re-run
