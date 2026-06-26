
-- Step 1: Drop old category constraint on products
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Step 2: Add new expanded category constraint
ALTER TABLE public.products ADD CONSTRAINT products_category_check
  CHECK (category IN ('pickle','spices','clothes','handicraft','jewelry','pottery','textiles','beauty','sweets','bags','art','other'));

-- Step 3: Fix learning_content category constraint
ALTER TABLE public.learning_content DROP CONSTRAINT IF EXISTS learning_content_category_check;
ALTER TABLE public.learning_content ADD CONSTRAINT learning_content_category_check
  CHECK (category IN ('stitching','cooking','business','handicraft','beauty','pottery','jewelry','other'));

-- Step 4: Create a system seller user placeholder for seeded products
-- We use a fixed UUID for the seed seller so products have a valid seller_id
-- (This is a service-role only operation — run via Supabase dashboard SQL editor)

-- Step 5: Seed sample products (using a known seller_id — replace with real UUID after first seller signs up)
-- For now we insert with a placeholder that will be updated
-- Products are inserted only if table is empty

DO $$
DECLARE
  seed_seller_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN

    INSERT INTO public.products (seller_id, title, description, price, category, image_url, is_active) VALUES
    -- Pickle
    (seed_seller_id, 'Mango Pickle (Homemade)', 'Traditional spicy mango pickle made with mustard oil', 120, 'pickle', 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Mixed Vegetable Pickle', 'Carrot, turnip & chilli pickle in mustard oil', 100, 'pickle', 'https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Lemon Pickle', 'Tangy homemade lemon pickle with spices', 90, 'pickle', 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?w=400&h=400&fit=crop', true),

    -- Spices
    (seed_seller_id, 'Garam Masala Blend', 'Freshly ground aromatic spice mix, 200g', 80, 'spices', 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Chaat Masala', 'Tangy chaat masala for snacks & fruits', 60, 'spices', 'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Sambar Powder', 'South Indian style sambar powder, 250g', 75, 'spices', 'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Turmeric Powder', 'Pure organic turmeric powder, 200g', 55, 'spices', 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?w=400&h=400&fit=crop', true),

    -- Clothes
    (seed_seller_id, 'Hand-Stitched Kurti', 'Beautiful cotton kurti with hand embroidery', 450, 'clothes', 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Embroidered Blouse', 'Silk blouse with traditional mirror work', 380, 'clothes', 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Cotton Salwar Set', 'Comfortable daily wear salwar kameez set', 650, 'clothes', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=400&fit=crop', true),

    -- Handicraft
    (seed_seller_id, 'Macramé Wall Hanging', 'Handmade boho macramé wall decor, 24 inch', 350, 'handicraft', 'https://images.pexels.com/photos/6045028/pexels-photo-6045028.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Crochet Table Runner', 'Handcrafted cotton crochet table runner', 220, 'handicraft', 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Bamboo Basket Set', 'Set of 3 handwoven bamboo storage baskets', 480, 'handicraft', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Jute Doormat', 'Eco-friendly handmade jute doormat', 180, 'handicraft', 'https://images.pexels.com/photos/6045083/pexels-photo-6045083.jpeg?w=400&h=400&fit=crop', true),

    -- Jewelry
    (seed_seller_id, 'Beaded Necklace Set', 'Handmade colorful bead necklace with earrings', 250, 'jewelry', 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Terracotta Earrings', 'Lightweight painted terracotta earrings', 120, 'jewelry', 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Thread Bangles Set', 'Set of 12 colorful thread-wrapped bangles', 150, 'jewelry', 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Oxidised Silver Jhumkas', 'Traditional oxidised silver jhumka earrings', 320, 'jewelry', 'https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?w=400&h=400&fit=crop', true),

    -- Pottery
    (seed_seller_id, 'Handmade Clay Diya Set', 'Set of 10 hand-painted clay diyas', 150, 'pottery', 'https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Terracotta Planter', 'Hand-painted terracotta flower pot', 200, 'pottery', 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Clay Water Pot', 'Traditional clay matka water pot, 1L', 280, 'pottery', 'https://images.pexels.com/photos/6044199/pexels-photo-6044199.jpeg?w=400&h=400&fit=crop', true),

    -- Textiles
    (seed_seller_id, 'Block Print Dupatta', 'Hand block-printed cotton dupatta', 320, 'textiles', 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Tie-Dye Saree', 'Handmade tie-dye cotton saree', 850, 'textiles', 'https://images.pexels.com/photos/2220317/pexels-photo-2220317.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Embroidered Cushion Cover', 'Hand-embroidered cushion cover, 16x16 inch', 180, 'textiles', 'https://images.pexels.com/photos/6045245/pexels-photo-6045245.jpeg?w=400&h=400&fit=crop', true),

    -- Beauty
    (seed_seller_id, 'Herbal Face Pack', 'Natural multani mitti & rose face pack, 100g', 90, 'beauty', 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Coconut Hair Oil', 'Cold-pressed coconut oil with herbs, 200ml', 130, 'beauty', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Handmade Soap Bar', 'Natural neem & turmeric handmade soap', 70, 'beauty', 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?w=400&h=400&fit=crop', true),

    -- Sweets
    (seed_seller_id, 'Homemade Ladoo', 'Besan ladoo made with pure ghee, 500g', 200, 'sweets', 'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Dry Fruit Barfi', 'Mixed dry fruit barfi, 250g', 280, 'sweets', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Homemade Chakli', 'Crispy rice flour chakli, 300g', 120, 'sweets', 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?w=400&h=400&fit=crop', true),

    -- Bags
    (seed_seller_id, 'Jute Tote Bag', 'Eco-friendly hand-painted jute tote bag', 220, 'bags', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Crochet Sling Bag', 'Handmade crochet boho sling bag', 380, 'bags', 'https://images.pexels.com/photos/1204462/pexels-photo-1204462.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Embroidered Clutch', 'Hand-embroidered silk clutch purse', 450, 'bags', 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?w=400&h=400&fit=crop', true),

    -- Art
    (seed_seller_id, 'Madhubani Painting', 'Original hand-painted Madhubani art on paper', 600, 'art', 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Warli Art Canvas', 'Traditional Warli tribal art on canvas, 12x12', 750, 'art', 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?w=400&h=400&fit=crop', true),
    (seed_seller_id, 'Rangoli Stencil Set', 'Set of 10 reusable rangoli stencils', 160, 'art', 'https://images.pexels.com/photos/2372978/pexels-photo-2372978.jpeg?w=400&h=400&fit=crop', true);

  END IF;
END $$;

-- Step 6: Seed learning content if empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.learning_content LIMIT 1) THEN
    INSERT INTO public.learning_content (title, description, category, video_url, thumbnail_url) VALUES
    ('Basic Stitching for Beginners', 'Learn to stitch kurti, blouse and simple dresses from scratch', 'stitching', 'https://www.youtube.com/watch?v=5GEMBkdBqkA', 'https://img.youtube.com/vi/5GEMBkdBqkA/hqdefault.jpg'),
    ('Hand Embroidery Basics', 'Beautiful hand embroidery stitches you can learn at home', 'stitching', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg'),
    ('Blouse Cutting & Stitching', 'Step-by-step blouse cutting and stitching tutorial', 'stitching', 'https://www.youtube.com/watch?v=5GEMBkdBqkA', 'https://img.youtube.com/vi/5GEMBkdBqkA/hqdefault.jpg'),
    ('Homemade Mango Pickle Recipe', 'Traditional aam ka aachar recipe to sell from home', 'cooking', 'https://www.youtube.com/watch?v=3AAdKl1UYZs', 'https://img.youtube.com/vi/3AAdKl1UYZs/hqdefault.jpg'),
    ('Besan Ladoo Business Recipe', 'Make perfect besan ladoos to sell during festivals', 'cooking', 'https://www.youtube.com/watch?v=3AAdKl1UYZs', 'https://img.youtube.com/vi/3AAdKl1UYZs/hqdefault.jpg'),
    ('Homemade Masala Powder', 'Grind and package your own masala blends to sell', 'cooking', 'https://www.youtube.com/watch?v=3AAdKl1UYZs', 'https://img.youtube.com/vi/3AAdKl1UYZs/hqdefault.jpg'),
    ('Start a Home Business in India', 'How to start and grow a small business from home', 'business', 'https://www.youtube.com/watch?v=ZpkSd-RFLVI', 'https://img.youtube.com/vi/ZpkSd-RFLVI/hqdefault.jpg'),
    ('WhatsApp Business for Sellers', 'Use WhatsApp Business to grow your customer base', 'business', 'https://www.youtube.com/watch?v=ZpkSd-RFLVI', 'https://img.youtube.com/vi/ZpkSd-RFLVI/hqdefault.jpg'),
    ('Product Photography at Home', 'Take great product photos with just your phone', 'business', 'https://www.youtube.com/watch?v=ZpkSd-RFLVI', 'https://img.youtube.com/vi/ZpkSd-RFLVI/hqdefault.jpg'),
    ('Macramé Wall Hanging Tutorial', 'Make beautiful macramé wall hangings to sell', 'handicraft', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg'),
    ('Crochet Bag for Beginners', 'Crochet a trendy bag step by step', 'handicraft', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg'),
    ('Jute Craft Ideas to Sell', 'Creative jute craft products you can make and sell', 'handicraft', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg'),
    ('Homemade Herbal Face Pack', 'Natural face pack recipes using kitchen ingredients', 'beauty', 'https://www.youtube.com/watch?v=5GEMBkdBqkA', 'https://img.youtube.com/vi/5GEMBkdBqkA/hqdefault.jpg'),
    ('Handmade Soap Making', 'Make natural neem & turmeric soaps to sell', 'beauty', 'https://www.youtube.com/watch?v=5GEMBkdBqkA', 'https://img.youtube.com/vi/5GEMBkdBqkA/hqdefault.jpg'),
    ('Clay Diya Making at Home', 'Make and paint beautiful diyas for Diwali sales', 'pottery', 'https://www.youtube.com/watch?v=3AAdKl1UYZs', 'https://img.youtube.com/vi/3AAdKl1UYZs/hqdefault.jpg'),
    ('Terracotta Jewellery Making', 'Create and sell terracotta earrings and pendants', 'pottery', 'https://www.youtube.com/watch?v=3AAdKl1UYZs', 'https://img.youtube.com/vi/3AAdKl1UYZs/hqdefault.jpg'),
    ('Beaded Jewellery for Beginners', 'Make and sell beaded necklaces and earrings', 'jewelry', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg'),
    ('Thread Jewellery Making', 'Colorful thread jewellery that sells fast', 'jewelry', 'https://www.youtube.com/watch?v=Ld8A0je5k6Q', 'https://img.youtube.com/vi/Ld8A0je5k6Q/hqdefault.jpg');
  END IF;
END $$;
